import axios from "axios";
import { ethers } from "ethers";

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
  const serverEndpoint = "http://localhost:8080/contracts";
  console.log(value, "value   123123123");
  const valueInEth = ethers.utils.formatEther(value);
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {valueInEth} ETH</div>
        </li>
        <div
          className="button"
          id={address}
          onClick={async (e) => {
            console.log(address, "address  on Click !!!");
            console.log(handleApprove, "handleApprove  on Click !!!");
            e.preventDefault();

            await handleApprove();

            await axios
              .put(serverEndpoint, { contractAddress: address })
              .then((res) => console.log(res, "response maina !@!!!"))
              .catch((err) => console.log(err, "updating error"));
          }}
        >
          Approve
        </div>
      </ul>
    </div>
  );
}
