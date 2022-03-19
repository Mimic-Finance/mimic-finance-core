const config = require("../config.json");
const TokenAddress = require("../constants/TokenAddress.json");

//Farm
const MimicToken = artifacts.require("Mimic");
const JUSDToken = artifacts.require("JUSD");
const Farming = artifacts.require("Farming");
const Faucet = artifacts.require("Faucet");
const Swap = artifacts.require("Swap");

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
  const dai = await DAI.at(TokenAddress.DAI);
  const usdc = await USDC.at(TokenAddress.USDC);
  const usdt = await USDT.at(TokenAddress.USDT);

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
  await usdc_mock.transfer(dex.address, 10000000000, {
    from: config.rich_account,
  });

  // Transfer USDC from unlocked account to user account
  await usdc_mock.transfer(accounts[1], 10000000000, {
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
    busd.address,
    dai.address,
    usdc.address,
    usdt.address,
    dex.address
  );
  const farming = await Farming.deployed();

  await deployer.deploy(Faucet, jusdToken.address);
  const faucet = await Faucet.deployed();

  await deployer.deploy(Swap, jusdToken.address, mimicToken.address);
  const swap = await Swap.deployed();

  await mimicToken.transfer(farming.address, "10000000000000000000000000");
  await jusdToken.transfer(faucet.address, "5000000000000000000000000");
  await jusdToken.transfer(swap.address, "4000000000000000000000000");
  await jusdToken.transfer(
    config.mode === "development" ? accounts[1] : config.testerAddress,
    "1000000000000000000000"
  );
};
