const config = require("../config.json");
const MimicToken = artifacts.require("Mimic");
const JUSDToken = artifacts.require("JUSD");
const Farming = artifacts.require("Farming");
const Faucet = artifacts.require("Faucet");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(JUSDToken);
  const jusdToken = await JUSDToken.deployed();

  await deployer.deploy(MimicToken);
  const mimicToken = await MimicToken.deployed();

  await deployer.deploy(Farming, mimicToken.address, jusdToken.address);
  const farming = await Farming.deployed();

  await deployer.deploy(Faucet,jusdToken.address);
  const faucet = await Faucet.deployed();


  await mimicToken.transfer(farming.address, "10000000000000000000000000");
  await jusdToken.transfer(faucet.address,"9000000000000000000000000");
  await jusdToken.transfer(
    config.mode === "development" ? accounts[1] : config.testerAddress,
    "1000000000000000000000"
  );
};
