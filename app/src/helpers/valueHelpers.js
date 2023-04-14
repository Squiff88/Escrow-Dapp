import { ethers } from "ethers";

export const parseDecimalValue = (value) => {
  const decimals = 18;
  const input = value.toString();
  const amount = ethers.utils.parseUnits(input, decimals);

  return amount;
};
