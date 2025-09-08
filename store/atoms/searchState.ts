import { atom } from "recoil";

import { isServer } from "@/lib/isServer";
import { SEARCH_KEY } from "@/lib/types";

function initialSearch() {
  if (!isServer) {
    return window.sessionStorage.getItem(SEARCH_KEY);
  }

  return "";
}

const searchState = atom({
  key: "search",
  default: "",
  effects: [
    ({ onSet, setSelf }) => {
      const firstSearch = initialSearch();
      if (firstSearch) {
        setSelf(firstSearch);
      }

      onSet((newSearch = "") => {
        window.sessionStorage.setItem(SEARCH_KEY, newSearch);
      });
    }
  ]
});

export default searchState;
