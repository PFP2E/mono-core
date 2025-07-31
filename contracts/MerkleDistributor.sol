// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title MerkleDistributor
 * @notice A contract to distribute ERC-20 rewards based on a Merkle root.
 * @dev This is a minimal, pragmatic implementation for the hackathon. It focuses
 * exclusively on the claim process. The contract is funded via direct transfer.
 */
contract MerkleDistributor is Ownable {
    IERC20 public immutable rewardToken;
    bytes32 public merkleRoot;

    // Simple mapping to prevent double-claiming within a single distribution.
    // A production system would need a more robust solution for multiple epochs.
    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed account, uint256 amount);
    event MerkleRootUpdated(bytes32 indexed root);

    constructor(address _rewardToken, address _initialOwner) Ownable(_initialOwner) {
        rewardToken = IERC20(_rewardToken);
    }

    /**
     * @notice Sets the Merkle root for a new distribution.
     * @dev This also resets the `hasClaimed` mapping for the demo.
     */
    function setMerkleRoot(bytes32 _root) external onlyOwner {
        merkleRoot = _root;
        // Note: In this simple POC, we don't reset the hasClaimed mapping.
        // A new deployment would be used for a new distribution.
        emit MerkleRootUpdated(_root);
    }

    /**
     * @notice Allows an eligible account to claim their reward.
     * @param _amount The amount of tokens to claim.
     * @param _merkleProof The Merkle proof to verify eligibility.
     */
    function claim(uint256 _amount, bytes32[] calldata _merkleProof) external {
        require(merkleRoot != bytes32(0), "Distribution not active");
        require(!hasClaimed[msg.sender], "Tokens already claimed");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Invalid proof");

        hasClaimed[msg.sender] = true;
        require(rewardToken.transfer(msg.sender, _amount), "Transfer failed");

        emit Claimed(msg.sender, _amount);
    }
}
