// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma abicoder v2;

import "./Token/JUSD.sol";
import "./Token/Mimic.sol";
import "./Token/cJUSD.sol";
import "./Farming.sol";
import "./Swap.sol";
import "./JUSDTocJUSD.sol";
import "./MIMToJUSD.sol";
import "./cJUSDToJUSD.sol";

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
    JUSDTocJUSD internal JUSDTocJUSDContract;
    MIMToJUSD internal MIMToJUSDContract;
    cJUSDToJUSD internal cJUSDToJUSDContract;


    /* Other Contract Address */
    address internal FarmAddress;
    address internal SwapAddress;
    address internal JUSDAddress;
    address internal MIMToJUSDAddress;
    address internal JUSDTocJUSDAddress;
    address internal cJUSDToJUSDAddress;

    mapping (address => uint256) depositbalance;
    uint256 stakingBalance;

    constructor(
        address _JUSD,
        address _MIM,
        address _Farming,
        address _cJUSD,
        address _Swap,
        address _JUSDTocJUSD,
        address _MIMToJUSD,
        address _cJUSDToJUSD
    ) public {
        /* Initial Token with token address */
        MIM = ERC20(_MIM);
        JUSD = ERC20(_JUSD);
        CJUSD = ERC20(_cJUSD);

        /* Initial Farm and Swap Contract with token address */
        SwapContract = Swap(_Swap);
        FarmContract = Farming(_Farming);
        JUSDTocJUSDContract =  JUSDTocJUSD(_JUSDTocJUSD);
        MIMToJUSDContract = MIMToJUSD(_MIMToJUSD);
        cJUSDToJUSDContract = cJUSDToJUSD(_cJUSDToJUSD);

        /* Initial Farm and Swap Contract address */
        FarmAddress = _Farming;
        SwapAddress = _Swap;
        JUSDAddress = _JUSD;
        MIMToJUSDAddress = _MIMToJUSD;
        JUSDTocJUSDAddress = _JUSDTocJUSD;
        cJUSDToJUSDAddress = _cJUSDToJUSD;
    }

    function deposit(uint256 _amount, address _token) public {
        require(FarmContract.checkWhitelisted(_token) && _amount > 0);
        uint256 decimals = ERC20(_token).decimals();
        uint256 balance = _amount;
        /* Transfer any token that in whitelist from user to Auto-Compound Contract */
        ERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        if (_token != JUSDAddress) {
            /*Swap any token to jusd*/
            SwapContract.swapToJUSD(_amount, decimals);
            /*Transfer to Swap Contract*/
            ERC20(_token).safeTransfer(SwapAddress, _amount);
        }
        if (decimals != 18) {
            uint256 remain = 18 - decimals;
            balance = _amount.mul(10**remain);
        }
        /* Auto-Compound:: Approve JUSD for spend amount to Farm */
        JUSD.approve(FarmAddress, balance);
        /* Stake JUSD in Farm Contract with Auto-Compound */
        FarmContract.stakeTokens(balance, JUSDAddress);
        /*Add to TVD*/
        stakingBalance = stakingBalance.add(balance);
        /*Approve jusd to swap*/
        JUSD.approve(JUSDTocJUSDAddress,balance);
        depositbalance[msg.sender] = depositbalance[msg.sender].add(balance);
        uint256 swapbalance = JUSDTocJUSDContract.swapExactInputSingle(balance);
        CJUSD.safeTransfer(msg.sender,swapbalance);
    }

    function claimMIM(address _token) public onlyOwner {
        /* Claim Mimic Token */
        FarmContract.claimRewards(_token);
    }

    function swapMIM() public onlyOwner {
        /* Check Mimic Token balance */
        uint256 mimbal = MIM.balanceOf(address(this));
        /* Swap Mimic To JUSD */
        MIM.approve(MIMToJUSDAddress, mimbal);
        MIMToJUSDContract.swapExactInputSingle(mimbal);
    }

    function swapJUSDtoCJUSD() public onlyOwner {
        uint256 jusd = JUSD.balanceOf(address(this));
        JUSD.approve(JUSDTocJUSDAddress, jusd);
    
    }

    function depositToFarm(uint256 _amount) public onlyOwner {
        /* Auto-Compound:: Approve JUSD for spend amount to Farm */
        JUSD.approve(FarmAddress, _amount);
        /* Stake JUSD in Farm Contract with Auto-Compound */
        FarmContract.stakeTokens(_amount, JUSDAddress);
    }

    function withdraw(uint256 _amount) public {
        /* Transfer cJUSD to Auto Compound */
        CJUSD.safeTransferFrom(msg.sender, address(this), _amount);
        CJUSD.approve(cJUSDToJUSDAddress,_amount);
        uint256 swapbalance = cJUSDToJUSDContract.swapExactInputSingle(_amount);
        /* Unstake JUSD from Farming Contract */
        FarmContract.unstakeTokens( swapbalance , JUSDAddress);
        /* Return JUSD to user */
        JUSD.safeTransfer(msg.sender, swapbalance);
        if(swapbalance > depositbalance[msg.sender]){
            depositbalance[msg.sender] = 0;
        }
        uint256 TVDremain = stakingBalance.sub(swapbalance);
        uint256 remain = depositbalance[msg.sender].sub(swapbalance);
        stakingBalance = TVDremain;
        depositbalance[msg.sender] = remain;
    }

    function getStakingBalance() public view returns (uint256) {
        return stakingBalance;
    }

    function getcJUSDBalance() public view returns (uint256) {
        return CJUSD.balanceOf(address(this));
    }

    function getJUSDBalance() public view returns (uint256) {
        return JUSD.balanceOf(address(this));
    }

   
}
