#install dependencies with yarn
install:
	yarn install

compile:
	truffle compile

ganache-cli:
	node ./ganache/server.js

deploy1:
	echo "Deploy Farming" \
	truffle compile && truffle migrate --reset --network=development --skip-dry-run --config truffle-config-v0.8.4.js -f 2 --to 2

deploy2:
	echo "Deploy Dex" \
	truffle compile && truffle migrate --reset --network=development --skip-dry-run --config truffle-config-v0.6.6.js -f 3 --to 3