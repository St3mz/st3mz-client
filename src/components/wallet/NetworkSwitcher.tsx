import { Button } from "@material-tailwind/react";
import { useNetwork, useSwitchNetwork } from "wagmi";

export const NetworkSwitcher = (): JSX.Element => {
  const { chain: activeChain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  if (!activeChain) return <></>;

  return (
    <div>
      <div>
        Connected to {activeChain?.name ?? activeChain?.id}
        {activeChain?.unsupported && " (unsupported)"}
      </div>

      {switchNetwork && (
        <div>
          {chains.map((x) =>
            x.id === activeChain?.id ? null : (
              <Button key={x.id} onClick={() => switchNetwork(x.id)}>
                {x.name}
                {isLoading && x.id === pendingChainId && " (switching)"}
              </Button>
            )
          )}
        </div>
      )}

      <div>{error && error.message}</div>
    </div>
  );
};
