const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const ethers = require("ethers");

const app = express();

const port = 8080;

// Middlewares
app.use(cors());
app.use(express.json());

const contractData = [];

const content = fs.readFileSync(path.resolve(`${__dirname}/initialData.js`));
const extractContractData = JSON.parse(content);

const {
  depositorAddress,
  contractAddress,
  arbiterAddress,
  beneficiaryAddress,
  contractValue,
  approved,
} = extractContractData.contractData;

// Pickup the first deployed contract
const formatContractValue = ethers.utils.formatUnits(contractValue, "wei");

const escrowDataModel = {};
escrowDataModel.depositorAddress = depositorAddress;
escrowDataModel.contractAddress = contractAddress;
escrowDataModel.arbiterAddress = arbiterAddress;
escrowDataModel.beneficiaryAddress = beneficiaryAddress;
escrowDataModel.contractValue = formatContractValue;
escrowDataModel.id = contractData.length;
escrowDataModel.approved = approved;

contractData.push(escrowDataModel);

// GET Contracts
app.get("/contracts", (req, res) => {
  return res.status(200).json({
    contractData,
  });
});

app.post("/contracts", (req, res) => {
  const {
    depositorAddress,
    arbiterAddress,
    beneficiaryAddress,
    contractAddress,
    contractValue,
    approved,
  } = req.body;

  if (
    !depositorAddress ||
    !arbiterAddress ||
    !beneficiaryAddress ||
    !contractAddress ||
    !contractValue ||
    contractValue === 0
  ) {
    return res.status(500).json({
      message: "parameters are not valid",
      data: null,
    });
  }

  const escrowDataModel = {};
  escrowDataModel.depositorAddress = depositorAddress;
  escrowDataModel.contractAddress = contractAddress;
  escrowDataModel.arbiterAddress = arbiterAddress;
  escrowDataModel.beneficiaryAddress = beneficiaryAddress;
  escrowDataModel.contractValue = contractValue;
  escrowDataModel.id = contractData.length;
  escrowDataModel.approved = approved;

  contractData.push(escrowDataModel);

  return res.status(200).json({
    message: "success",
    data: contractData,
  });
});

// PUT Contract to approved state
app.put("/contracts", (req, res) => {
  const { contractAddress } = req.body;

  const findEscrowContract = contractData.filter(
    (contract) => contract.contractAddress === contractAddress
  );

  if (findEscrowContract.length === 0) {
    return res.status(500).json({
      message: "No escrow contract was found",
      data: null,
    });
  }

  findEscrowContract[0].approved = true;

  return res.status(200).json({
    message: "Escrow contract was updated successfully !",
    data: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
