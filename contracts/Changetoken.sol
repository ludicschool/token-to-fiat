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
    IERC20 public token = IERC20(0x031c0BCa1dBDE2A9D14b72f27c3Fb109334ac29e);
    event Buy(
        address owner,
        uint256 dogma,
        uint256 price
    );


    function buy(
        uint256 _price,
        uint256 _dogma,
        address _address
    ) public onlyOwner returns (bool) {
        // faltan validaciones de que la cantidad de dogmas sean mayor a 0, que si haya esa cantidad de dogmas en el contrato etc etc 
        token.transfer(_address, _dogma);        
        emit Buy(
            _address,
            _dogma,
            _price
        );
        return true;
    }
    function withdraw( address _address, uint256 _dogma) public onlyOwner {
        token.transfer(_address, _dogma);
    }


}