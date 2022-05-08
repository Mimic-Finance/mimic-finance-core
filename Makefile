#install dependencies with yarn
install:
	yarn install

compile:
	truffle compile

deploy:
	echo "Deploy Farming and Dex" \
	truffle compile && truffle migrate --reset --network=development --skip-dry-run

ta:
	truffle test ./test/Auto.test.js

tf: 
	truffle test ./test/Farm.test.js

chain:
	ganache \
	--chain.chainId 42 \
	--fork.url https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161 \
	--account="0x34afec3c082278a4478e340f8a17f0f471d2f064d7d2dd03d5d4e1cc87f80f17, 10000000000000000000000" \
	--account="0x99c167f3260c7de6cb92cde2bb83fdf30660a2778d181c5af2ab045b39ed8e88, 10000000000000000000000" \
	--account="0x755b8d4ebf1e7919612a687cb04be0568dc5b9aebda76a9f3d8498112f726435, 10000000000000000000000" \
	--miner.blockTime 1 \
	-h localhost \
	--port 8545 \
	--wallet.unlockedAccounts 0xa776184fd6f545dae5f51361dbcc9018549a9749 0x53829d517d8fa7d59d3d40e20251e519c079985f 0xd04fd1cda37f81bc0b46b5dcadfa00c239191988 0xCfc597a8793E0ca94FC8310482D9e11367cfCA24 