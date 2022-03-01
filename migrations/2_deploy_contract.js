const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("Daitoken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  await dappToken.transfer(tokenFarm.address, "1000000000000000000000000");
  await daiToken.transfer(
    "0x152D671b5E858d8039ce1B63FDEd676ac31Ef999",
    "100000000000000000000"
  );
};
