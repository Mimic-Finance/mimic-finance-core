// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "./Token/JUSD.sol";
import "./Token/Mimic.sol";
import "./Token/cJUSD.sol";
import "./Manager.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swap is Ownable {
    using SafeERC20 for ERC20;
    using SafeMath for uint256;
    string public name = "Swap";
    ERC20 public JUSD;
    ERC20 public MIM;
    ERC20 public cJUSD;
    Manager internal MintManager;

    address JUSDAddress;
    address cJUSDAddress;
    address MimicAddress;

    mapping(address => mapping(address => uint256)) public swapbalance;

    constructor(
        address _JUSD,
        address _MIM,
        address _cJUSD,
        address _Manager
    ) public {
        JUSD = ERC20(_JUSD);
        MIM = ERC20(_MIM);
        cJUSD = ERC20(_cJUSD);
        MintManager = Manager(_Manager);

        JUSDAddress = _JUSD;
        cJUSDAddress = _cJUSD;
        MimicAddress = _MIM;
    }

    function swapToJUSD(uint256 _amount, address _token) public {
        uint256 balance = MintManager.checkDecimals(_token,_amount);
        JUSD.safeTransfer(msg.sender,balance);
    }

    function JUSDMinter(uint256 _amount, address _token) public {
        require(_amount > 0 && MintManager.checkMintWhitelisted(_token));
        ERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        uint256 balance = MintManager.checkDecimals(_token , _amount);
        JUSD.safeTransfer(msg.sender, balance);
        swapbalance[_token][msg.sender] = swapbalance[_token][msg.sender].add(_amount);
    }

    function redeemBack(uint256 _amount, address _token) public {
        require(swapbalance[_token][msg.sender] <= _amount);
        JUSD.safeTransferFrom(msg.sender, address(this), _amount);
        uint256 balance = MintManager.decimalsBack(_token , _amount);
        ERC20(_token).safeTransfer(msg.sender,balance);
        swapbalance[_token][msg.sender] = swapbalance[_token][msg.sender].sub(balance);
    }

    function getMintBalance(address _token, address _account)
        public
        view
        returns (uint256)
    {
        return swapbalance[_token][_account];
    }
}
