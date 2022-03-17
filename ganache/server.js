const config = require("../config.json");
const ganache = require("ganache-cli");

const options = {
  fork: config.forkNetworkRPC,
  unlocked_accounts: ["0x6262998ced04146fa42253a5c0af90ca02dfd2a3"],
  account_keys_path: "./ganache/keys.json",
  host: config.ganacheHost,
  port: config.ganachePort,
  seed: 1306,
};

const server = ganache.server(options);
const PORT = config.ganachePort;

server.listen(PORT, async (err, blockchain) => {
  if (err) throw err;
  console.log(`ganache listening on port ${PORT}`);
});
