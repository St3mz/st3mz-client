import { Chain, chain as wagmiChains } from "wagmi";

export const APP_NAME = "St3mz";

export const auroraChain: Chain = {
  id: 1313161554,
  name: "Aurora",
  network: "aurora",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://mainnet.aurora.dev",
  },
  blockExplorers: {
    default: { name: "Aurorascan", url: "https://aurorascan.dev/" },
  },
  testnet: false,
};

export const auroraTestnetChain: Chain = {
  id: 1313161555,
  name: "Aurora Testnet",
  network: "aurora-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://testnet.aurora.dev",
  },
  blockExplorers: {
    default: { name: "Aurorascan", url: "https://testnet.aurorascan.dev/" },
  },
  testnet: false,
};

var availableChains = [auroraChain, auroraTestnetChain];
if (process.env.NODE_ENV === "development") {
  availableChains.push(wagmiChains.foundry);
}
export const CHAINS = availableChains;
export type ChainId = typeof CHAINS[number]["id"];

export interface Network {
  chainId: ChainId;
  name: string;
  contractAddress: string;
  apiUrl: string;
}

const networks: Network[] = [
  {
    chainId: wagmiChains.foundry.id,
    name: "Local network",
    contractAddress: "",
    apiUrl: "http://localhost:8080",
  },
  {
    chainId: auroraTestnetChain.id,
    name: "Testnet",
    contractAddress: "",
    apiUrl: "http://localhost:8080",
  },
  {
    chainId: auroraChain.id,
    name: "Mainnet",
    contractAddress: "",
    apiUrl: "http://localhost:8080",
  },
];

export const getNetwork = (chainId: ChainId): Network => {
  return networks.find((n) => n.chainId === chainId) as Network;
};
