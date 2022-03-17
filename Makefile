#install dependencies with yarn
install:
	yarn install

compile:
	truffle compile

ganache-cli:
	node ./ganache/server.js



