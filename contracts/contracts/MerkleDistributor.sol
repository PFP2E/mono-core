// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title MerkleDistributor
 * @notice A contract to distribute ERC-20 rewards based on a Merkle root for multiple epochs.
 * @dev This contract manages distinct distribution cycles (epochs), each with its own Merkle root.
 */
contract MerkleDistributor is Ownable {
    IERC20 public immutable rewardToken;
    uint256 public currentEpoch;

    // Mapping from epoch number to the Merkle root for that epoch.
    mapping(uint256 => bytes32) public merkleRoots;

    // Mapping to track claims per epoch to prevent double-claiming.
    // Format: mapping(epoch => mapping(account => bool))
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    event Claimed(uint256 indexed epoch, address indexed account, uint256 amount);
    event EpochStarted(uint256 indexed epoch, bytes32 indexed root);

    constructor(address _rewardToken, address _initialOwner) Ownable(_initialOwner) {
        rewardToken = IERC20(_rewardToken);
    }

    /**
     * @notice Starts a new distribution epoch by setting a new Merkle root.
     * @dev This increments the current epoch counter. Can only be called by the owner.
     * @param _root The Merkle root for the new epoch.
     */
    function startNewEpoch(bytes32 _root) external onlyOwner {
        currentEpoch++;
        merkleRoots[currentEpoch] = _root;
        emit EpochStarted(currentEpoch, _root);
    }

    /**
     * @notice Allows an eligible account to claim their reward for a specific epoch.
     * @param _epoch The epoch from which to claim.
     * @param _amount The amount of tokens to claim.
     * @param _merkleProof The Merkle proof to verify eligibility.
     */
    function claim(uint256 _epoch, uint256 _amount, bytes32[] calldata _merkleProof) external {
        require(_epoch > 0 && _epoch <= currentEpoch, "Invalid epoch");
        require(merkleRoots[_epoch] != bytes32(0), "Distribution not active for this epoch");
        require(!hasClaimed[_epoch][msg.sender], "Tokens already claimed for this epoch");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));
        require(MerkleProof.verify(_merkleProof, merkleRoots[_epoch], leaf), "Invalid proof");

        hasClaimed[_epoch][msg.sender] = true;
        require(rewardToken.transfer(msg.sender, _amount), "Transfer failed");

        emit Claimed(_epoch, msg.sender, _amount);
    }
}