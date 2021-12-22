// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 public _totalLoansPayed;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => uint256) public price;
    mapping(uint256 => uint256) public dogma;
    mapping(uint256 => uint256) public paidLimit;
    mapping(address => bool) public blacklist;
    mapping(address => uint256) public trustPercentage;
    mapping(address => uint256) public numberLoans;
    mapping(uint256 => uint256) public totalDogmaSend;
    mapping(uint256 => uint256) public totalPriceSend;

    IERC20 public token = IERC20(0xce0576de7171b382A6e339bfE32e820E9F57385d);
    event Mint(
        address owner,
        uint256 dogma,
        uint256 price,
        uint256 dogmaSend,
        uint256 priceSend
    );
    event Pay(address owner, uint256 price, uint256 id, string uri);

    constructor() ERC721("DOGMA", "DMA") {
        _totalLoansPayed = 1;
    }

    function mint(
        string memory _tokenURI,
        uint256 _price,
        uint256 _dogma,
        address _address,
        uint256 _days
    ) public onlyOwner returns (bool) {
        _tokenIds.increment();
        uint256 _tokenId = _tokenIds.current();
        uint256 totalDogma = token.balanceOf(address(this));
        uint256 userLoansPayed = numberLoans[_address];
        price[_tokenId] = _price;
        dogma[_tokenId] = _dogma;
        paidLimit[_tokenId] = block.timestamp + (_days * 1 days);
        trustPercentage[_address] =
            trustPercentage[_address] +
            ((_dogma * 20000000000000000) / totalDogma) +
            ((userLoansPayed * 20000000000000000) / _totalLoansPayed);
        _mint(_address, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        totalDogmaSend[_tokenId] =
            _dogma +
            (_dogma * trustPercentage[_address]) /
            1000000000000000000;
        totalPriceSend[_tokenId] = (totalDogmaSend[_tokenId] * _price) / _dogma;
        token.transferFrom(address(this), _address, totalDogmaSend[_tokenId]);
        emit Mint(
            _address,
            _dogma,
            _price,
            totalDogmaSend[_tokenId],
            totalPriceSend[_tokenId]
        );
        return true;
    }

    function pay(
        uint256 _id,
        uint256 _dogma,
        address _address
    ) public onlyOwner returns (bool) {
        token.transferFrom(_address, address(this), _dogma);
        _burn(_id);
        _totalLoansPayed = _totalLoansPayed + 1;
        emit Pay(_address, price[_id], _id, tokenURI(_id));
        return true;
    }

    function addBlacklist(address _blackAddress)
        public
        onlyOwner
        returns (bool)
    {
        require(
            !blacklist[msg.sender],
            "Error, address repeat in the blacklist"
        );
        blacklist[_blackAddress] = true;
        return true;
    }

    function balance() public view returns (uint256 balanceUser) {
        balanceUser = token.balanceOf(address(this));
    }

    function paidTime(uint256 _id) public view returns (uint256 limit) {
        limit = paidLimit[_id];
    }

    function allowance(address _client)
        public
        view
        returns (uint256 allowanceDogma)
    {
        allowanceDogma = token.allowance(_client, address(this));
    }
}
