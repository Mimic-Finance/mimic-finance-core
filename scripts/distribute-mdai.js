const TokenFarm = artifacts.require("TokenFarm");
const Faucet = artifacts.require("Faucet");
const config = require("../config.json");

module.exports = async (callback) => {
  const accounts = config.accounts;

  for (let i = 0; i < accounts.length; i++) {
    let faucet = await Faucet.deployed();
    await faucet.distributeToken(accounts[i]);
    console.log("Distributed => " + accounts[i]);
  }

  console.log("\n Distribuited Done!");
  callback();
};
