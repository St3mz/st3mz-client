import { Button } from "@material-tailwind/react";
import { Contract, ethers } from "ethers";
import { useNetwork, useSigner } from "wagmi";
import { getNetwork } from "../Config";
import st3mzContractData from "../contracts/St3mz.json";
import { Metadata, Stem } from "../models/Metadata";
import { launchToast, ToastType } from "../utils/util";
import { NFTStorage, File } from "nft.storage";
import { UploadAudio } from "../components/UploadAudio";
import { useState } from "react";
import { AudioTrack } from "../components/AudioTrack";

export const CreatePage = (): JSX.Element => {
  const { chain: activeChain } = useNetwork();
  const { data: signer } = useSigner();
  const [track, setTrack] = useState<File>();
  const [stems, setStems] = useState<File[]>([]);
  const [cid, setCid] = useState<string>();
  const nftStorage = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3NzNEOTI2YWIzNDI3NTYxODZlZDVCMkU4RjkwMTNFMmEyMmRjN2UiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NjQ2NDQxNjAxMSwibmFtZSI6InN0M216In0.Q2VmRzN_OtIZdQLImq4JMmhYyi6i9dxX0vMHvhLi7c4",
  });

  const create = async () => {
    setCid("bafkreid4bkvcxywoj7wzyow2f2mgz3q4gqumll4a7joptdbyhgicja4rdi");
    if (!signer || !activeChain || !cid) {
      return;
    }

    const amount = 5;
    const price = ethers.utils.parseEther("0.1");

    const st3mzContract = new Contract(
      getNetwork(activeChain.id).st3mzAddress,
      st3mzContractData.abi,
      signer
    );

    try {
      const tx = await st3mzContract.mint(`ipfs://${cid}`, amount, price);
      const events = (await tx.wait()).events;
      console.log(events[0].args);
    } catch (e) {
      console.log(e);
      launchToast("An error occurred creating the item.", ToastType.Error);
    }
  };

  const storeIpfs = async () => {
    if (!track || !stems.length) return;
    const filesCid = await nftStorage.storeDirectory([track, ...stems]);
    const metadataCid = await nftStorage.storeBlob(generateMetadata(filesCid));
    console.log(metadataCid);
    setCid(metadataCid);
  };

  const generateMetadata = (filesCid: string): File => {
    const stemsMeta: Stem[] = stems.map((stem) => {
      return {
        description: stem.name,
        file: `ipfs://${filesCid}/${stem.name}`,
      };
    });
    const metadata: Metadata = {
      name: "Test",
      description: "Test",
      file: `ipfs://${filesCid}/${track!.name}`,
      genre: "Test",
      bpm: 120,
      format: "mp3",
      duration: 100,
      license: "MIT",
      stems: stemsMeta,
    };

    return new File([JSON.stringify(metadata)], "metadata.json", {
      type: "application/json",
    });
  };

  return (
    <div className="p-10">
      <div>
        <div>Upload track</div>
        <UploadAudio
          onUpload={(files) => setTrack(files[0])}
          className="w-56"
        ></UploadAudio>
        <div className="p-10">
          {track && <AudioTrack url={URL.createObjectURL(track)} />}
        </div>
      </div>
      <div>
        <div>Upload stems</div>
        <UploadAudio
          onUpload={(files) => setStems([...stems, ...files])}
          multiple={true}
          className="w-56"
        ></UploadAudio>
        <div className="p-10">
          {stems.map((stem, index) => (
            <div className="mb-2" key={index}>
              <AudioTrack url={URL.createObjectURL(stem)} />
              <div>{stem.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Button onClick={create}>Create</Button>
        <Button onClick={() => storeIpfs()}>Store</Button>
      </div>
    </div>
  );
};
