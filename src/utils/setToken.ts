import Cookies from "js-cookie";
import { TokenNames } from "../constants/tokens";

const setToken = (
  tokenName: TokenNames,
  token: string,
  expirationTerm?: number | Date
) => {
  const name =
    tokenName === TokenNames.ACCESS_TOKEN ? `Bearer ${tokenName}` : tokenName;
  Cookies.set(name, token, { expires: expirationTerm });
};

export default setToken;
