import { Chain, chain as wagmiChains } from "wagmi";

export const APP_NAME = "St3mz";

export const ipfsGatewayUrl = "https://nftstorage.link/ipfs/";

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
}

const networks: Network[] = [
  {
    chainId: wagmiChains.foundry.id,
    name: "Local network",
    st3mzAddress: "0x07b1a773adfd16c52ff29fa8d84a564073a9bdcf",
    utilAddress: "0xea18f85a2c0d656503f73e974e197b4c4a04331d",
  },
  {
    chainId: auroraTestnetChain.id,
    name: "Testnet",
    st3mzAddress: "0x36C69fEFb608b15150021C96D15D3678F1FE3929",
    utilAddress: "0x17A559575182929eBb539922287D9E2C78A2fca5",
  },
  {
    chainId: auroraChain.id,
    name: "Mainnet",
    st3mzAddress: "0x2644041Fd0b18f7e1edc77cEa3ac0F7944DB42Ac",
    utilAddress: "0x3fb332C796E54A8255A3230987CE24d2caB08380",
  },
];

export const getNetwork = (chainId: ChainId): Network => {
  return networks.find((n) => n.chainId === chainId) as Network;
};
