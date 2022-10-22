import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { useNetwork, useProvider } from "wagmi";
import { getNetwork } from "../Config";
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
    if (!activeChain || !provider) {
      return;
    }

    const utilContract = new Contract(
      getNetwork(activeChain.id).utilAddress,
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
    <div className="p-10">
      <div>Token List Page</div>
      {tokens.map((token) => (
        <TokenCard key={token.id} token={token}></TokenCard>
      ))}
    </div>
  );
};
