// Global state on user auth

import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import request from "lib/request";

export interface LoginRequest {
  (name: string, room: string): Promise<boolean | string>;
}

interface LoggedInState {
  status: string | null;
  user: { bookingKey: string, username: string } | null;
}

export const USER_COOKIE = "mathisUser";
const LoggedInContext = createContext(null);

export function LoggedInContextProvider({ children }) {
  const usercookie = Cookies.get(USER_COOKIE);

  const [loggedIn, setLoggedIn] = useState<LoggedInState>({
    status: null,
    user: usercookie ? JSON.parse(usercookie) : null
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
      const { bookingKey, username } = await response.json();

      Cookies.set(USER_COOKIE, {
        bookingKey, username
      });

      setLoggedIn({
        status: null,
        user: { bookingKey, username }
      });
      return true;
    } else {
      setLoggedIn({
        status:
          response.statusText || `unknown error (status ${response.status})`,
        user: null
      });
    }
  };

  function logoutUser() {
    Cookies.remove(USER_COOKIE);
    setLoggedIn({
      status: null,
      user: null
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
