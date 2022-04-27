// SPDX-License-Identifier: MIT
pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JUSD is ERC20 {

    constructor() public ERC20("Jack USD Token", "JUSD") {
        _mint(msg.sender, 100000000 * 1e18);
    }
}
