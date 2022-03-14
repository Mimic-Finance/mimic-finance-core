// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./Dapptoken.sol";
import "./Daitoken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract TokenFarm {
    string public name = "Dapp Token Farm";
    ERC20 public dappToken;
    ERC20 public daiToken;

    mapping(address => uint256) public stakingBalance;
    mapping (address => uint256) public lastUpdate;

    uint256 public rewardRate = SafeMath.mul(3234193,1e11);

    constructor(address _dappToken, address _daiToken) {
        dappToken = ERC20(_dappToken);
        daiToken = ERC20(_daiToken);
    }

    //Stake Tokens
    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "amount can not be 0");
        daiToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] = SafeMath.add(stakingBalance[msg.sender], _amount);
        lastUpdate[msg.sender] = block.timestamp;
    }

    //Check Reward
    function checkReward() public view returns (uint256) {
        uint256 update = SafeMath.sub(block.timestamp, lastUpdate[msg.sender]);
        uint256 reward = SafeMath.mul(update, rewardRate);
        return reward;
    }

    //Issuing Token
    function issueTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        uint256 update = SafeMath.sub(block.timestamp, lastUpdate[msg.sender]);
        uint256 reward = SafeMath.mul(update, rewardRate);
        if (balance > 0) {
                dappToken.transfer(msg.sender,reward);
            }
        lastUpdate[msg.sender] = block.timestamp;
    }

    //Unstake with amount
    function unstakeTokens(uint256 _amount) public{
        uint256 balance = _amount;
        require(balance > 0, "staking balance cannot be 0");
        daiToken.transfer(msg.sender, balance);
        uint256 remain = stakingBalance[msg.sender] - balance;
        stakingBalance[msg.sender] = remain;
    }
}
