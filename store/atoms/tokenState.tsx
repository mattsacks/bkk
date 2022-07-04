import Cookies from "js-cookie";
import { atom } from "recoil";

import { USER_COOKIE } from "@/lib/types";

const tokenState = atom({
  key: "token",
  default: Cookies.get(USER_COOKIE),
  effects: [
    ({ onSet }) => {
      onSet((cookie) => {
        if (cookie) {
          Cookies.set(USER_COOKIE, cookie);
        } else {
          Cookies.remove(USER_COOKIE);
        }
      });
    }
  ]
});

export default tokenState;
