import { createGlobal } from "lib/useGlobalState";
import { TokenState, USER_COOKIE } from "lib/types";
import Cookies from "js-cookie";

export interface WithTokenProps {
  token: TokenState;
  setToken: (newToken: TokenState) => void;
}

const withToken = createGlobal<TokenState>("token", {
  updater: (newToken) => {
    if (newToken) {
      Cookies.set(USER_COOKIE, newToken);
    } else {
      Cookies.remove(USER_COOKIE);
    }

    return newToken;
  }
});

export default withToken;
