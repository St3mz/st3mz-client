import { Button } from "@material-tailwind/react";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNetwork, useSigner, useProvider } from "wagmi";
import { auroraChain, getNetwork } from "../Config";
import st3mzContractData from "../contracts/St3mz.json";
import utilContractData from "../contracts/St3mzUtil.json";
import { Token } from "../models/Token";
import { getIpfsUri, launchToast, respToToken, ToastType } from "../utils/util";
import axios from "axios";
import { Metadata } from "../models/Metadata";
import { AudioTrack } from "../components/AudioTrack";

export const TokenDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { chain: activeChain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [token, setToken] = useState<Token>();
  const [metadata, setMetadata] = useState<Metadata>();

  useEffect(() => {
    if (id) getToken();
  }, [id]);

  useEffect(() => {
    if (token) getMetadata();
  }, [token]);

  const getToken = async () => {
    if (!provider) {
      return;
    }

    const utilContract = new Contract(
      getNetwork(activeChain?.id || auroraChain.id).utilAddress,
      utilContractData.abi,
      provider
    );

    try {
      const resp = await utilContract.getToken(id);
      setToken(respToToken(resp));
    } catch (e) {
      console.log(e);
      launchToast("An error occurred fetching item data.", ToastType.Error);
    }
  };

  const getMetadata = async () => {
    const { data } = await axios.get(getIpfsUri(token!.uri));
    setMetadata(data);
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
    <div>
      <div>Detail Page</div>
      {token && (
        <div>
          <div>ID: {token.id}</div>
          <div>URI: {token.uri}</div>
          <div>Minter: {token.minter}</div>
          <div>Price: {ethers.utils.formatEther(token.price)}</div>
          <div>Supply: {token.supply}</div>
          <div>Available: {token.available}</div>
          {metadata && (
            <div className="text-gray-500 py-4">
              <div>Name: {metadata.name}</div>
              <div>Description: {metadata.description}</div>
              <div>Duration: {metadata.duration}</div>
              <div>Format: {metadata.format}</div>
              <div>Genre: {metadata.genre}</div>
              <div>License: {metadata.license}</div>
              <div>BPM: {metadata.bpm}</div>
              <AudioTrack url={getIpfsUri(metadata.file)} />
              <div className="mt-5">STEMS</div>
              {metadata.stems.map((stem, index) => (
                <div className="py-2" key={index}>
                  <div>{stem.description}</div>
                  <AudioTrack url={getIpfsUri(stem.file)} />
                </div>
              ))}
            </div>
          )}
          <Button onClick={buy}>Buy</Button>
        </div>
      )}
    </div>
  );
};
