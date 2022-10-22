import { Button } from "@material-tailwind/react";
import { Contract, ethers } from "ethers";
import { useNetwork, useSigner } from "wagmi";
import { getNetwork } from "../Config";
import st3mzContractData from "../contracts/St3mz.json";
import { Metadata } from "../models/Metadata";
import { launchToast, ToastType } from "../utils/util";
import { NFTStorage, File } from "nft.storage";

export const CreatePage = (): JSX.Element => {
  const { chain: activeChain } = useNetwork();
  const { data: signer } = useSigner();
  const nftStorage = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3NzNEOTI2YWIzNDI3NTYxODZlZDVCMkU4RjkwMTNFMmEyMmRjN2UiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NjQ2NDQxNjAxMSwibmFtZSI6InN0M216In0.Q2VmRzN_OtIZdQLImq4JMmhYyi6i9dxX0vMHvhLi7c4",
  });

  const create = async () => {
    if (!signer || !activeChain) {
      return;
    }

    const uri = "ipfs://fake_uri";
    const amount = 5;
    const price = ethers.utils.parseEther("0.1");

    const st3mzContract = new Contract(
      getNetwork(activeChain.id).st3mzAddress,
      st3mzContractData.abi,
      signer
    );

    try {
      const tx = await st3mzContract.mint(uri, amount, price);
      const events = (await tx.wait()).events;
      console.log(events[0].args);
    } catch (e) {
      console.log(e);
      launchToast("An error occurred creating the item.", ToastType.Error);
    }
  };

  const storeIpfs = async () => {
    const files: File[] = [];
    const filesCid = await nftStorage.storeDirectory(files);
    const metadataCid = await nftStorage.storeBlob(generateMetadata(filesCid));
    console.log(metadataCid);
  };

  const generateMetadata = (filesCid: string): File => {
    const metadata: Metadata = {
      name: "Test",
      description: "Test",
      file: `ipfs://${filesCid}`,
      bpm: 120,
      format: "mp3",
      duration: 100,
      license: "MIT",
      stems: [
        {
          description: "Kick",
          file: "ipfs://kick",
        },
        {
          description: "Snare",
          file: "ipfs://snare",
        },
      ],
    };

    return new File([JSON.stringify(metadata)], "metadata.json", {
      type: "application/json",
    });
  };

  return (
    <div className="p-10">
      <div>Create Page</div>
      <div>
        <Button onClick={create}>Create</Button>
        <Button onClick={() => console.log(storeIpfs())}>Store</Button>
      </div>
    </div>
  );
};
