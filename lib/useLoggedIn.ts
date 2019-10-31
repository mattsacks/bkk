// Determines if the session is logged in
import React from "react";
import Cookies from "js-cookie";
import request from "lib/request";

export interface LoginRequest {
  (name: string, room: string): Promise<boolean | string>;
}

function useLoggedIn(): [boolean, LoginRequest] {
  const [isLoggedIn, setLoggedin] = React.useState(
    Cookies.get("mathis_user_is_logged_in") != undefined
  );

  const loginUser: LoginRequest = async function login(name, room) {
    const response = await request("user/signin", {
      body: {
        name,
        session_key: room // room
      },
      method: "POST"
    });

    if (response.status === 200) {
      Cookies.set("mathis_user_is_logged_in", true);
      setLoggedin(true);
      return true;
    } else {
      return false;
    }
  }

  return [isLoggedIn, loginUser];
}

export default useLoggedIn;
