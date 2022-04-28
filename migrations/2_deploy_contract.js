const config = require("../config.json");
const TokenAddress = require("../constants/TokenAddress.json");

//Farm
const MimicToken = artifacts.require("Mimic");
const JUSDToken = artifacts.require("JUSD");
const Farming = artifacts.require("Farming");
const Faucet = artifacts.require("Faucet");
const Swap = artifacts.require("Swap");
const cJUSD = artifacts.require("cJUSD");
const Auto = artifacts.require("Auto");
const ERC20Utils = artifacts.require("ERC20Utils");

// DEX
const Dex = artifacts.require("Dex");
const ERC20Mock = artifacts.require("ERC20Mock");

//Stable Coin
const BUSD = artifacts.require("BUSD");
const DAI = artifacts.require("DAI");
const USDC = artifacts.require("USDC");
const USDT = artifacts.require("USDT");

module.exports = async function (deployer, network, accounts) {
  /**
   * Deploy Stable Coin
   * (at Mainnet)
   */
  const busd = await BUSD.at(TokenAddress.BUSD);
  await busd.transfer(accounts[0], "100000000000000000000000", {
    from: config.rich_account,
  });
  await busd.transfer(accounts[1], "100000000000000000000000", {
    from: config.rich_account,
  });

  const dai = await DAI.at(TokenAddress.DAI);
  await dai.transfer(accounts[0], "100000000000000000000000", {
    from: config.rich_account,
  });
  await dai.transfer(accounts[1], "100000000000000000000000", {
    from: config.rich_account,
  });
  const usdc = await USDC.at(TokenAddress.USDC);
  await usdc.transfer(accounts[0], 100000000000, {
    from: config.rich_account,
  });
  await usdc.transfer(accounts[1], 100000000000, {
    from: config.rich_account,
  });
  const usdt = await USDT.at(TokenAddress.USDT);
  await usdt.transfer(accounts[0], 100000000000, {
    from: config.rich_account,
  });
  await usdt.transfer(accounts[1], 100000000000, {
    from: config.rich_account,
  });

  /**
   *
   * Deploy DEX
   * Dex.sol
   * ERC20Mock.sol
   *
   */
  const usdc_mock = await ERC20Mock.at(config.USDC_TESTNET);

  // Create Dex Contract with 10 ether from the deployer account
  await deployer.deploy(Dex, {
    from: accounts[0],
    value: "10000000000000000000",
  });

  const dex = await Dex.deployed();

  // Transfer USDC from unlocked account to Dex Contract
  await usdc_mock.transfer(dex.address, 100000000000, {
    from: config.rich_account,
  });

  /**
   *
   * Deploy Farm and Other Token
   * JUSD.sol
   * Mimic.sol
   * Farming.sol
   * Swap.sol (Mock Swap Feature)
   * Faucet.sol
   */
  await deployer.deploy(JUSDToken);
  const jusdToken = await JUSDToken.deployed();

  await deployer.deploy(MimicToken);
  const mimicToken = await MimicToken.deployed();

  await deployer.deploy(
    Farming,
    mimicToken.address,
    jusdToken.address,
    dex.address
  );
  const farming = await Farming.deployed();

  await deployer.deploy(Faucet, jusdToken.address);
  const faucet = await Faucet.deployed();

  await deployer.deploy(Swap, jusdToken.address, mimicToken.address);
  const swap = await Swap.deployed();

  await deployer.deploy(cJUSD);
  const cjusdToken = await cJUSD.deployed();

  await deployer.deploy(
    Auto,
    jusdToken.address,
    mimicToken.address,
    farming.address,
    cjusdToken.address,
    swap.address
  );
  const auto = await Auto.deployed();

  await deployer.deploy(ERC20Utils);
  const erc20utils = await ERC20Utils.deployed();

  await mimicToken.transfer(farming.address, "100000000000000000000000000");
  await jusdToken.transfer(auto.address, "5000000000000000000000000");
  await jusdToken.transfer(swap.address, "4000000000000000000000000");
  await cjusdToken.transfer(auto.address, "100000000000000000000000000");
  await jusdToken.transfer(
    config.mode === "development" ? accounts[1] : config.testerAddress,
    "1000000000000000000000000"
  );

  /**
   *
   * Add Whitelisted
   */
  await farming.addWhitelisted(TokenAddress.BUSD);
  await farming.addWhitelisted(TokenAddress.DAI);
  await farming.addWhitelisted(TokenAddress.USDC);
  await farming.addWhitelisted(TokenAddress.USDT);
  await farming.addWhitelisted(jusdToken.address);

};
