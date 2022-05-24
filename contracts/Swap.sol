// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./Token/JUSD.sol";
import "./Token/Mimic.sol";
import "./Token/cJUSD.sol";
import "./Manager.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swap is Ownable {
    using SafeERC20 for ERC20;
    string public name = "Swap";
    ERC20 public JUSDToken;
    ERC20 public MIM;
    ERC20 public cJUSDToken;
    Manager internal MintManager;

    address JUSDAddress;
    address cJUSDAddress;
    address MimicAddress;

    mapping(address => mapping(address => uint256)) public swapbalance;

    event Mint(address indexed user, uint256 amount, address token);
    event Redeem(address indexed user, uint256 amount, address token);

    constructor(
        address _JUSD,
        address _MIM,
        address _cJUSD,
        address _Manager
    ) {
        JUSDToken = ERC20(_JUSD);
        MIM = ERC20(_MIM);
        cJUSDToken = ERC20(_cJUSD);
        MintManager = Manager(_Manager);

        JUSDAddress = _JUSD;
        cJUSDAddress = _cJUSD;
        MimicAddress = _MIM;
    }

    function swapToJUSD(uint256 _amount, address _token) external {
        uint256 balance = MintManager.checkDecimals(_token, _amount);
        JUSDToken.safeTransfer(msg.sender, balance);
    }

    function JUSDMinter(uint256 _amount, address _token) external {
        require(_amount > 0 && MintManager.checkMintWhitelisted(_token));
        ERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        uint256 balance = MintManager.checkDecimals(_token, _amount);
        JUSDToken.safeTransfer(msg.sender, balance);
        swapbalance[_token][msg.sender] += _amount;
        emit Mint(msg.sender, _amount, _token);
    }

    function redeemBack(uint256 _amount, address _token) external {
        require(swapbalance[_token][msg.sender] <= _amount);
        JUSDToken.safeTransferFrom(msg.sender, address(this), _amount);
        uint256 balance = MintManager.decimalsBack(_token, _amount);
        ERC20(_token).safeTransfer(msg.sender, balance);
        swapbalance[_token][msg.sender] -= balance;
        emit Redeem(msg.sender, _amount, _token);
    }

    function getMintBalance(address _token, address _account)
        public
        view
        returns (uint256)
    {
        return swapbalance[_token][_account];
    }
}
