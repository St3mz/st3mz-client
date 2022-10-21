import { useState } from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { getNetwork } from "../Config";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import { SiweMessage } from "siwe";
import { addJwt, getJwt } from "../utils/localStorage";
import { User } from "../models/User";

export const Login = (): JSX.Element => {
  const { chain: activeChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const [user, setUser] = useState<User>();

  const login = async () => {
    const chainId = activeChain?.id;
    if (!address || !chainId) return;

    const apiUrl = getNetwork(chainId).apiUrl;

    const nonceRes = await axios.get(`${apiUrl}/auth/nonce?address=${address}`);
    const nonce = nonceRes.data;

    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign message to authenticate.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const verifyRes = await axios.post(`${apiUrl}/auth/verify`, {
        message,
        signature,
      });

      if (!verifyRes.data.authenticated)
        throw new Error("Error verifying message");

      addJwt({ address, token: verifyRes.data.token });
      console.log("Authenticated");
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    const chainId = activeChain?.id;
    if (!address || !chainId) return;
    const apiUrl = getNetwork(chainId).apiUrl;

    const userRes = await axios.get(`${apiUrl}/user/${address}`);
    setUser(userRes.data);
    console.log(userRes.data);
  };

  const updateUser = async () => {
    const chainId = activeChain?.id;
    if (!address || !chainId || !user) return;

    const jwt = getJwt(address);
    if (!jwt) return;

    const apiUrl = getNetwork(chainId).apiUrl;

    let editUser = user;
    editUser.name = "Test";

    const verifyRes = await axios.put(`${apiUrl}/user`, editUser, {
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      },
    });

    console.log(verifyRes.data);
  };

  return (
    <div>
      <Button onClick={login} color="yellow">
        Log in
      </Button>
      <Button onClick={getUser} color="orange">
        Get user
      </Button>
      <Button onClick={updateUser} color="yellow">
        Update user
      </Button>
    </div>
  );
};
