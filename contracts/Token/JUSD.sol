// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JUSD is ERC20 {
    constructor() ERC20("Jack USD Token", "JUSD") {}
}
