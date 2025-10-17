import Cookies from "js-cookie";
import { useCallback, useContext } from "react";

import { DataContext } from "@/components/DataContext";

import { SECONDS_IN_DAY, USER_COOKIE } from "./types";

export function useToken() {
  const { token, setToken } = useContext(DataContext);

  const updateToken = useCallback(
    (newToken: string | undefined) => {
      if (newToken) {
        Cookies.set(USER_COOKIE, newToken, {
          expires: SECONDS_IN_DAY
        });
      } else {
        Cookies.remove(USER_COOKIE);
      }

      setToken(newToken);
    },
    [setToken]
  );

  return [token, updateToken] as const;
}
