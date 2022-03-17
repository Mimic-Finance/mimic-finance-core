// SPDX-License-Identifier: MIT
pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract Mimic is ERC20, ERC20Burnable {
    constructor() public ERC20("Mimic Token", "MIM") {
        _mint(msg.sender, 10000000 * 1e18);
    }
}
