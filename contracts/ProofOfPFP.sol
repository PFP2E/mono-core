// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title ProofOfPFP
 * @notice A derivative NFT contract that mints a "proof" token to the
 * owner of an original NFT, demonstrating a simple derivative campaign.
 */
contract ProofOfPFP is ERC721, Ownable {
    IERC721 public immutable originalCollection;
    mapping(uint256 => bool) public hasMinted;

    constructor(
        string memory name,
        string memory symbol,
        address _originalCollection,
        address _initialOwner
    ) ERC721(name, symbol) Ownable(_initialOwner) {
        originalCollection = IERC721(_originalCollection);
    }

    /**
     * @notice Mints a proof token to the owner of the original NFT.
     * @dev Reverts if the derivative has already been minted for the tokenId.
     */
    function mint(uint256 _tokenId) external {
        require(!hasMinted[_tokenId], "Proof already minted");

        address originalOwner = originalCollection.ownerOf(_tokenId);
        hasMinted[_tokenId] = true;
        _safeMint(originalOwner, _tokenId);
    }
}
