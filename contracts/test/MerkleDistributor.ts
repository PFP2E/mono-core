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

    const DistributorFactory = await ethers.getContractFactory("MerkleDistributor");
    const distributor = await DistributorFactory.deploy(
      await rewardToken.getAddress(),
      owner.address
    );
    await distributor.waitForDeployment();

    return { distributor, rewardToken, owner, addr1, addr2, otherAccount };
  }

  // Helper function to create a Merkle tree for a given set of claimers
  function createMerkleTree(claimers: { address: string; amount: any }[]) {
    const leaves = claimers.map((x) =>
      ethers.solidityPackedKeccak256(["address", "uint256"], [x.address, x.amount])
    );
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    return tree;
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
    async function singleEpochFixture() {
      const base = await loadFixture(deployDistributorFixture);
      
      const claimers = [
        { address: base.addr1.address, amount: ethers.parseEther("100") },
        { address: base.addr2.address, amount: ethers.parseEther("200") },
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

    it("Should allow a valid user to claim", async function () {
      const { distributor, rewardToken, tree, claimers, addr1 } = await loadFixture(singleEpochFixture);
      const claimer = claimers[0];
      const proof = tree.getHexProof(ethers.solidityPackedKeccak256(["address", "uint256"], [claimer.address, claimer.amount]));

      await expect(distributor.connect(addr1).claim(1, claimer.amount, proof))
        .to.emit(distributor, "Claimed")
        .withArgs(1, claimer.address, claimer.amount);

      expect(await rewardToken.balanceOf(addr1.address)).to.equal(claimer.amount);
      expect(await distributor.hasClaimed(1, addr1.address)).to.be.true;
    });

    it("Should prevent claiming from an invalid epoch", async function () {
        const { distributor, tree, claimers, addr1 } = await loadFixture(singleEpochFixture);
        const claimer = claimers[0];
        const proof = tree.getHexProof(ethers.solidityPackedKeccak256(["address", "uint256"], [claimer.address, claimer.amount]));
  
        await expect(distributor.connect(addr1).claim(0, claimer.amount, proof)).to.be.revertedWith("Invalid epoch");
        await expect(distributor.connect(addr1).claim(2, claimer.amount, proof)).to.be.revertedWith("Invalid epoch");
    });

    it("Should prevent double-claiming within the same epoch", async function () {
        const { distributor, tree, claimers, addr1 } = await loadFixture(singleEpochFixture);
        const claimer = claimers[0];
        const proof = tree.getHexProof(ethers.solidityPackedKeccak256(["address", "uint256"], [claimer.address, claimer.amount]));
  
        await distributor.connect(addr1).claim(1, claimer.amount, proof); // First claim
  
        await expect(distributor.connect(addr1).claim(1, claimer.amount, proof))
            .to.be.revertedWith("Tokens already claimed for this epoch");
    });
  });

  describe("Multi-Epoch Claiming", function () {
    async function multiEpochFixture() {
        const base = await loadFixture(deployDistributorFixture);
        
        // Epoch 1 setup
        const claimers1 = [
            { address: base.addr1.address, amount: ethers.parseEther("100") },
            { address: base.addr2.address, amount: ethers.parseEther("150") }
        ];
        const tree1 = createMerkleTree(claimers1);
        const root1 = tree1.getHexRoot();
        await base.distributor.startNewEpoch(root1);
        await base.rewardToken.mint(await base.distributor.getAddress(), ethers.parseEther("250"));

        // Epoch 2 setup
        const claimers2 = [
            { address: base.addr1.address, amount: ethers.parseEther("50") },
            { address: base.addr2.address, amount: ethers.parseEther("75") }
        ];
        const tree2 = createMerkleTree(claimers2);
        const root2 = tree2.getHexRoot();
        await base.distributor.startNewEpoch(root2);
        await base.rewardToken.mint(await base.distributor.getAddress(), ethers.parseEther("125"));

        return { ...base, claimers1, tree1, claimers2, tree2 };
    }

    it("Should allow a user to claim from multiple epochs", async function () {
        const { distributor, addr1, claimers1, tree1, claimers2, tree2 } = await loadFixture(multiEpochFixture);

        // Claim from Epoch 1
        const claimer1 = claimers1[0];
        const proof1 = tree1.getHexProof(ethers.solidityPackedKeccak256(["address", "uint256"], [claimer1.address, claimer1.amount]));
        await distributor.connect(addr1).claim(1, claimer1.amount, proof1);
        expect(await distributor.hasClaimed(1, addr1.address)).to.be.true;

        // Claim from Epoch 2
        const claimer2 = claimers2[0];
        const proof2 = tree2.getHexProof(ethers.solidityPackedKeccak256(["address", "uint256"], [claimer2.address, claimer2.amount]));
        await distributor.connect(addr1).claim(2, claimer2.amount, proof2);
        expect(await distributor.hasClaimed(2, addr1.address)).to.be.true;
    });

    it("Should prevent using a proof from one epoch to claim in another", async function () {
        const { distributor, addr1, claimers1, tree1, claimers2 } = await loadFixture(multiEpochFixture);

        // Try to use Epoch 1 proof to claim from Epoch 2
        const claimer1 = claimers1[0];
        const proof1 = tree1.getHexProof(ethers.solidityPackedKeccak256(["address", "uint256"], [claimer1.address, claimer1.amount]));
        
        const claimer2 = claimers2[0]; // Correct amount for epoch 2

        await expect(distributor.connect(addr1).claim(2, claimer2.amount, proof1))
            .to.be.revertedWith("Invalid proof");
    });

    it("Should not allow claiming from a past epoch after claiming from a future one", async function () {
        const { distributor, addr1, claimers1, tree1, claimers2, tree2 } = await loadFixture(multiEpochFixture);

        // Claim from Epoch 2 first
        const claimer2 = claimers2[0];
        const proof2 = tree2.getHexProof(ethers.solidityPackedKeccak256(["address", "uint256"], [claimer2.address, claimer2.amount]));
        await distributor.connect(addr1).claim(2, claimer2.amount, proof2);

        // Now, try to claim from Epoch 1
        const claimer1 = claimers1[0];
        const proof1 = tree1.getHexProof(ethers.solidityPackedKeccak256(["address", "uint256"], [claimer1.address, claimer1.amount]));
        await distributor.connect(addr1).claim(1, claimer1.amount, proof1);

        // Verify both are claimed
        expect(await distributor.hasClaimed(1, addr1.address)).to.be.true;
        expect(await distributor.hasClaimed(2, addr1.address)).to.be.true;
    });
  });
});
