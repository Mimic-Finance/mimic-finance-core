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

    function mimToJUSD(uint256 _amount) public {
        uint256 price = mimicPrice();
        uint256 balance = _amount.div(price);
        //mimic
        MIM.safeTransferFrom(msg.sender, address(this), _amount);
        liquidity[1][MimicAddress] = liquidity[1][MimicAddress].sub(_amount);
        //JUSD
        JUSD.safeTransfer(msg.sender, balance);
        liquidity[1][JUSDAddress] = liquidity[1][JUSDAddress].add(balance);
    }

    function JUSDTocJUSD(uint256 _amount) public {
        uint256 price = cJUSDPrice();
        uint256 rate = _amount.div(price);
        JUSD.safeTransferFrom(msg.sender, address(this), _amount);
        liquidity[2][JUSDAddress] = liquidity[2][JUSDAddress].add(_amount);
        cJUSD.safeTransfer(msg.sender, rate);
        liquidity[2][cJUSDAddress] = liquidity[2][cJUSDAddress].sub(rate);
    }

    function addLiquidity(
        address _token1,
        uint256 _amount1,
        address _token2,
        uint256 _amount2
    ) public {
        ERC20(_token1).safeTransferFrom(msg.sender, address(this), _amount1);
        ERC20(_token2).safeTransferFrom(msg.sender, address(this), _amount2);
        if (
            (_token1 == MimicAddress && _token2 == JUSDAddress) ||
            (_token1 == JUSDAddress && _token2 == MimicAddress)
        ) {
            if (_token1 == MimicAddress && _token2 == JUSDAddress) {
                liquidity[1][_token1] = liquidity[1][_token1].add(_amount1);
                liquidity[1][_token2] = liquidity[1][_token2].add(_amount2);
            } else if (_token1 == JUSDAddress && _token2 == MimicAddress) {
                liquidity[1][_token1] = liquidity[1][_token2].add(_amount2);
                liquidity[1][_token2] = liquidity[1][_token1].add(_amount1);
            }
        } else if (
            (_token1 == JUSDAddress && _token2 == cJUSDAddress) ||
            (_token1 == cJUSDAddress && _token2 == JUSDAddress)
        ) {
            if (_token1 == JUSDAddress && _token2 == cJUSDAddress) {
                liquidity[2][_token1] = liquidity[2][_token1].add(_amount1);
                liquidity[2][_token2] = liquidity[2][_token2].add(_amount2);
            } else if (_token1 == cJUSDAddress && _token2 == JUSDAddress) {
                liquidity[2][_token1] = liquidity[2][_token2].add(_amount2);
                liquidity[2][_token2] = liquidity[2][_token1].add(_amount1);
            }
        }
    }

    function mimicPrice() public view returns (uint256) {
        uint256 rate = liquidity[1][JUSDAddress].div(
            liquidity[1][MimicAddress]
        );
        return rate;
    }

    function cJUSDPrice() public view returns (uint256) {
        uint256 rate = liquidity[2][JUSDAddress].div(
            liquidity[2][cJUSDAddress]
        );
        return rate;
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

    function removeWhitelisted(address _token) public onlyOwner {
        uint256 i = findWhitedlisted(_token);
        removeByIndex(i);
    }

    function findWhitedlisted(address _token) public view returns (uint256) {
        uint256 i = 0;
        while (whitelisted[i] != _token) {
            i++;
        }
        return i;
    }

    function getWhitelisted() public view returns (address[] memory) {
        return whitelisted;
    }

    function removeByIndex(uint256 i) public {
        while (i < whitelisted.length - 1) {
            whitelisted[i] = whitelisted[i + 1];
            i++;
        }
        whitelisted.pop();
    }

    function checkWhitelisted(address _token) public view returns (bool) {
        for (uint256 i = 0; i < whitelisted.length; i++) {
            if (whitelisted[i] == _token) {
                return true;
            }
        }
        return false;
    }
}
