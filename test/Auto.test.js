const { assert } = require("chai");

//Farm
const MimicToken = artifacts.require("Mimic");
const JUSDToken = artifacts.require("JUSD");
const Farming = artifacts.require("Farming");
const cJUSDToken = artifacts.require("cJUSD");
const Swap = artifacts.require("Swap");
const Dex = artifacts.require("Dex");
const Auto = artifacts.require("Auto");

require("chai").use(require("chai-as-promised")).should();
function tokens(n) {
  return web3.utils.toWei(n, "ether");
}
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

contract("Auto", ([owner, investor]) => {
  let jusdToken, mimicToken, auto, cjusdToken, farming, swap;

  before(async () => {
    // Load Contract
    jusdToken = await JUSDToken.new();
    mimicToken = await MimicToken.new();
    cjusdToken = await cJUSDToken.new();
    swap = await Swap.new(jusdToken.address, mimicToken.address);
    dex = await Dex.new();
    farming = await Farming.new(
      mimicToken.address,
      jusdToken.address,
      dex.address
    );
    auto = await Auto.new(
      jusdToken.address,
      mimicToken.address,
      farming.address,
      cjusdToken.address,
      swap.address
    );

    //transfer cJUSD -> autocompound
    await cjusdToken.transfer(auto.address, tokens("10000000"));
    //transfer mimic -> farm
    await mimicToken.transfer(farming.address, tokens("10000000"));
    // transfer jusd from act 0 -> act 1
    await jusdToken.transfer(investor, tokens("10000"), { from: owner });
  });

  describe("JUSD deployment", async () => {
    it("Check JUSD Token prerequisite", async () => {
      const name = await jusdToken.name();
      assert.equal(name, "Jack USD Token", "JUSD Contract name correct");
      const sym = await jusdToken.symbol();
      assert.equal(sym, "JUSD", "JUSD Contract symbol correct");
      let supply = await jusdToken.totalSupply();
      assert.equal(
        supply.toString(),
        tokens("10000000"),
        "mDai Contract total supply correct"
      );
    });
  });

  describe("Mimic Token deployment", async () => {
    it("Check Mimic Token prerequisite", async () => {
      const name = await mimicToken.name();
      assert.equal(name, "Mimic Token", "Mimic token name correct");
      const sym = await mimicToken.symbol();
      assert.equal(sym, "MIM", "Mimic token symbol correct");
      let supply = await mimicToken.totalSupply();
      assert.equal(
        supply.toString(),
        tokens("10000000"),
        "Mimic token total supply correct"
      );
    });
  });

  describe("cJUSD deployment", async () => {
    it("Check cJUSD Token prerequisite", async () => {
      const name = await cjusdToken.name();
      assert.equal(
        name,
        "Compound Jack USD Token",
        "cJUSD Contract name correct"
      );
      const sym = await cjusdToken.symbol();
      assert.equal(sym, "cJUSD", "cJUSD Contract symbol correct");
      let supply = await cjusdToken.totalSupply();
      assert.equal(
        supply.toString(),
        tokens("10000000"),
        "cJUSD Contract total supply correct"
      );
    });
  });

  describe("Farming deployment", async () => {
    it("Check Farming deployment", async () => {
      const name = await farming.name();
      assert.equal(
        name,
        "Mimic Governance Token Farming",
        "Mimic Farm name correct"
      );
    });
    it("Farming contract has mimic tokens", async () => {
      let balance = await mimicToken.balanceOf(farming.address);
      assert.equal(
        balance.toString(),
        tokens("10000000"),
        "Farming contract has mimic tokens"
      );
    });
  });

  describe("Auto-Compound deployment", async () => {
    it("Check Auto-Compound deployment", async () => {
      const name = await auto.name();
      assert.equal(
        name,
        "Auto-Compound",
        "Auto Compound contract name correct"
      );
    });
    it("Auto-Compound contract has cJUSD tokens", async () => {
      let balance = await cjusdToken.balanceOf(auto.address);
      assert.equal(
        balance.toString(),
        tokens("10000000"),
        "Farming contract has mimic tokens"
      );
    });
  });

  describe("Auto-Compound Function", async () => {
    it("Check stake function", async () => {
      let result;
      //check jusd investor's wallet balance
      result = await jusdToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("10000"),
        "investor JUSD balance correct"
      );
      //Deposit function
      await jusdToken.approve(auto.address, tokens("10000"), {
        from: investor,
      });
      await auto.deposit(tokens("10000"), { from: investor });
      //check investor jusd balance
      result = await jusdToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("0"),
        "investor JUSD balance after stake correct"
      );
      //check investor cjusd balance
      result = await cjusdToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("10000"),
        "investor cJUSD balance correct"
      );
      //check cJUSD auto-compound balance
      result = await cjusdToken.balanceOf(auto.address);
      assert.equal(
        result.toString(),
        tokens("9990000"),
        "cJUSD autocompound correct"
      );
      //check auto-compound farm staking balance
      result = await farming.stakingBalance(auto.address);
      assert.equal(
        result.toString(),
        tokens("10000"),
        "auto-compound farming balance correct"
      );
      //check auto-compound wallet
      result = await jusdToken.balanceOf(auto.address);
      assert.equal(
        result.toString(),
        tokens("0"),
        "auto-compound wallet balance correct"
      );
      //await farming.issueTokens()
      // //check mimic balance
      await auto.claim();
      // result = await jusdToken.balanceOf(auto.address)
      // assert.equal(result.toString(), tokens('10'), 'jusd balance after swap correct')
    });
  });
});
