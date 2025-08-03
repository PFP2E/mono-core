// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./interfaces/IAggregationRouterV5.sol";

/**
 * @title MerkleDistributor
 * @notice A contract to distribute ERC-20 rewards based on a Merkle root for multiple epochs.
 * @dev This contract manages distinct distribution cycles (epochs), each with its own Merkle root.
 */
contract MerkleDistributor is Ownable {
    IERC20 public immutable rewardToken;
    IAggregationRouterV5 public immutable oneInchRouter;
    uint256 public currentEpoch;

    // Mapping from epoch number to the Merkle root for that epoch.
    mapping(uint256 => bytes32) public merkleRoots;

    // Mapping to track claims per epoch to prevent double-claiming.
    // A leaf is built from a social handle and an amount, so storing the leaf
    // ensures that a specific handle can only claim its specific amount once per epoch.
    mapping(bytes32 => bool) public hasClaimed;

    event Claimed(uint256 indexed epoch, address indexed account, uint256 amount);
    event EpochStarted(uint256 indexed epoch, bytes32 indexed root);

    constructor(address _rewardToken, address _oneInchRouter, address _initialOwner) Ownable(_initialOwner) {
        rewardToken = IERC20(_rewardToken);
        oneInchRouter = IAggregationRouterV5(_oneInchRouter);
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
     * @param _socialHandle The social handle of the user being verified.
     * @param _amount The amount of tokens to claim.
     * @param _merkleProof The Merkle proof to verify eligibility.
     */
    function claim(uint256 _epoch, string calldata _socialHandle, uint256 _amount, bytes32[] calldata _merkleProof) external {
        _verifyClaim(_epoch, _socialHandle, _amount, _merkleProof);

        require(rewardToken.transfer(msg.sender, _amount), "Transfer failed");

        emit Claimed(_epoch, msg.sender, _amount);
    }

    /**
     * @notice Allows an eligible account to claim a reward and swap it for another token using 1inch.
     * @param _epoch The epoch from which to claim.
     * @param _socialHandle The social handle of the user being verified.
     * @param _amount The amount of reward tokens to claim.
     * @param _merkleProof The Merkle proof to verify eligibility.
     * @param _dstToken The destination token address for the swap.
     * @param _minReturnAmount The minimum amount of destination tokens to receive.
     * @param _swapData The calldata for the 1inch swap.
     */
    function claimWithSwap(
        uint256 _epoch,
        string calldata _socialHandle,
        uint256 _amount,
        bytes32[] calldata _merkleProof,
        address _dstToken,
        uint256 _minReturnAmount,
        bytes calldata _swapData
    ) external {
        _verifyClaim(_epoch, _socialHandle, _amount, _merkleProof);

        // Approve the 1inch router to spend the reward tokens
        rewardToken.approve(address(oneInchRouter), _amount);

        // Perform the swap
        oneInchRouter.swap(
            IAggregationRouterV5.SwapDescription({
                srcToken: address(rewardToken),
                dstToken: _dstToken,
                srcReceiver: address(this),
                dstReceiver: msg.sender,
                amount: _amount,
                minReturnAmount: _minReturnAmount,
                flags: 0
            }),
            _swapData
        );

        emit Claimed(_epoch, msg.sender, _amount);
    }

    /**
     * @dev Internal function to verify a claim without executing the reward transfer.
     */
    function _verifyClaim(uint256 _epoch, string calldata _socialHandle, uint256 _amount, bytes32[] calldata _merkleProof) internal {
        require(_epoch > 0 && _epoch <= currentEpoch, "Invalid epoch");
        require(merkleRoots[_epoch] != bytes32(0), "Distribution not active for this epoch");

        bytes32 leaf = keccak256(abi.encodePacked(_socialHandle, _amount));
        require(!hasClaimed[leaf], "Tokens already claimed for this reward");
        require(MerkleProof.verify(_merkleProof, merkleRoots[_epoch], leaf), "Invalid proof");

        hasClaimed[leaf] = true;
    }
}