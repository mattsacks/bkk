import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";

import { USER_COOKIE } from "@/lib/types";

interface DataContextType {
  token: string | undefined;
  setToken: ReturnType<typeof useState<string | undefined>>[1];
}

export const DataContext = createContext<DataContextType>({
  token: undefined,
  setToken: () => null
});

export function useInitializeToken(initialToken?: string) {
  const [token, setToken] = useState(initialToken);

  useEffect(() => {
    const storedToken = Cookies.get(USER_COOKIE);

    if (!token && storedToken) {
      setToken(storedToken);
    }
  }, [token]);

  return [token, setToken] as const;
}
