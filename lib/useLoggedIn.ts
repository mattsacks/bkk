// Determines if the session is logged in
import React from "react";
import Cookies from "js-cookie";
import request from "lib/request";

export interface LoginRequest {
  (name: string, room: string): Promise<boolean | string>;
}

interface LoggedInState {
  authed: boolean;
  status: string | null;
}

function useLoggedIn(): [LoggedInState, LoginRequest] {
  const [loggedIn, setLoggedIn] = React.useState<LoggedInState>({
    authed: Cookies.get("mathisUserIsLoggedIn") != undefined,
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
      Cookies.set("mathisUserIsLoggedIn", true);
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

  return [loggedIn, loginUser];
}

export default useLoggedIn;
