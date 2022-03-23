#install dependencies with yarn
install:
	yarn install

compile:
	truffle compile

ganache-cli:
	node ./ganache/server.js

deploy:
	echo "Deploy Farming and Dex" \
	truffle compile && truffle migrate --reset --network=development --skip-dry-run

ta:
	truffle test ./test/Auto.test.js

chain:
	ganache \
	--chain.chainId 1 \
	--fork.url https://rpc.ankr.com/eth \
	--account="0x34afec3c082278a4478e340f8a17f0f471d2f064d7d2dd03d5d4e1cc87f80f17, 10000000000000000000000" \
	--account="0x99c167f3260c7de6cb92cde2bb83fdf30660a2778d181c5af2ab045b39ed8e88, 10000000000000000000000" \
	--account="0x755b8d4ebf1e7919612a687cb04be0568dc5b9aebda76a9f3d8498112f726435, 10000000000000000000000" \
	-h localhost \
	--port 8545 \
	--wallet.unlockedAccounts 0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3