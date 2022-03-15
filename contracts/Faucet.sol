// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./DaiToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Faucet {
    ERC20 public daiToken;

    constructor(address _daiToken) {
        daiToken = ERC20(_daiToken);
    }

    function claim() public {
        address recipient = msg.sender;
        daiToken.transfer(recipient, 10000 * 1e18);
    }

    function distributeToken(address recipient) public {
        daiToken.transfer(recipient, 10000 * 1e18);
    }
}
