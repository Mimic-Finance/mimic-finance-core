# Mimic Finance
![next_js_lint workflow](https://github.com/Mimic-Finance/mimic-farm-v2/actions/workflows/Next-js-Lint/badge.svg)

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
git clone -b develop git@github.com:Mimic-Finance/mimic-farm-v2.git
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
- Issue Token
```bash
truffle exec scripts/issue-token.js --network=development
```
- Distribution mDAI Token to test dev accounts
```bash
truffle exec scripts/distribute-mdai.js --network=development
```
