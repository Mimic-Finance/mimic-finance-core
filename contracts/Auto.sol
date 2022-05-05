// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma abicoder v2;

import "./Token/JUSD.sol";
import "./Token/Mimic.sol";
import "./Token/cJUSD.sol";
import "./Farming.sol";
import "./Swap.sol";
import "./Uniswap.sol";
import "./Manager.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract Auto is Ownable {
    using SafeERC20 for ERC20;
    using SafeMath for uint256;
    string public name = "Auto-Compound Contract";

    ERC20 internal MIM;
    ERC20 internal JUSD;
    ERC20 internal CJUSD;
    Farming internal FarmContract;
    Swap internal SwapContract;
    Uniswap internal UniContract;
    Manager internal PoolManager;

    uint24 public constant mimicFee = 3000;
    uint24 public constant jusdFee = 500;


    /* Other Contract Address */
    address internal FarmAddress;
    address internal SwapAddress;
    address internal JUSDAddress;
    address internal MIMAddress;
    address internal CJUSDAddress;
    address internal UniAddress;

    mapping (address => uint256) depositbalance;

    constructor(
        address _JUSD,
        address _MIM,
        address _Farming,
        address _cJUSD,
        address _Swap,
        address _Manager,
        address _Uniswap
    ) public {
        /* Initial Token with token address */
        MIM = ERC20(_MIM);
        JUSD = ERC20(_JUSD);
        CJUSD = ERC20(_cJUSD);

        /* Initial Farm and Swap Contract with token address */
        SwapContract = Swap(_Swap);
        FarmContract = Farming(_Farming);
        PoolManager = Manager(_Manager);
        UniContract = Uniswap(_Uniswap);

        /* Initial Farm and Swap Contract address */
        FarmAddress = _Farming;
        SwapAddress = _Swap;
        JUSDAddress = _JUSD;
        UniAddress = _Uniswap;
        CJUSDAddress = _cJUSD;
        MIMAddress = _MIM;
    }

    function deposit(uint256 _amount, address _token) public {
        require(PoolManager.checkWhitelisted(_token) && _amount > 0);
        /* Transfer any token that in whitelist from user to Auto-Compound Contract */
        ERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        if (_token != JUSDAddress) {
            /*Swap any token to jusd*/
            SwapContract.swapToJUSD(_amount, _token);
            /*Transfer to Swap Contract*/
            ERC20(_token).safeTransfer(SwapAddress, _amount);
        }
        uint256 balance = PoolManager.checkDecimals(_token, _amount);
        /* Auto-Compound:: Approve JUSD for spend amount to Farm */
        JUSD.approve(FarmAddress, balance);
        /* Stake JUSD in Farm Contract with Auto-Compound */
        FarmContract.stakeTokens(balance, JUSDAddress);
        /*Approve jusd to swap*/
        JUSD.approve(UniAddress,balance);
        depositbalance[msg.sender] = depositbalance[msg.sender].add(balance);
        uint256 swapbalance = UniContract.swapExactInputSingle(balance , JUSDAddress , CJUSDAddress , jusdFee);
        CJUSD.safeTransfer(msg.sender,swapbalance);
    }

    function claimMIM(address _token) public onlyOwner {
        /* Claim Mimic Token */
        FarmContract.claimRewards(_token);
    }

    function swapMIM() public onlyOwner returns(uint256) {
        /* Check Mimic Token balance */
        uint256 MIMbalance = MIM.balanceOf(address(this));
        /* Swap Mimic To JUSD */
        MIM.approve(UniAddress, MIMbalance);
        uint256 balance = UniContract.swapExactInputSingle(MIMbalance , MIMAddress , JUSDAddress , mimicFee);
        return balance;
    }

    function swapJUSDtoCJUSD(uint256 _amount) public onlyOwner {
        JUSD.approve(UniAddress,_amount);
        UniContract.swapExactInputSingle(_amount , JUSDAddress , CJUSDAddress , jusdFee);
    }

    function depositToFarm(uint256 _amount) public onlyOwner {
        /* Auto-Compound:: Approve JUSD for spend amount to Farm */
        JUSD.approve(FarmAddress, _amount);
        /* Stake JUSD in Farm Contract with Auto-Compound */
        FarmContract.stakeTokens(_amount, JUSDAddress);
    }

    function withdraw(uint256 _amount) public {
        require(depositbalance[msg.sender] > 0);
        /* Transfer cJUSD to Auto Compound */
        CJUSD.safeTransferFrom(msg.sender, address(this), _amount);
        CJUSD.approve(UniAddress,_amount);
        uint256 swapbalance = UniContract.swapExactInputSingle(_amount , CJUSDAddress , JUSDAddress , jusdFee);
        /* Unstake JUSD from Farming Contract */
        FarmContract.unstakeTokens( depositbalance[msg.sender] , JUSDAddress);
        /* Return JUSD to user */
        JUSD.safeTransfer(msg.sender, swapbalance);
        if(swapbalance > depositbalance[msg.sender]){
            depositbalance[msg.sender] = 0;
        } else {
            uint256 remain = depositbalance[msg.sender].sub(swapbalance);
            depositbalance[msg.sender] = remain;
        }
    }
    function getDepositBalance(address _account) public view returns (uint256){
        return depositbalance[_account];
    }
    function getcJUSDBalance() public view returns (uint256) {
        return CJUSD.balanceOf(address(this));
    }

    function getJUSDBalance() public view returns (uint256) {
        return JUSD.balanceOf(address(this));
    }

   
}
