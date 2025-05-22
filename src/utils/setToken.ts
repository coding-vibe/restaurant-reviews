import Cookies from "js-cookie";
import { TokenNames } from "../constants/tokens";

const setToken = (
  tokenName: TokenNames,
  token: string,
  expirationTerm?: number | Date
) => {
  Cookies.set(tokenName, token, { expires: expirationTerm });
};

export default setToken;
