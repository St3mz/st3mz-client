import { useAccount, useEnsName } from "wagmi";

export const Account = (): JSX.Element => {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount({
    onConnect: ({ address, connector, isReconnected }) => {
      console.log("Connected to", address);
      console.log("Is reconnected", isReconnected);
    },
    onDisconnect: () => {
      console.log("Disconnected from", address);
    },
  });
  const { data: ensNameData } = useEnsName({ address });

  return (
    <div>
      {isConnecting && <div>Connecting...</div>}
      {isDisconnected && <div>Disconnected</div>}
      {ensNameData ?? address}
      {ensNameData ? ` (${address})` : null}
    </div>
  );
};
