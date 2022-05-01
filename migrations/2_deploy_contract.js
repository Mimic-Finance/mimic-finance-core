// =======================================================================
/*                      Import Artifacts
/* =====================================================================*/
// Import Config and Token Address
const config = require("../config.json");
const TokenAddress = require("../constants/TokenAddress.json");

// Import Token Artifacts
const _MIM = artifacts.require("Mimic");
const _JUSD = artifacts.require("JUSD");
const _CJUSD = artifacts.require("cJUSD");

// Import Contract artifacts
const _Dex = artifacts.require("Dex");
const _ERC20Mock = artifacts.require("ERC20Mock");
const _Farming = artifacts.require("Farming");
const _Swap = artifacts.require("Swap");
const _Auto = artifacts.require("Auto");
const _ERC20Utils = artifacts.require("ERC20Utils");

// Stable Coin
const _BUSD = artifacts.require("BUSD");
const _DAI = artifacts.require("DAI");
const _USDT = artifacts.require("USDT");

const tokens = (n) => {
  return web3.utils.toWei(n, "ether");
};

// =======================================================================
/*                      Deployment Section
/* =====================================================================*/

module.exports = async function (deployer, network, accounts) {
  /**
   * Deploy table Coin
   * BUSD, DAI, USDT
   */
  const BUSD = await _BUSD.at(TokenAddress.BUSD);
  const DAI = await _DAI.at(TokenAddress.DAI);
  const USDT = await _USDT.at(TokenAddress.USDT);

  /**
   * Deploy Token
   * JUSD, MIM
   */
  await deployer.deploy(_JUSD);
  const JUSD = await _JUSD.deployed();

  await deployer.deploy(_MIM);
  const MIM = await _MIM.deployed();

  await deployer.deploy(_CJUSD);
  const CJUSD = await _CJUSD.deployed();

  /**
   * Deploy Dex
   */
  await deployer.deploy(_Dex, {
    from: accounts[0],
    value: "100000000000000",
  });
  const Dex = await _Dex.deployed();

  /**
   *
   * Deploy Farm and Other Token
   * Farming.sol
   * Swap.sol
   * ERC20Utils.sol
   */

  await deployer.deploy(_Farming, MIM.address, JUSD.address, Dex.address);
  const Farming = await _Farming.deployed();

  await deployer.deploy(_Swap, JUSD.address, MIM.address, CJUSD.address);
  const Swap = await _Swap.deployed();

  await deployer.deploy(
    _Auto,
    JUSD.address,
    MIM.address,
    Farming.address,
    CJUSD.address,
    Swap.address
  );
  const Auto = await _Auto.deployed();

  await deployer.deploy(_ERC20Utils);
  const ERC20Utils = await _ERC20Utils.deployed();

  /**=======================================================================
   *                          Transfer Token
   =======================================================================*/
  await MIM.transfer(Farming.address, tokens("99000000"));
  await JUSD.transfer(Swap.address, tokens("9000000"));
  await CJUSD.transfer(Auto.address, tokens("9000000"));
  await JUSD.transfer(
    config.mode === "development" ? accounts[1] : config.testerAddress,
    tokens("1000000")
  );

  /**
   * Add Whitelisted
   */
  await Farming.addWhitelisted(TokenAddress.BUSD);
  await Farming.addWhitelisted(TokenAddress.DAI);
  // await farming.addWhitelisted(TokenAddress.USDC);
  // await farming.addWhitelisted(TokenAddress.USDT);
  await Farming.addWhitelisted(JUSD.address);

  await Swap.addWhitelisted(TokenAddress.BUSD);
  await Swap.addWhitelisted(TokenAddress.DAI);
  // await swap.addWhitelisted(TokenAddress.USDC);
  // await swap.addWhitelisted(TokenAddress.USDT);

  // Add Liquidity
  // Mimic(1M)- JUSD(10M)
  await MIM.approve(Swap.address, tokens("1000000"));
  await JUSD.approve(Swap.address, tokens("10000000"));
  await Swap.addLiquidity(
    MIM.address,
    tokens("1000000"),
    JUSD.address,
    tokens("10000000")
  );
  //JUSD(10M) - cJUSD(10M)
  await JUSD.approve(Swap.address, tokens("10000000"));
  await CJUSD.approve(Swap.address, tokens("10000000"));
  await Swap.addLiquidity(
    JUSD.address,
    tokens("10000000"),
    CJUSD.address,
    tokens("10000000")
  );
};
