import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

const regNumber = 1234;
const countryCode = "UK";

describe("Registry", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Registry = await hre.ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();

    return { registry, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { registry, owner } = await loadFixture(deploy);

      expect(await registry.owner()).to.equal(owner.address);
    });
  });

  describe("Registering", function () {
    it("Should set and get a company", async function () {
      const { registry, owner, otherAccount } = await loadFixture(deploy);
      await registry.setCompany(otherAccount, regNumber + countryCode);
      const res = await registry.getCompany(otherAccount);
      expect(await registry.getCompany(otherAccount)).to.equal(regNumber + countryCode);
    });
  });
});
