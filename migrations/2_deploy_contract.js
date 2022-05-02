const config = require("../config.json");
const TokenAddress = require("../constants/TokenAddress.json");

//Farm
const MimicToken = artifacts.require("Mimic");
const JUSDToken = artifacts.require("JUSD");
const Farming = artifacts.require("Farming");
const Swap = artifacts.require("Swap");
const cJUSD = artifacts.require("cJUSD");
const Auto = artifacts.require("Auto");
const ERC20Utils = artifacts.require("ERC20Utils");


//Stable Coin
const BUSD = artifacts.require("BUSD");
const DAI = artifacts.require("DAI");
const USDC = artifacts.require("USDC");
const USDT = artifacts.require("USDT");

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

module.exports = async function (deployer, network, accounts) {
  /**
   * Deploy Stable Coin
   * (at Mainnet)
   */
  const busd = await BUSD.at(TokenAddress.BUSD);
  await busd.transfer(accounts[0], tokens("100000"), {
    from: config.rich_account,
  });
  await busd.transfer(accounts[1], tokens("100000"), {
    from: config.rich_account,
  });

  const dai = await DAI.at(TokenAddress.DAI);
  await dai.transfer(accounts[0], tokens("100000"), {
    from: config.rich_account,
  });
  await dai.transfer(accounts[1], tokens("100000"), {
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
   * Deploy Farm and Other Token
   * JUSD.sol
   * Mimic.sol
   * Farming.sol
   * Swap.sol (Mock Swap Feature)
   */

  await deployer.deploy(JUSDToken);
  const jusdToken = await JUSDToken.deployed();

  await deployer.deploy(MimicToken);
  const mimicToken = await MimicToken.deployed();

  await deployer.deploy(
    Farming,
    mimicToken.address,
    jusdToken.address
  );
  const farming = await Farming.deployed();

  await deployer.deploy(cJUSD);
  const cjusdToken = await cJUSD.deployed();

  await deployer.deploy(
    Swap,
    jusdToken.address,
    mimicToken.address,
    cjusdToken.address
  );
  const swap = await Swap.deployed();

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

  await mimicToken.transfer(farming.address, tokens("99000000"));
  await jusdToken.transfer(swap.address, tokens("9000000"));
  await cjusdToken.transfer(auto.address, tokens("90000000"));
  await jusdToken.transfer(
    config.mode === "development" ? accounts[1] : config.testerAddress,
    tokens("1000000")
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

  await swap.addWhitelisted(TokenAddress.BUSD);
  await swap.addWhitelisted(TokenAddress.DAI);
  await swap.addWhitelisted(TokenAddress.USDC);
  await swap.addWhitelisted(TokenAddress.USDT);

  // Add Liquidity
  // Mimic(1M)- JUSD(10M)
  await mimicToken.approve(swap.address, tokens("1000000"));
  await jusdToken.approve(swap.address, tokens("10000000"));
  await swap.addLiquidity(
    mimicToken.address,
    tokens("1000000"),
    jusdToken.address,
    tokens("10000000")
  );
  //JUSD(10M) - cJUSD(10M)
  await jusdToken.approve(swap.address, tokens("10000000"));
  await cjusdToken.approve(swap.address, tokens("10000000"));
  await swap.addLiquidity(
    jusdToken.address,
    tokens("10000000"),
    cjusdToken.address,
    tokens("10000000")
  );
};
