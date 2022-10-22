import { Button } from "@material-tailwind/react";
import { Contract, ethers } from "ethers";
import { useNetwork, useSigner } from "wagmi";
import { getNetwork } from "../Config";
import st3mzContractData from "../contracts/St3mz.json";
import { launchToast, ToastType } from "../utils/util";

export const CreatePage = (): JSX.Element => {
  const { chain: activeChain } = useNetwork();
  const { data: signer } = useSigner();

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

  return (
    <div className="p-10">
      <div>Create Page</div>
      <div>
        <Button onClick={create}>Create</Button>
      </div>
    </div>
  );
};
