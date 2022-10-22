import { Button } from "@material-tailwind/react";
import {
  Chain,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getNetwork } from "../../Config";
import st3mzContractData from "../../contracts/St3mz.json";
export const Transaction = ({ chain }: { chain: Chain }): JSX.Element => {
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: getNetwork(chain.id).st3mzAddress,
    abi: st3mzContractData.abi,
    functionName: "setFoo",
    args: [333],
  });
  const { data, error, isError, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });
  return (
    <>
      <Button disabled={!write || isLoading} onClick={() => write!()}>
        {isLoading ? "Getting foo..." : "Get foo"}
      </Button>
      {isSuccess && (
        <div>
          Success
          {chain.blockExplorers?.default && (
            <div>
              <a href={`${chain.blockExplorers.default.url}/${data?.hash}`}>
                View on {chain.blockExplorers.default.name}
              </a>
            </div>
          )}
        </div>
      )}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </>
  );
};
