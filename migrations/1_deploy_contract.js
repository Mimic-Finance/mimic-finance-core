const config = require("../config.json");
const TokenAddress = require("../constants/TokenAddress.json");

/**==================================================================
 *                       Import Contract Artifacts
 ===================================================================*/

// Platform Token Artifacts
const _MIM = artifacts.require("Mimic");
const _JUSD = artifacts.require("JUSD");
const _cJUSD = artifacts.require("cJUSD");

// Pool Token Artifacts
const _DAI = artifacts.require("DAI");
const _USDC = artifacts.require("USDC");
const _USDT = artifacts.require("USDT");

// Contract Artifacts
const _FARM = artifacts.require("Farming");
const _SWAP = artifacts.require("Swap");
const _AUTO = artifacts.require("Auto");
const _ERC20UTILS = artifacts.require("ERC20Utils");
const _Manager = artifacts.require("Manager");
const _Uniswap = artifacts.require("Uniswap");

/**==================================================================
 *                         Utils Functions
 ===================================================================*/

const Token = (n) => {
  return web3.utils.toWei(n, "ether");
};

/**==================================================================
 *                          Deployment
 ===================================================================*/

module.exports = async (deployer, network, accounts) => {
  /* ==>  Use from blockchain network  */
  const DAI = await _DAI.at(TokenAddress.DAI);
  const USDT = await _USDT.at(TokenAddress.USDT);
  const USDC = await _USDC.at(TokenAddress.USDC);

  const JUSD = await _JUSD.at(TokenAddress.JUSD);
  const cJUSD = await _cJUSD.at(TokenAddress.cJUSD);
  const MIM = await _MIM.at(TokenAddress.MIM);

  if (cJUSD.mode === "development") {
    /* ==>  Transfer tokens to accounts[0] (for development)  */
    await DAI.transfer(accounts[0], Token("100000"), {
      from: config.rich_DAI,
    });
    await DAI.transfer(accounts[1], Token("100000"), {
      from: config.rich_DAI,
    });
    await USDT.transfer(accounts[0], "100000000000", {
      from: config.rich_USDT,
    });
    await USDT.transfer(accounts[1], "100000000000", {
      from: config.rich_USDT,
    });
    await USDC.transfer(accounts[0], "100000000000", {
      from: config.rich_USDC,
    });
    await USDC.transfer(accounts[1], "100000000000", {
      from: config.rich_USDC,
    });
  }

  /* ==>  Deploy Platfrom Contract  */

  await deployer.deploy(_Manager);
  const MANAGER = await _Manager.deployed();

  await deployer.deploy(
    _FARM,
    TokenAddress.MIM,
    TokenAddress.JUSD,
    MANAGER.address
  );
  const FARM = await _FARM.deployed();

  await deployer.deploy(
    _SWAP,
    TokenAddress.JUSD,
    TokenAddress.MIM,
    TokenAddress.cJUSD,
    MANAGER.address
  );
  const SWAP = await _SWAP.deployed();

  await deployer.deploy(_Uniswap);
  const UNISWAP = await _Uniswap;

  await deployer.deploy(
    _AUTO,
    TokenAddress.JUSD,
    TokenAddress.MIM,
    FARM.address,
    TokenAddress.cJUSD,
    SWAP.address,
    MANAGER.address,
    UNISWAP.address
  );
  const AUTO = await _AUTO.deployed();

  await deployer.deploy(_ERC20UTILS);

  if (config.mode === "development") {
    await MIM.transfer(FARM.address, Token("590000000"), {
      from: config.rich_MIM,
    });

    await JUSD.transfer(SWAP.address, Token("600000000"), {
      from: config.rich_JUSD,
    });

    await JUSD.transfer(AUTO.address, Token("10000000"), {
      from: config.rich_JUSD,
    });

    await cJUSD.transfer(AUTO.address, Token("600000000"), {
      from: config.rich_cJUSD,
    });
  }

  /* ==>  Add Whitelisted to Contracts  */
  await MANAGER.addWhitelisted(TokenAddress.DAI);
  await MANAGER.addWhitelisted(TokenAddress.USDC);
  await MANAGER.addWhitelisted(TokenAddress.USDT);
  await MANAGER.addWhitelisted(TokenAddress.JUSD);

  await MANAGER.addMintWhitelisted(TokenAddress.DAI);
  await MANAGER.addMintWhitelisted(TokenAddress.USDC);
  await MANAGER.addMintWhitelisted(TokenAddress.USDT);
};
