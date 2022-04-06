// SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Utils{
    function balance (address _token , address _account) public{
        ERC20(_token).balanceOf(_account);
    }
    function approve (address _token , address _account , uint256 _amount) public {
        ERC20(_token).approve(_account, _amount);
    }
}

