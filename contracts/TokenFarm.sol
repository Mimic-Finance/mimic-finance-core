// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./Dapptoken.sol";
import "./Daitoken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    ERC20 public dappToken;
    ERC20 public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public userRewardPaid;
    mapping(address => uint256) public rewards;

    uint256 public rewardRate = 100;
    uint256 public lastUpdate = block.timestamp;
    uint256 public rewardStore;

    constructor(address _dappToken, address _daiToken){
        dappToken = ERC20(_dappToken);
        daiToken = ERC20(_daiToken);
        owner = msg.sender;
    }

    //Stake Token
    function stakeTokens(uint256 _amount) external updateReward(msg.sender) {
        require(_amount > 0, "amount can be 0");
        // Dai -> Token farm
        daiToken.transferFrom(msg.sender, address(this), _amount);
        //Check Balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        //Add Stakers to staker array
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        // Update status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function rewardsPerToken() public view returns (uint256){
      return rewardStore+(((block.timestamp - lastUpdate)*rewardRate* 1e16));
    }
    function earned(address account) public view returns(uint256){
        return (stakingBalance[account]*rewardsPerToken() - userRewardPaid[account]/1e16)+rewards[account];
    }
    modifier updateReward(address account) {
        rewardStore = rewardsPerToken();
        lastUpdate = block.timestamp;
        rewards[account]=earned(account);
        userRewardPaid[account]=rewardStore;
        _;
    }
    //Issuing Token
    function issueTokens(address account) external updateReward(msg.sender) {
        uint256 reward = rewards[account];
        rewards[account]=0;
        dappToken.transfer(account,reward);
    }

    //Unstake with amount
    function unstakeTokens(uint256 _amount) external updateReward(msg.sender) {
        //Fetching staking balance
        uint256 balance = _amount;

        //Balance must > 0
        require(balance > 0, "staking balance cannot be 0");

        //Transfer mDai from token farm to investors
        daiToken.transfer(msg.sender, balance);

        uint256 remain = stakingBalance[msg.sender] - balance;
        //Reset Staking Balance
        stakingBalance[msg.sender] = remain;

        //Update Staking status
        isStaking[msg.sender] = false;
    }
}
