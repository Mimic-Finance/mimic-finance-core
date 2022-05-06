<h1 align="center">
  <a href="#readme" title="Ganache README.md"><img alt="Mimic Finance" src="https://github.com/Mimic-Finance/mimic-finance-core/blob/develop/public/assets/images/logo-box.png?raw=true" alt="Mimic Finance" width="130"/></a>
   <br/> Mimic Finance Core
  <p align="center">
   <img src="https://github.com/Mimic-Finance/mimic-finance-core/actions/workflows/next-js-lint.yml/badge.svg" alt="next_js_lint">
  <img src="https://github.com/Mimic-Finance/mimic-finance-core/actions/workflows/contract-ci.yml/badge.svg" alt="contract_ci">
    <img src="https://github.com/Mimic-Finance/mimic-finance-core/actions/workflows/staging-deploy.yml/badge.svg" alt="production_staging">
    <a href="https://farm.kmutt.me" target="_blank">
  <img src="https://github.com/Mimic-Finance/mimic-finance-core/actions/workflows/main-deploy.yml/badge.svg" alt="production_deploy">
      </a>
</p>

</h1>

## Getting Started

Requirements
- Ganache
- Truffle
- Metamask
- yarn
- OpenZeppelin

First, run the development server:

- Clone this repository with SSH 
```bash
git clone -b develop git@github.com:Mimic-Finance/mimic-farm-core.git
```
- Install Dependency
```bash
yarn install
```

- Run fork chain for development
```bash
make chain
```
- Open new terminal for deploy smart contract to blockchain
```bash
make deploy
```
- Run your app (http://localhost:3000)
```bash
yarn run dev
```

## Configure Metamask wallet network
- Network Name: `localchain`
- New RPC URL: `http://localhost:8545/`
- Chain ID: `1` (fork form Ethereum mainnet)
- Currency Symbol: `ETH`


## Contract address on Kovan Production
- Manager
```
0xA6ab9De71Fb2384123c20DcBf15647E7b631D85B
```

- Farming
```
0x5eaC77877fBf718D9c9d14CE763c57ECd9614B1b
```

- Swap
```
0x61dF446D1fDe127D6b6Ee8B033Df1B4cB74fEd62
```

- Uniswap
```
0x43F62EaBC05D513F04D38607eCe1140eE53677aE
```

- Auto Compound
```
0xd5CbdfDD636219eB809a183cF0C16995D1d73210
```

- ERC20Utils
```
0xE00D095a6f0d8B19C8e581d5C54f0fc839143434
```
