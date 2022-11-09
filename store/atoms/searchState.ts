import { atom } from "recoil";

import { SEARCH_KEY } from "@/lib/types";

function initialSearch() {
  if (typeof window !== "undefined") {
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
