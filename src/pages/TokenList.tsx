import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { useNetwork, useProvider } from "wagmi";
import { auroraChain, getNetwork } from "../Config";
import { Token } from "../models/Token";
import utilContractData from "../contracts/St3mzUtil.json";
import { launchToast, respToToken, ToastType } from "../utils/util";
import { TokenCard } from "../components/TokenCard";

export const TokenListPage = (): JSX.Element => {
  const { chain: activeChain } = useNetwork();
  const provider = useProvider();
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    getTokens();
  }, []);

  const getTokens = async () => {
    if (!provider) {
      return;
    }

    const utilContract = new Contract(
      getNetwork(activeChain?.id || auroraChain.id).utilAddress,
      utilContractData.abi,
      provider
    );

    try {
      const resp = await utilContract.getTokens(12, 1, true);
      console.log(resp);
      setTokens(resp.map((item: any) => respToToken(item)));
    } catch (e) {
      console.log(e);
      launchToast(
        "An error occurred fething list of available items.",
        ToastType.Error
      );
    }
  };

  return (
    <div>
      <h1 className="text-6xl font-bold pb-2 text-center">Browse NFTs</h1>
      <div className="container my-12 mx-auto px-4 md:px-12">
        <div className="flex flex-wrap -mx-1 lg:-mx-4">
          {tokens.map((token) => (
            <TokenCard key={token.id} token={token}></TokenCard>
          ))}
        </div>
      </div>
    </div>
  );
};
