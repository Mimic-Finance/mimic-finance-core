// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "./Token/JUSD.sol";
import "./Token/Mimic.sol";
import "./Token/cJUSD.sol";
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

    address JUSDAddress;
    address cJUSDAddress;
    address MimicAddress;

    address[] public whitelisted;
    mapping(address => mapping(address => uint256)) public swapbalance;
    mapping(uint256 => mapping(address => uint256)) public liquidity;

    constructor(
        address _JUSD,
        address _MIM,
        address _cJUSD
    ) public {
        JUSD = ERC20(_JUSD);
        MIM = ERC20(_MIM);
        cJUSD = ERC20(_cJUSD);

        JUSDAddress = _JUSD;
        cJUSDAddress = _cJUSD;
        MimicAddress = _MIM;
    }

    function swapToJUSD(uint256 _amount, uint256 _decimals) public {
        if (_decimals != 18) {
            uint256 remain = 18 - _decimals;
            uint256 balance = _amount.mul(10**remain);
            JUSD.safeTransfer(msg.sender, balance);
        } else if (_decimals == 18) {
            JUSD.safeTransfer(msg.sender, _amount);
        }
    }

    function JUSDMinter(uint256 _amount, address _token) public {
        require(_amount > 0 && checkWhitelisted(_token));
        uint256 decimals = ERC20(_token).decimals();
        uint256 balance = _amount;
        ERC20(_token).safeTransferFrom(msg.sender, address(this), balance);
        swapbalance[_token][msg.sender] = swapbalance[_token][msg.sender].add(
            _amount
        );
        if (decimals == 18) {
            JUSD.safeTransfer(msg.sender, _amount);
        } else if (decimals != 18) {
            uint256 remain = 18 - decimals;
            uint256 deci = _amount.mul(10**remain);
            JUSD.safeTransfer(msg.sender, deci);
        }
    }

    function redeemBack(uint256 _amount, address _token) public {
        require(swapbalance[_token][msg.sender] <= _amount);
        JUSD.safeTransferFrom(msg.sender, address(this), _amount);
        ERC20(_token).safeTransfer(msg.sender, _amount);
    }

    function addWhitelisted(address _token) public onlyOwner {
        require(!checkWhitelisted(_token));
        whitelisted.push(_token);
    }

    function checkWhitelisted(address _token) public view returns (bool) {
        for (uint256 i = 0; i < whitelisted.length; i++) {
            if (whitelisted[i] == _token) {
                return true;
            }
        }
        return false;
    }

    function getMintBalance(address _token, address _account)public view returns (uint256){
        return swapbalance[_token][_account];
    }
}
