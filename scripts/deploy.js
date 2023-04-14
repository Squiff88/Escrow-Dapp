// DEPLOYED TO: 0x0a1f6A236fB5067b8726DC718Ca4ecBCe960f515

const ethers = require("ethers");
const Escrow = require("../app/src/artifacts/contracts/Escrow.sol/Escrow.json");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

async function main() {
  const url = process.env.REACT_APP_GOERLI_URL_API;

  const provider = new ethers.providers.JsonRpcProvider(url);

  const privateKey = process.env.REACT_APP_WALLET_PRIV_KEY;

  // Create a wallet from the private key in .env
  const wallet = new ethers.Wallet(privateKey, provider);

  // 0.0001 ETH minimum value for contract creation
  const minimumAmount = 0.0001;

  const decimals = 18;
  const input = minimumAmount.toString();
  const amount = ethers.utils.parseUnits(input, decimals);

  // Get the WALLET balance
  const balance = await provider.getBalance(wallet.address);

  if (balance.toString() < amount.toString()) {
    console.log("At least 0.0001 ETH is required to deploy a contract");
    return;
  }

  const contractFactory = await new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    wallet
  );

  const escrowContract = await contractFactory.deploy(
    process.env.REACT_APP_ARBITER_ADDRESS,
    process.env.REACT_APP_BENEFICIARY_ADDRESS,
    { value: amount.toString(), gasLimit: 520000 }
  );

  console.log("escrowContract address:", escrowContract.address);

  const content = {
    contractData: {
      depositorAddress: wallet.address,
      arbiterAddress: process.env.REACT_APP_ARBITER_ADDRESS,
      beneficiaryAddress: process.env.REACT_APP_BENEFICIARY_ADDRESS,
      contractAddress: escrowContract.address,
      contractValue: amount,
      approved: false,
    },
  };

  fs.writeFile(
    path.resolve(`${__dirname}/../server/initialData.js`),
    JSON.stringify(content),
    (err) => {
      if (err) {
        console.error(err, "err writting file");
      }
      // file written successfully
    }
  );

  await escrowContract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
