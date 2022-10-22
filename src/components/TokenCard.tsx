import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { Token } from "../models/Token";
import { DETAIL_ROUTE } from "../navigation/Routes";

export const TokenCard = ({ token }: { token: Token }): JSX.Element => {
  return (
    <Link to={DETAIL_ROUTE.replace(":id", token.id.toString())}>
      <div className="p-5 m-5 bg-blue-gray-600">
        <div>ID: {token.id}</div>
        <div>URI: {token.uri}</div>
        <div>Minter: {token.minter}</div>
        <div>Price: {ethers.utils.formatEther(token.price)}</div>
        <div>Supply: {token.supply}</div>
        <div>Available: {token.available}</div>
      </div>
    </Link>
  );
};
