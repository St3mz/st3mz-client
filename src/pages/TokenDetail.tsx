import { Button } from "@material-tailwind/react";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNetwork, useSigner, useProvider } from "wagmi";
import { getNetwork } from "../Config";
import st3mzContractData from "../contracts/St3mz.json";
import utilContractData from "../contracts/St3mzUtil.json";
import { Token } from "../models/Token";
import { launchToast, respToToken, ToastType } from "../utils/util";

export const TokenDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { chain: activeChain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [token, setToken] = useState<Token>();

  useEffect(() => {
    if (id) getToken();
  }, [id]);

  const getToken = async () => {
    if (!activeChain || !provider) {
      return;
    }

    const utilContract = new Contract(
      getNetwork(activeChain.id).utilAddress,
      utilContractData.abi,
      provider
    );

    try {
      const resp = await utilContract.getToken(id);
      console.log(resp);
      setToken(respToToken(resp));
    } catch (e) {
      console.log(e);
      launchToast("An error occurred fetching item data.", ToastType.Error);
    }
  };

  const buy = async () => {
    if (!signer || !activeChain || !token) {
      return;
    }

    const amount = 2;

    const st3mzContract = new Contract(
      getNetwork(activeChain.id).st3mzAddress,
      st3mzContractData.abi,
      signer
    );

    try {
      const tx = await st3mzContract.buy(id, amount, {
        value: token.price.mul(amount).toString(),
      });
      const events = (await tx.wait()).events;
      console.log(events);
    } catch (e) {
      console.log(e);
      launchToast("An error occurred buying the item.", ToastType.Error);
    }
  };

  return (
    <div className="p-8">
      <div>Detail Page</div>
      {token && (
        <div>
          <div>ID: {token.id}</div>
          <div>URI: {token.uri}</div>
          <div>Minter: {token.minter}</div>
          <div>Price: {ethers.utils.formatEther(token.price)}</div>
          <div>Supply: {token.supply}</div>
          <div>Available: {token.available}</div>
          <Button onClick={buy}>Buy</Button>
        </div>
      )}
    </div>
  );
};
