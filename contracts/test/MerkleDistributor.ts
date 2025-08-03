import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("MerkleDistributor (Epoch-based)", function () {
  async function deployDistributorFixture() {
    const [owner, addr1, addr2, otherAccount] = await ethers.getSigners();

    const RewardTokenFactory = await ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardTokenFactory.deploy(owner.address);
    await rewardToken.waitForDeployment();

    const MockRouterFactory = await ethers.getContractFactory("MockAggregationRouter");
    const mockRouter = await MockRouterFactory.deploy();
    await mockRouter.waitForDeployment();

    const DistributorFactory = await ethers.getContractFactory("MerkleDistributor");
    const distributor = await DistributorFactory.deploy(
      await rewardToken.getAddress(),
      await mockRouter.getAddress(),
      owner.address
    );
    await distributor.waitForDeployment();

    return { distributor, rewardToken, mockRouter, owner, addr1, addr2, otherAccount };
  }

  // Helper function to create a Merkle tree for a given set of claimers
  function createMerkleTree(claimers: { socialHandle: string; amount: any }[]) {
    const leaves = claimers.map((x) =>
      ethers.solidityPackedKeccak256(["string", "uint256"], [x.socialHandle, x.amount])
    );
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    return tree;
  }

  async function singleEpochFixture() {
    const base = await loadFixture(deployDistributorFixture);
    
    const claimers = [
      { socialHandle: "user1", amount: ethers.parseEther("100") },
      { socialHandle: "user2", amount: ethers.parseEther("200") },
    ];
    const tree = createMerkleTree(claimers);
    const root = tree.getHexRoot();

    // Start epoch 1
    await base.distributor.startNewEpoch(root);

    // Fund the distributor
    const totalRewards = claimers.reduce((sum, c) => sum + c.amount, ethers.parseEther("0"));
    await base.rewardToken.mint(await base.distributor.getAddress(), totalRewards);

    return { ...base, claimers, tree, root };
  }

  describe("Epoch Management", function () {
    it("Should start at epoch 0", async function () {
      const { distributor } = await loadFixture(deployDistributorFixture);
      expect(await distributor.currentEpoch()).to.equal(0);
    });

    it("Should allow the owner to start a new epoch", async function () {
      const { distributor, owner } = await loadFixture(deployDistributorFixture);
      const root = ethers.hexlify(ethers.randomBytes(32));
      
      await expect(distributor.connect(owner).startNewEpoch(root))
        .to.emit(distributor, "EpochStarted")
        .withArgs(1, root);
      
      expect(await distributor.currentEpoch()).to.equal(1);
      expect(await distributor.merkleRoots(1)).to.equal(root);
    });

    it("Should prevent non-owners from starting a new epoch", async function () {
      const { distributor, otherAccount } = await loadFixture(deployDistributorFixture);
      const root = ethers.hexlify(ethers.randomBytes(32));
      
      await expect(
        distributor.connect(otherAccount).startNewEpoch(root)
      ).to.be.revertedWithCustomError(distributor, "OwnableUnauthorizedAccount");
    });
  });

  describe("Single-Epoch Claiming", function () {
    it("Should allow a valid user to claim", async function () {
      const { distributor, rewardToken, tree, claimers, addr1 } = await loadFixture(singleEpochFixture);
      const claimer = claimers[0];
      const proof = tree.getHexProof(ethers.solidityPackedKeccak256(["string", "uint256"], [claimer.socialHandle, claimer.amount]));

      await expect(distributor.connect(addr1).claim(1, claimer.socialHandle, claimer.amount, proof))
        .to.emit(distributor, "Claimed")
        .withArgs(1, addr1.address, claimer.amount);

      expect(await rewardToken.balanceOf(addr1.address)).to.equal(claimer.amount);
      const leaf = ethers.solidityPackedKeccak256(["string", "uint256"], [claimer.socialHandle, claimer.amount]);
      expect(await distributor.hasClaimed(leaf)).to.be.true;
    });

    it("Should prevent claiming from an invalid epoch", async function () {
        const { distributor, tree, claimers, addr1 } = await loadFixture(singleEpochFixture);
        const claimer = claimers[0];
        const proof = tree.getHexProof(ethers.solidityPackedKeccak256(["string", "uint256"], [claimer.socialHandle, claimer.amount]));
  
        await expect(distributor.connect(addr1).claim(0, claimer.socialHandle, claimer.amount, proof)).to.be.revertedWith("Invalid epoch");
        await expect(distributor.connect(addr1).claim(2, claimer.socialHandle, claimer.amount, proof)).to.be.revertedWith("Invalid epoch");
    });

    it("Should prevent double-claiming within the same epoch", async function () {
        const { distributor, tree, claimers, addr1 } = await loadFixture(singleEpochFixture);
        const claimer = claimers[0];
        const proof = tree.getHexProof(ethers.solidityPackedKeccak256(["string", "uint256"], [claimer.socialHandle, claimer.amount]));
  
        await distributor.connect(addr1).claim(1, claimer.socialHandle, claimer.amount, proof); // First claim
  
        await expect(distributor.connect(addr1).claim(1, claimer.socialHandle, claimer.amount, proof))
            .to.be.revertedWith("Tokens already claimed for this reward");
    });
  });

  describe("Claiming with Swap (1inch)", function () {
    async function swapFixture() {
      const base = await singleEpochFixture();
      
      const DstTokenFactory = await ethers.getContractFactory("RewardToken");
      const dstToken = await DstTokenFactory.deploy(base.owner.address);
      await dstToken.waitForDeployment();

      // Fund the mock router with destination tokens for the swap
      await dstToken.mint(await base.mockRouter.getAddress(), ethers.parseEther("1000"));

      return { ...base, dstToken };
    }

    it("Should allow a user to claim and swap", async function () {
      const { distributor, dstToken, tree, claimers, addr1 } = await loadFixture(swapFixture);
      const claimer = claimers[0];
      const proof = tree.getHexProof(ethers.solidityPackedKeccak256(["string", "uint256"], [claimer.socialHandle, claimer.amount]));
      
      const swapData = "0x"; // Mock data, not used by the mock router

      await expect(distributor.connect(addr1).claimWithSwap(
        1,
        claimer.socialHandle,
        claimer.amount,
        proof,
        await dstToken.getAddress(),
        0, // minReturn
        swapData
      )).to.emit(distributor, "Claimed").withArgs(1, addr1.address, claimer.amount);

      // User should have the destination tokens
      expect(await dstToken.balanceOf(addr1.address)).to.equal(claimer.amount);
      
      // Check if claimed
      const leaf = ethers.solidityPackedKeccak256(["string", "uint256"], [claimer.socialHandle, claimer.amount]);
      expect(await distributor.hasClaimed(leaf)).to.be.true;
    });
  });
});
