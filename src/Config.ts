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
  st3mzAddress: string;
  utilAddress: string;
  apiUrl: string;
}

const networks: Network[] = [
  {
    chainId: wagmiChains.foundry.id,
    name: "Local network",
    st3mzAddress: "0x36d392a5da9817e8d91498a47c852c25f7a2073e",
    utilAddress: "0x16343ed8aa81aba9873ed9402979580a709de5e1",
    apiUrl: "http://localhost:8080",
  },
  {
    chainId: auroraTestnetChain.id,
    name: "Testnet",
    st3mzAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3.",
    utilAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512.",
    apiUrl: "http://localhost:8080",
  },
  {
    chainId: auroraChain.id,
    name: "Mainnet",
    st3mzAddress: "",
    utilAddress: "",
    apiUrl: "http://localhost:8080",
  },
];

export const getNetwork = (chainId: ChainId): Network => {
  return networks.find((n) => n.chainId === chainId) as Network;
};
