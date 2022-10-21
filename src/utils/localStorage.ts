import { auroraChain, ChainId, CHAINS } from "../Config";

const STORAGE_BANNER_DISMISSED = "ST3MZ_banner_dismissed";
const STORAGE_ACTIVE_NETWORK = "ST3MZ_active_network";
const STORAGE_JWTS = "ST3MZ_jwts_chain_{chainId}";

export interface JWT {
  address: string;
  token: string;
}

export const getJwt = (address: string): JWT | undefined => {
  return getJwts().find((jwt) => jwt.address === address);
};

export const addJwt = (newJwt: JWT): void => {
  const jwts = getJwts();
  const index = jwts.findIndex((jwt) => jwt.address === newJwt.address);
  if (index > -1) {
    jwts.splice(index, 1);
  }
  jwts.push(newJwt);
  localStorage.setItem(
    STORAGE_JWTS.replace("{chainId}", getActiveNetwork().toString()),
    JSON.stringify(jwts)
  );
};

export const removeJwt = (address: string): void => {
  const jwts = getJwts();
  const index = jwts.findIndex((jwt) => jwt.address === address);
  if (index > -1) {
    jwts.splice(index, 1);
    localStorage.setItem(
      STORAGE_JWTS.replace("{chainId}", getActiveNetwork().toString()),
      JSON.stringify(jwts)
    );
  }
};

const getJwts = (): JWT[] => {
  const jwtsStr = localStorage.getItem(
    STORAGE_JWTS.replace("{chainId}", getActiveNetwork().toString())
  );
  return jwtsStr ? JSON.parse(jwtsStr) : [];
};

export const getBannerDismissed = (): boolean => {
  return localStorage.getItem(STORAGE_BANNER_DISMISSED) ? true : false;
};

export const setBannerDismissed = (): void => {
  localStorage.setItem(STORAGE_BANNER_DISMISSED, "true");
};

export const getActiveNetwork = (): ChainId => {
  const value = localStorage.getItem(STORAGE_ACTIVE_NETWORK);
  if (value && CHAINS.findIndex((c) => c.id === Number(value)) > -1) {
    return Number(value);
  }
  return auroraChain.id;
};

export const setActiveNetwork = (value: ChainId): void => {
  localStorage.setItem(STORAGE_ACTIVE_NETWORK, value.toString());
};
