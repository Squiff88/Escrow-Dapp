import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";
import axios from "axios";
import abiModule from "./artifacts/contracts/Escrow.sol/Escrow.json";
import "./styles/App.css";

import {
  isEscrowApproved,
  approveContractHandler,
  onApproveContractHandler,
} from "./helpers/contractHelpers";
import { parseDecimalValue } from "./helpers/valueHelpers";

const serverEndpoint = "http://localhost:8080/contracts";

const provider = new ethers.providers.Web3Provider(window.ethereum);

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  const getEscrow = (escrowContract, arbiter, beneficiary, value) => {
    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: () => onApproveContractHandler(escrowContract, signer),
    };

    return escrow;
  };

  async function getAccounts() {
    const accounts = await provider.send("eth_requestAccounts", []);

    setAccount(accounts[0]);
    setSigner(provider.getSigner());
  }

  async function getContractData() {
    const data = await axios.get(serverEndpoint);

    return data;
  }

  useEffect(() => {
    getAccounts();

    const contractData = getContractData();

    contractData.then(async (res) => {
      if (res.data && res.data.contractData.length > 0) {
        const contractAbi = abiModule.abi;

        const availableEscrows = res.data.contractData.map((contracts) => {
          const contract = new ethers.Contract(
            contracts.contractAddress,
            contractAbi,
            signer
          );
          const attachedContract = contract.attach(contracts.contractAddress);

          return {
            address: contracts.contractAddress,
            arbiter: contracts.arbiterAddress,
            beneficiary: contracts.beneficiaryAddress,
            handleApprove: contracts.approved
              ? setTimeout(() => {
                  approveContractHandler(attachedContract);
                }, 200)
              : () => onApproveContractHandler(attachedContract, signer),
            value: contracts.contractValue,
          };
        });

        setEscrows(availableEscrows);
      }
    });
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;

    // Decimal value in ETH
    const value = document.getElementById("wei").value;
    // Parse Decimal ETH value to BigNumber
    const parsedDecimalValue = parseDecimalValue(value);
    // Parse ETH to WEI
    const valueInWei = ethers.utils.parseUnits(value.toString(), "ether");

    const escrowContract = await deploy(
      signer,
      arbiter,
      beneficiary,
      parsedDecimalValue
    );

    try {
      const newEscrow = getEscrow(
        escrowContract,
        arbiter,
        beneficiary,
        parsedDecimalValue
      );

      const isApprovedEscrow = await isEscrowApproved(escrowContract, signer);

      const data = {
        depositorAddress: account,
        arbiterAddress: arbiter,
        beneficiaryAddress: beneficiary,
        contractAddress: escrowContract.address,
        contractValue: valueInWei.toString(),
        approved: isApprovedEscrow,
      };

      axios
        .post(serverEndpoint, data)
        .catch((err) => console.log(err, "post request error"));

      setEscrows([...escrows, newEscrow]);
    } catch (error) {
      console.log(error, "error deploying the contract");
    }
  }

  return (
    <div className="page-wrapper">
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Eth)
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          <div className="contract-wrapper">
            {escrows.map((escrow) => {
              return <Escrow key={escrow.address} {...escrow} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
