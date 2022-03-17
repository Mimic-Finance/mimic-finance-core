// SPDX-License-Identifier: MIT

pragma solidity 0.6.6;

import "./JUSD.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Faucet {
    ERC20 public JUSDToken;

    constructor(address _JUSDToken) public {
        JUSDToken = ERC20(_JUSDToken);
    }

    function claim() public {
        address recipient = msg.sender;
        JUSDToken.transfer(recipient, 10000 * 1e18);
    }

    function distributeToken(address recipient) public {
        JUSDToken.transfer(recipient, 10000 * 1e18);
    }
}
