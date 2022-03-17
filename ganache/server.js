const config = require("../config.json");
const ganache = require("ganache-cli");

const options = {
  fork: config.forkNetworkRPC,
  unlocked_accounts: [config.rich_account],
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
