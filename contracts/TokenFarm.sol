pragma solidity ^0.5.0;

import "./Dapptoken.sol";
import "./Daitoken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    //Stake Token
    function stakeTokens(uint256 _amount) public {
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

    //Issuing Token
    function issueTokens() public {
        //set access to function only owner only
        require(msg.sender == owner, "call must be the owner");
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

    //Unstake with amount
    function unstakeTokens(uint256 _amount) public {
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
