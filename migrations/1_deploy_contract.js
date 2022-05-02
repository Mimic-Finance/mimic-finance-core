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
const _MIMTOJUSD = artifacts.require("MIMToJUSD");
const _JUSDTOCJUSD = artifacts.require("JUSDTocJUSD");

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

  /* ==>  Deploy Platfrom Contract  */
  await deployer.deploy(_FARM, TokenAddress.MIM, TokenAddress.JUSD);
  const FARM = await _FARM.deployed();

  await deployer.deploy(
    _SWAP,
    TokenAddress.JUSD,
    TokenAddress.MIM,
    TokenAddress.cJUSD
  );
  const SWAP = await _SWAP.deployed();

  await deployer.deploy(
    _AUTO,
    TokenAddress.JUSD,
    TokenAddress.MIM,
    FARM.address,
    TokenAddress.cJUSD,
    SWAP.address
  );
  const AUTO = await _AUTO.deployed();

  await deployer.deploy(_ERC20UTILS);
  await deployer.deploy(_MIMTOJUSD);
  await deployer.deploy(_JUSDTOCJUSD);

  await MIM.transfer(FARM.address, Token("90000000"), {
    from: config.rich_MIM,
  });

  await JUSD.transfer(SWAP.address, Token("9000000"), {
    from: config.rich_JUSD,
  });

  await cJUSD.transfer(AUTO.address, Token("90000000"), {
    from: config.rich_cJUSD,
  });

  /* ==>  Add Whitelisted to Contracts  */
  await FARM.addWhitelisted(TokenAddress.DAI);
  await FARM.addWhitelisted(TokenAddress.USDC);
  await FARM.addWhitelisted(TokenAddress.USDT);
  await FARM.addWhitelisted(TokenAddress.JUSD);

  await SWAP.addWhitelisted(TokenAddress.DAI);
  await SWAP.addWhitelisted(TokenAddress.USDC);
  await SWAP.addWhitelisted(TokenAddress.USDT);
};
