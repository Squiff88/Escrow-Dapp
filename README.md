# Escrow-Dapp

Web3 Escrow manager

## Overview of improvements over the base implementation

- Goerli ETH testnet deployment
- Minor Frontend Styling Improvements
- Value convertion in the Frontend from Wei to ETH
- Server implementation for persistance of the data
  - Initially deployed contract via deploy scripts is picked up and displayed by the Frontend
  - Approve state gets to be persisted across the contracts
- Additional checks added to the contract itself to ensure the addresses for arbiter , deployer and beneficiary are unique.
- Test cases are added to cover the improved contract functionality

## How to run the project

- Clone the repo
- Have prepared a Metamask wallet
- Have prepared Alchemy API key
- Add the necessary data in .env file
- make sure your wallet have enough Goerli ETH ( at least 0.1 )
- `npm i` at project root directory
- execute `npx hardhat run --network goerli scripts/deploy.js` to run the deploy script
- cd & `npm i` at the server directory & `npm run dev`
- cd & `npm i` at the app directory & `npm start`
