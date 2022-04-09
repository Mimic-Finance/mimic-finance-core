// SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ERC20Utils {
    using SafeMath for uint256;

    function balanceOf(address _token, address _account)
        public
        view
        returns (uint256)
    {
        uint256 balance = ERC20(_token).balanceOf(_account);
        return balance;
    }

    function approve(
        address _token,
        address _account,
        uint256 _amount
    ) public {
        ERC20(_token).approve(_account, _amount);
    }

    function transferFrom(
        address _token,
        address _sender,
        address _recipient,
        uint256 _amount
    ) public {
        ERC20(_token).transferFrom(_sender, _recipient, _amount);
    }

    function transfer(
        address _token,
        address _recipient,
        uint256 _amount
    ) public {
        ERC20(_token).transfer(_recipient, _amount);
    }

    function totalSupply(address _token) public view {
        ERC20(_token).totalSupply();
    }

    function name(address _token) public view {
        ERC20(_token).name();
    }

    function symbol(address _token) public view {
        ERC20(_token).symbol();
    }

    function decimals(address _token) public view {
        ERC20(_token).decimals();
    }

    function allowance(
        address _token,
        address _owner,
        address _spender
    ) public view {
        ERC20(_token).allowance(_owner, _spender);
    }

    function increaseAllowance(
        address _token,
        address _spender,
        uint256 _addedValue
    ) public {
        ERC20(_token).increaseAllowance(_spender, _addedValue);
    }

    function decreaseAllowance(
        address _token,
        address _spender,
        uint256 _subtractedValue
    ) public {
        ERC20(_token).decreaseAllowance(_spender, _subtractedValue);
    }
}
