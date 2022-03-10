const config = require("../config.json");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("Daitoken");
const TokenFarm = artifacts.require("TokenFarm");
const Farming = artifacts.require('Farming');

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  await deployer.deploy(Farming,dappToken.address,daiToken.address);
  const farming = await Farming.deployed();

  await dappToken.transfer(tokenFarm.address, "1000000000000000000000000");
  await dappToken.transfer(farming.address, "1000000000000000000000000");
  await daiToken.transfer(
    config.mode === "development" ? accounts[1] : config.testerAddress,
    "1000000000000000000000"
  );
};
