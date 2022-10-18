import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNetwork } from "wagmi";
import { getNetwork } from "../Config";
import { User } from "../models/User";

export const UserPage = (): JSX.Element => {
  const { userAddress } = useParams<{ userAddress: string }>();
  const { chain: activeChain } = useNetwork();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (!userAddress) return;
    getUser();
  }, [userAddress]);

  const getUser = (): void => {
    if (!activeChain) return;
    const apiUrl = getNetwork(activeChain.id).apiUrl;
    axios
      .get(`${apiUrl}/user/${userAddress}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      User page
      <div>{user?.name}</div>
    </div>
  );
};
