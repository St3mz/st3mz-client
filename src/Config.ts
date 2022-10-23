import { Chain, chain as wagmiChains } from "wagmi";

export const APP_NAME = "St3mz";

export const ipfsGatewayUrl = "https://nftstorage.link/ipfs/";
// export const ipfsGatewayUrl = "https://infura-ipfs.io/ipfs/";
// export const ipfsGatewayUrl = "https://gateway.pinata.cloud/ipfs/";

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
    st3mzAddress: "0x07b1a773adfd16c52ff29fa8d84a564073a9bdcf",
    utilAddress: "0xea18f85a2c0d656503f73e974e197b4c4a04331d",
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
