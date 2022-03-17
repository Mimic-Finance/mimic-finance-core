// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./JUSD.sol";
import "./Mimic.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Swap {
    string public name = "Swap";
    ERC20 public JUSDToken;
    ERC20Burnable public MimicToken;

    constructor(address _JUSDToken, address _MimicToken) {
        JUSDToken = ERC20(_JUSDToken);
        MimicToken = ERC20Burnable(_MimicToken);
    }
    
   function random() internal returns (uint) {
    uint ran = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender,"mimic"))) % 900;
    ran = ran + 100;
    return ran;
    }

    function SwapToken(uint256 _amount) public {
        uint256 balance = _amount;
        MimicToken.burnFrom(msg.sender, balance);
        uint256 ran = random();
        uint256 div = SafeMath.div(balance,ran);
        uint256 rate = SafeMath.mul(div, 1e2);
        JUSDToken.transfer(msg.sender,rate);
    }
}
