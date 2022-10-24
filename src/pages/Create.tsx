import { Button, Input } from "@material-tailwind/react";
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

const initialMetadata: Metadata = {
  name: "",
  description: "",
  file: "",
  genre: "",
  bpm: 0,
  format: "",
  duration: 0,
  license: "",
  stems: [],
};

export const CreatePage = (): JSX.Element => {
  const { chain: activeChain } = useNetwork();
  const { data: signer } = useSigner();
  const [track, setTrack] = useState<File>();
  const [stems, setStems] = useState<File[]>([]);
  const [cid, setCid] = useState<string>();
  const [metadata, setMetadata] = useState<Metadata>(initialMetadata);

  const nftStorage = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3NzNEOTI2YWIzNDI3NTYxODZlZDVCMkU4RjkwMTNFMmEyMmRjN2UiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NjQ2NDQxNjAxMSwibmFtZSI6InN0M216In0.Q2VmRzN_OtIZdQLImq4JMmhYyi6i9dxX0vMHvhLi7c4",
  });

  const create = async () => {
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
    const stemsMeta: Stem[] = stems.map((stem, i) => {
      return {
        description: metadata.stems[i].description,
        file: `ipfs://${filesCid}/${stem.name}`,
      };
    });

    const _metadata = {
      ...metadata,
      file: `ipfs://${filesCid}/${track!.name}`,
      format: track!.name.slice(track!.name.lastIndexOf(".") + 1),
      stems: stemsMeta,
    };

    return new File([JSON.stringify(_metadata)], "metadata.json", {
      type: "application/json",
    });
  };

  return (
    <div>
      <h1 className="text-6xl font-bold pb-2 text-center">Create NFT</h1>
      <div className="mb-10">
        <div>Upload track</div>
        <UploadAudio
          onUpload={(files) => setTrack(files[0])}
          className="w-56"
        ></UploadAudio>
        {track && (
          <AudioTrack
            url={URL.createObjectURL(track)}
            onDurationRead={(_duration) =>
              setMetadata({ ...metadata, duration: _duration })
            }
          />
        )}
        <div className="w-1/2 py-2">
          <Input
            variant="outlined"
            label="Name"
            size="lg"
            type="text"
            color="orange"
            className="!text-white bg-sec-bg error"
            onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
          />
        </div>
        <div className="w-1/2 py-2">
          <Input
            variant="outlined"
            label="Description"
            size="lg"
            type="text"
            color="orange"
            className="!text-white bg-sec-bg error"
            onChange={(e) =>
              setMetadata({ ...metadata, description: e.target.value })
            }
          />
        </div>
        <div className="w-1/2 py-2">
          <Input
            variant="outlined"
            label="Genre"
            size="lg"
            type="text"
            color="orange"
            className="!text-white bg-sec-bg error"
            onChange={(e) =>
              setMetadata({ ...metadata, genre: e.target.value })
            }
          />
        </div>
        <div className="w-1/2 py-2">
          <Input
            variant="outlined"
            label="BPM"
            size="lg"
            type="number"
            color="orange"
            className="!text-white bg-sec-bg error"
            onChange={(e) =>
              setMetadata({ ...metadata, bpm: Number(e.target.value) })
            }
          />
        </div>
        <div className="w-1/2 py-2">
          <Input
            variant="outlined"
            label="License"
            size="lg"
            type="text"
            color="orange"
            className="!text-white bg-sec-bg error"
            onChange={(e) =>
              setMetadata({ ...metadata, license: e.target.value })
            }
          />
        </div>
      </div>
      <div>
        <div>Upload stems</div>
        <UploadAudio
          onUpload={(files) => {
            setStems([...stems, ...files]);
            setMetadata({
              ...metadata,
              stems: [
                ...metadata.stems,
                ...Array(files.length).fill({ description: "", file: "" }),
              ],
            });
          }}
          multiple={true}
          className="w-56"
        ></UploadAudio>
        <div className="p-10">
          {stems.map((stem, index) => (
            <div className="mb-2" key={index}>
              <AudioTrack url={URL.createObjectURL(stem)} />
              <div>{stem.name}</div>
              <div className="w-1/2 py-2">
                <Input
                  variant="outlined"
                  label="Description"
                  size="lg"
                  type="text"
                  color="orange"
                  className="!text-white bg-sec-bg error"
                  onChange={(e) => {
                    const stemsMeta = JSON.parse(
                      JSON.stringify(metadata.stems)
                    );
                    console.log(stemsMeta);
                    console.log("updating index", index);
                    stemsMeta[index].description = e.target.value;
                    console.log(stemsMeta);
                    setMetadata({ ...metadata, stems: stemsMeta });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Button onClick={create}>Create</Button>
        <Button onClick={() => storeIpfs()}>Store</Button>
        <Button onClick={() => console.log(metadata)}>Check Meta</Button>
      </div>
    </div>
  );
};
