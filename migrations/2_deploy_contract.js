const config = require("../config.json");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("Daitoken");
const TokenFarm = artifacts.require("TokenFarm");
const Faucet = artifacts.require("Faucet");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  await deployer.deploy(Faucet,daiToken.address);
  const faucet = await Faucet.deployed();


  await dappToken.transfer(tokenFarm.address, "10000000000000000000000000");
  await daiToken.transfer(faucet.address,"9000000000000000000000000");
  await daiToken.transfer(
    config.mode === "development" ? accounts[1] : config.testerAddress,
    "1000000000000000000000"
  );
};
