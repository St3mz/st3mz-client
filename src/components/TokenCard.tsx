import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { Token } from "../models/Token";
import { DETAIL_ROUTE } from "../navigation/Routes";

export const TokenCard = ({ token }: { token: Token }): JSX.Element => {
  return (
    <div
      className="group my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 transition-transform 
    ease-in-out hover:-translate-y-1 duration-300"
    >
      <Link to={DETAIL_ROUTE.replace(":id", token.id.toString())}>
        <div className="rounded-2xl shadow-lg bg-sec-bg px-6 py-4 overflow-hidden">
          <div>ID: {token.id}</div>
          <div>URI: {token.uri}</div>
          <div>Minter: {token.minter}</div>
          <div>Price: {ethers.utils.formatEther(token.price)}</div>
          <div>Supply: {token.supply}</div>
          <div>Available: {token.available}</div>
        </div>
      </Link>
    </div>
  );
};
