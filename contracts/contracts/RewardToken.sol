// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @notice A simple ERC20 token for testing reward distributions.
 * @dev Owner can mint tokens to any address.
 */
contract RewardToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Reward Token", "RWT") Ownable(initialOwner) {}

    /**
     * @notice Mints new tokens to a specified address.
     * @dev Can only be called by the contract owner.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
