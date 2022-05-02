// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract Mimic is ERC20, ERC20Burnable {

     using SafeERC20 for ERC20;
    constructor() public ERC20("Mimic Token", "MIM") {
        _mint(msg.sender, 100000000 * 1e18);
    }
}
