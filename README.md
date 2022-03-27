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
```bash
npm install --save-dev @openzeppelin/contracts
```

- Compile Smart Contract and Deploy to Ganache
```bash
truffle compile && truffle migrate --reset --network=development
```
- Test Smart Contract
```bash
truffle test
```
- Run your app (http://localhost:3000)
```bash
yarn run dev
```
- Distribution mDAI Token to test dev accounts
```bash
truffle exec scripts/distribute-mdai.js --network=development
```
