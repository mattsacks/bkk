// Input that filters a list of songs
import classNames from "classnames";
import { Song } from "lib/types";
import { debounce } from "lodash";
import React, { useRef } from "react";
import { useRecoilState } from "recoil";

import songSearch from "@/lib/songSearch";
import searchState from "@/store/atoms/searchState";

interface SongSearchProps {
  onSearch: (filteredSongs: Song[]) => void;
  songs: Song[];
}

function SongSearch({ onSearch, songs }: SongSearchProps) {
  const [searchQuery, setSearchQuery] = useRecoilState(searchState);
  const inputRef = useRef<HTMLInputElement>(null);

  function searchSongs(query: string) {
    setSearchQuery(query);

    if (!query) {
      onSearch([]);
      return;
    }

    const searchResults = songSearch(query, songs);
    onSearch(searchResults);
  }

  const debouncedSearchSongs = debounce(searchSongs, 666);

  return (
    <div className="flex justify-center">
      <input
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        className={classNames("input w-full", {
          "border-r-0": Boolean(searchQuery)
        })}
        defaultValue={searchQuery}
        onChange={(e) => {
          e.persist();

          const query = e.target.value;

          if (query.length > 1 || query.length === 0) {
            debouncedSearchSongs(query);
          }
        }}
        placeholder="search songz"
        ref={inputRef}
      />
      {searchQuery && (
        <div className="border-2 border-primary">
          <button
            className="h-full bg-primary px-3 text-secondary"
            onClick={() => {
              searchSongs("");

              if (inputRef.current) {
                inputRef.current.value = "";
                inputRef.current.focus();

                setTimeout(() => {
                  window.scrollTo(0, 0);
                }, 100);
              }
            }}
          >
            x
          </button>
        </div>
      )}
    </div>
  );
}

export default SongSearch;
