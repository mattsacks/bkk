// Global state on user auth

import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import request from "lib/request";

export interface LoginRequest {
  (name: string, room: string): Promise<boolean | string>;
}

interface LoggedInState {
  authed: boolean;
  status: string | null;
}

const LOGGED_IN_COOKIE = "mathisUserIsLoggedIn";
const LoggedInContext = createContext(null);

export function LoggedInContextProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState({
    authed: Cookies.get(LOGGED_IN_COOKIE) != undefined,
    status: null
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
      Cookies.set(LOGGED_IN_COOKIE, true);
      setLoggedIn({
        authed: true,
        status: null
      });
      return true;
    } else {
      setLoggedIn({
        authed: false,
        status: response.statusText
      });
    }
  };

  function logoutUser() {
    Cookies.remove(LOGGED_IN_COOKIE);
    setLoggedIn({
      authed: false,
      status: null
    });
  }

  return (
    <LoggedInContext.Provider value={[loggedIn, loginUser, logoutUser]}>
      {children}
    </LoggedInContext.Provider>
  );
}

export default function useLoggedIn() {
  return useContext(LoggedInContext);
}
