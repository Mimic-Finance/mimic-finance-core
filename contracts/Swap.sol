// SPDX-License-Identifier: MIT

pragma solidity 0.6.6;

import "./JUSD.sol";
import "./Mimic.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Swap {
    using SafeMath for uint256;
    string public name = "Swap";
    ERC20 public JUSDToken;
    ERC20Burnable public MimicToken;

    constructor(address _JUSDToken, address _MimicToken) public {
        JUSDToken = ERC20(_JUSDToken);
        MimicToken = ERC20Burnable(_MimicToken);
    }

    function random() internal view returns (uint256) {
        uint256 ran = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, "mimic"))
        ) % 900;
        ran = ran + 100;
        return ran;
    }

    function SwapToken(uint256 _amount) public {
        uint256 balance = _amount;
        MimicToken.burnFrom(msg.sender, balance);
        uint256 ran = random();
        uint256 div = balance.div(ran);
        uint256 rate = div.mul(1e2);
        JUSDToken.transfer(msg.sender, rate);
    }

    function swapToJUSD (uint256 _amount , uint256 _decimals) public {
        if(_decimals == 18){
            JUSDToken.transfer(msg.sender , _amount);
        }
         uint256 remain = 18 - _decimals;
         uint256 balance = _amount.mul(10 ** remain);
         JUSDToken.transfer(msg.sender,balance);
    }
    function mimToJUSD(uint256 _amount) public {
        uint256 balance = _amount.div(10);
        MimicToken.transferFrom(msg.sender, address(this),balance);
        JUSDToken.transfer(msg.sender, balance);
    }
}
