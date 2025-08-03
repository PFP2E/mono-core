// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../contracts/interfaces/IAggregationRouterV5.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockAggregationRouter is IAggregationRouterV5 {
    function swap(
        SwapDescription calldata desc,
        bytes calldata data
    ) external payable returns (uint256 returnAmount, uint256 spentAmount) {
        // Transfer the source token from the sender (MerkleDistributor)
        IERC20(desc.srcToken).transferFrom(msg.sender, address(this), desc.amount);

        // "Swap" by simply transferring the same amount of the destination token to the receiver
        // In a real scenario, this would involve a DEX, but for testing we just mint/transfer
        IERC20(desc.dstToken).transfer(desc.dstReceiver, desc.amount);

        return (desc.amount, desc.amount);
    }
}
