// SPDX-License-Identifier: MIT

pragma solidity 0.6.6;

import "./JUSD.sol";
import "./Mimic.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swap is Ownable {
    using SafeERC20 for ERC20;
    using SafeMath for uint256;
    string public name = "Swap";
    ERC20 public JUSDToken;
    ERC20 public MimicToken;
    address[] public whitelisted;
    mapping(address => mapping(address => uint256)) public swapbalance;

    constructor(address _JUSDToken, address _MimicToken) public {
        JUSDToken = ERC20(_JUSDToken);
        MimicToken = ERC20Burnable(_MimicToken);
    }
    function swapToJUSD (uint256 _amount , uint256 _decimals) public {
        if(_decimals == 18){
            JUSDToken.transfer(msg.sender , _amount);
        }
         uint256 remain = 18 - _decimals;
         uint256 balance = _amount.mul(10 ** remain);
         JUSDToken.transfer(msg.sender,balance);
    }
    function mimToJUSD(uint256 _amount) public {
        uint256 balance = _amount.div(10);
        MimicToken.transferFrom(msg.sender, address(this),balance);
        JUSDToken.transfer(msg.sender, balance);
    }

    function JUSDMinter(uint256 _amount , address _token)public{
        require(_amount > 0 && checkWhitelisted(_token));
        ERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        swapbalance[_token][msg.sender] = swapbalance[_token][msg.sender].add(_amount);
        JUSDToken.safeTransfer(msg.sender,_amount);
    }

    function redeemBack(uint256 _amount , address _token)public {
        require(swapbalance[_token][msg.sender] <= _amount);
        JUSDToken.safeTransferFrom(msg.sender,address(this),_amount);
        ERC20(_token).safeTransfer(msg.sender,_amount);
    }

    function addWhitelisted(address _token) public onlyOwner {
        require(!checkWhitelisted(_token));
        whitelisted.push(_token);
    }

    function removeWhitelisted(address _token) public onlyOwner {
        uint256 i = findWhitedlisted(_token);
        removeByIndex(i);
    }

    function findWhitedlisted(address _token) public view returns (uint256) {
        uint256 i = 0;
        while (whitelisted[i] != _token) {
            i++;
        }
        return i;
    }

    function getWhitelisted() public view returns (address[] memory) {
        return whitelisted;
    }

    function removeByIndex(uint256 i) public {
        while (i < whitelisted.length - 1) {
            whitelisted[i] = whitelisted[i + 1];
            i++;
        }
        whitelisted.pop();
    }

    function checkWhitelisted(address _token) public view returns (bool) {
        for (uint256 i = 0; i < whitelisted.length; i++) {
            if (whitelisted[i] == _token) {
                return true;
            }
        }
        return false;
    }
    
}
