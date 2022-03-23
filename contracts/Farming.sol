// SPDX-License-Identifier: MIT

pragma solidity 0.6.6;

import "./JUSD.sol";
import "./Mimic.sol";

import "./Dex.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Farming {
    string public name = "Mimic Governance Token Farming";
    ERC20 public MimicToken;
    ERC20 public JUSDToken;

    //Dex
    Dex public DEX;

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public stakingUSDCBalance;
    mapping(address => uint256) public lastUpdate;

    uint256 public rewardRate = 10;

    constructor(
        address _MimicToken,
        address _JUSDToken,
        address _DEX
    ) public {
        MimicToken = ERC20(_MimicToken);
        JUSDToken = ERC20(_JUSDToken);
        DEX = Dex(_DEX);
    }

    //Stake Tokens
    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "amount can not be 0");
        JUSDToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] = SafeMath.add(
            stakingBalance[msg.sender],
            _amount
        );
        lastUpdate[msg.sender] = block.timestamp;
    }

    function stakeStableCoin(uint256 _amount, address _tokenAddress) public {
        require(_amount > 0, "amount can not be 0");
        // USDC.transferFrom(msg.sender, address(this), _amount);
        // stakingUSDCBalance[msg.sender] = SafeMath.add(
        //     stakingUSDCBalance[msg.sender],
        //     _amount
        // );
        //lastUpdate[msg.sender] = block.timestamp;
        DEX.swapTokenForEth(_amount, msg.sender, _tokenAddress);
    }

    //Check Reward
    function checkReward() public view returns (uint256) {
        uint256 balance = stakingBalance[msg.sender];
        uint256 update = SafeMath.sub(block.timestamp, lastUpdate[msg.sender]);
        uint256 rewardB = SafeMath.mul(update, rewardRate);
        uint256 divbal = SafeMath.div(balance, 1e4);
        uint256 reward = SafeMath.mul(divbal, rewardB);
        return reward;
    }

    //Check reward by address without send function (no gas)
    function checkRewardByAddress(address _address)
        public
        view
        returns (uint256)
    {
        uint256 balance = stakingBalance[_address];
        uint256 update = SafeMath.sub(block.timestamp, lastUpdate[_address]);
        uint256 rewardB = SafeMath.mul(update, rewardRate);
        uint256 divbal = SafeMath.div(balance, 1e4);
        uint256 reward = SafeMath.mul(divbal, rewardB);
        return reward;
    }

    //Issuing Token
    function issueTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        uint256 update = SafeMath.sub(block.timestamp, lastUpdate[msg.sender]);
        uint256 rewardB = SafeMath.mul(update, rewardRate);
        uint256 divbal = SafeMath.div(balance, 1e4);
        uint256 reward = SafeMath.mul(divbal, rewardB);
        require(reward > 0 && balance > 0);
        MimicToken.transfer(msg.sender, reward);
        lastUpdate[msg.sender] = block.timestamp;
    }

    //Unstake with amount
    function unstakeTokens(uint256 _amount) public {
        uint256 balance = _amount;
        require(balance > 0, "staking balance cannot be 0");

        uint256 staking_balance = stakingBalance[msg.sender];
        uint256 update = SafeMath.sub(block.timestamp, lastUpdate[msg.sender]);
        uint256 rewardB = SafeMath.mul(update, rewardRate);
        uint256 divbal = SafeMath.div(staking_balance, 1e4);
        uint256 reward = SafeMath.mul(divbal, rewardB);

        JUSDToken.transfer(msg.sender, balance);
        uint256 remain = stakingBalance[msg.sender] - balance;
        stakingBalance[msg.sender] = remain;

        //withdraw and claim reward
        require(reward > 0 && staking_balance > 0);
        MimicToken.transfer(msg.sender, reward);
        lastUpdate[msg.sender] = block.timestamp;
    }
}
