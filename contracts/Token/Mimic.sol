// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Mimic is ERC20 {
    constructor() ERC20("Mimic Token", "MIM") {}
}
