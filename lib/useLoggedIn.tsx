// Global state on user auth

import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import request from "lib/request";

export interface LoginRequest {
  (name: string, room: string): Promise<boolean | string>;
}

interface LoggedInState {
  token: string | null,
  status: string | null;
  user: { bookingKey: string, username: string } | null;
}

export const USER_COOKIE = "mathis_user";
const LoggedInContext = createContext(null);

export function LoggedInContextProvider({ children }) {
  const usercookie = Cookies.get(USER_COOKIE);

  const [loggedIn, setLoggedIn] = useState<LoggedInState>({
    token: usercookie || undefined, // FIXME: use ??
    status: undefined,
    user: undefined
  });

  const loginUser: LoginRequest = async function login(name, room) {
    const response = await request("user/signin", {
      body: {
        name,
        session_key: room // room
      },
      method: "POST"
    });

    if (response.status === 200) {
      const { token } = await response.json();

      Cookies.set(USER_COOKIE, token);

      setLoggedIn({
        token,
        status: undefined,
        user: undefined
      });
      return true;
    } else {
      setLoggedIn({
        token: undefined,
        status:
          response.statusText || `unknown error (status ${response.status})`,
        user: undefined
      });
    }
  };

  function logoutUser() {
    Cookies.remove(USER_COOKIE);
    setLoggedIn({
      token: null,
      status: null,
      user: null
    });
  }

  return (
    <LoggedInContext.Provider value={[loggedIn, loginUser, logoutUser, setLoggedIn]}>
      {children}
    </LoggedInContext.Provider>
  );
}

export default function useLoggedIn() {
  return useContext(LoggedInContext);
}
