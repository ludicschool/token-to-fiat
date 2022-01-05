// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Changetoken is Ownable {
    mapping(uint256 => uint256) public price;
    mapping(uint256 => uint256) public dogma;
    // aqui poner la direccion
    IERC20 public token = IERC20(0x8E4899FC4D98cA4bDF5AC3CF04824cFF519A63Cc);
    event Buy(address owner, uint256 tokenChange, uint256 price);

    function buy(
        uint256 _price,
        uint256 _tokenChange,
        address _address
    ) public onlyOwner returns (bool) {
        require(
            token.balanceOf(address(this)) > 0,
            "El balance del token del contrato es igual a 0"
        );
        require(
            _tokenChange < token.balanceOf(address(this)),
            "No existe el balance del token en el contrato"
        );
        token.transfer(_address, _tokenChange);
        emit Buy(_address, _tokenChange, _price);
        return true;
    }

    function withdraw(address _address, uint256 _tokenChange) public onlyOwner {
        token.transfer(_address, _tokenChange);
    }
}
