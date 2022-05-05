// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAI is ERC20 {
    constructor() ERC20("DAI Coin", "DAI") {}
}
