async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export const isEscrowApproved = async (escrowContract, signer) => {
  const isApprovedTxn = await escrowContract.connect(signer).isApproved();

  return isApprovedTxn;
};

export const approveContractHandler = (escrowContract) => {
  document.getElementById(escrowContract.address).className = "complete";
  document.getElementById(escrowContract.address).innerText =
    "✓ It's been approved!";
};

export const onApproveContractHandler = async (escrowContract, signer) => {
  escrowContract.on("Approved", () => approveContractHandler(escrowContract));

  await approve(escrowContract, signer);
};
