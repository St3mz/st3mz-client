import { ethers } from "ethers";

export interface Token {
  id: number;
  minter: string;
  uri: string;
  price: ethers.BigNumber;
  supply: number;
  available: number;
}
