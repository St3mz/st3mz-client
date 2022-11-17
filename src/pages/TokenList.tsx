import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { useNetwork, useProvider } from "wagmi";
import { auroraChain, getNetwork } from "../Config";
import { Token } from "../models/Token";
import utilContractData from "../contracts/St3mzUtil.json";
import { getIpfsUri, launchToast, respToToken, ToastType } from "../utils/util";
import { TokenCard } from "../components/TokenCard";
import axios from "axios";

export const TokenListPage = (): JSX.Element => {
  const { chain: activeChain } = useNetwork();
  const provider = useProvider();
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    getTokens();
  }, []);

  // Get list of tokens from contract
  const getTokens = async () => {
    if (!provider) {
      return;
    }

    // Instantiate Util contract
    const utilContract = new Contract(
      getNetwork(activeChain?.id || auroraChain.id).utilAddress,
      utilContractData.abi,
      provider
    );

    // Get tokens from contract
    try {
      const resp = await utilContract.getTokens(12, 1, true);

      const _tokens = await Promise.all(
        resp.map(async (item: any) => {
          const _token = respToToken(item);
          let meta;
          try {
            meta = (await axios.get(getIpfsUri(_token.uri))).data;
          } catch (e) {
            console.log(e);
          }
          return { ..._token, metadata: meta };
        })
      );

      setTokens(_tokens);
    } catch (e) {
      console.log(e);
      launchToast(
        "An error occurred fetching list of available items.",
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
