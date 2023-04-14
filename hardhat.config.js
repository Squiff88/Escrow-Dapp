require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    goerli: {
      url: process.env.REACT_APP_GOERLI_URL_API,
      accounts: [process.env.REACT_APP_WALLET_PRIV_KEY],
    },
  },
};
