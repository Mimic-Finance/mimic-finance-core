// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Manager is Ownable {
    using SafeERC20 for ERC20;

    address[] public whitelisted;
    address[] public mintWhitelisted;

   function addWhitelisted(address _token) external onlyOwner {
        require(!checkWhitelisted(_token));
        whitelisted.push(_token);
    }

    function removeWhitelisted(address _token) external onlyOwner {
        uint256 i = findWhitedlisted(_token);
        removeByIndex(i);
    }

    function findWhitedlisted(address _token) public view returns (uint256) {
        uint256 i = 0;
        while (whitelisted[i] != _token) {
            ++i;
        }
        return i;
    }

    function getWhitelisted() external view returns (address[] memory) {
        return whitelisted;
    }

    function removeByIndex(uint256 i) public {
        uint256 length = whitelisted.length;
        while (i < --length) {
            whitelisted[i] = whitelisted[++i];
            ++i;
        }
        whitelisted.pop();
    }

    function checkWhitelisted(address _token) public view returns (bool) {
        uint256 length = whitelisted.length;
        for (uint256 i = 0; i < length;) {
            if (whitelisted[i] == _token) {
                return true;
            }
            unchecked { ++i;}
        }
        return false;
    }

     function addMintWhitelisted(address _token) external onlyOwner {
        require(!checkMintWhitelisted(_token));
        mintWhitelisted.push(_token);
    }

    function checkMintWhitelisted(address _token) public view returns (bool) {
        uint256 length = mintWhitelisted.length;
        for (uint256 i = 0; i < length;) {
            if (mintWhitelisted[i] == _token) {
                return true;
            }
            unchecked {++i;}
        }
        return false;
    }


    function checkDecimals(address _token , uint256 _amount) public view returns(uint256) {
    uint256 decimals = ERC20(_token).decimals();
    if(decimals != 18){
        uint256 remain = 18 - decimals;
        return _amount*(10 ** remain);
    }
    else {
        return _amount;
    } 
    }
    function decimalsBack(address _token , uint256 _amount) public view returns(uint256){
        uint256 decimals  = ERC20(_token).decimals();
        if(decimals != 18){
            uint256 remain = 18 - decimals;
            return _amount/(10**remain);
        }
        else  {
            return _amount;
    }
    }
}
