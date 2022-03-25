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
    address internal constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    //Dex
    Dex public DEX;

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public stakingUSDCBalance;
    mapping(address => uint256) public updateTime;

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
        stakingBalance[msg.sender] = SafeMath.add(stakingBalance[msg.sender], _amount );
        updateTime[msg.sender] = block.timestamp;
    }

    //Stake USDC
    function stakeUSDC(uint256 _amount) public {
        require(_amount > 0, "amount can not be 0");
        ERC20(USDC).approve(address(this), _amount);
        ERC20(USDC).transferFrom(msg.sender, address(this), _amount);
        stakingUSDCBalance[msg.sender] = SafeMath.add(stakingUSDCBalance[msg.sender],_amount);
        updateTime[msg.sender] = block.timestamp;
    }
    function checkUSDCBalance(address account) public {
        ERC20(USDC).balanceOf(account);
    }

    //Check reward by address without send function (no gas)
    function checkRewardByAddress(address _address)
        public
        view
        returns (uint256)
    {
        uint256 reward = calculateRewards(_address);
        return reward;
    }

    function calculateTime(address account) public view returns (uint256) {
        uint256 time = block.timestamp;
        uint256 totalTime = time - updateTime[account];
        return totalTime;
    }

    function calculateRewards(address account) public view returns (uint256) {
        uint256 time = SafeMath.mul(calculateTime(account), 1e18);
        uint256 rate = 864;
        uint256 timeRate = time / rate;
        uint256 reward = SafeMath.div(
            SafeMath.mul(stakingBalance[account], timeRate),
            1e18
        );
        return reward;
    }

    //Issuing Token
    function issueTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        uint256 reward = calculateRewards(msg.sender);
        require(reward > 0 && balance > 0);
        MimicToken.transfer(msg.sender, reward);
        updateTime[msg.sender] = block.timestamp;
    }

    //Unstake with amount
    function unstakeTokens(uint256 _amount) public {
        require(_amount > 0, "staking balance cannot be 0");
        JUSDToken.transfer(msg.sender, _amount);
        uint256 remain = SafeMath.sub(stakingBalance[msg.sender], _amount);
        stakingBalance[msg.sender] = remain;

        //withdraw and claim reward
        uint256 reward = calculateRewards(msg.sender);
        // require(reward > 0 && stakingBalance[msg.sender] >= 0);
        MimicToken.transfer(msg.sender, reward);
        updateTime[msg.sender] = block.timestamp;
    }
}
