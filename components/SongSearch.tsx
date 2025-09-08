// Input that filters a list of songs
import classNames from "classnames";
import { Song } from "lib/types";
import debounce from "lodash/debounce";
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

  // Updates the latest query stored and filters the list of songs, calling the
  // onSearch callback as a result
  function searchSongs(query: string) {
    setSearchQuery(query);

    if (!query) {
      onSearch([]);
      return;
    }

    const searchResults = songSearch(query, songs);
    onSearch(searchResults);
  }

  // Debounced search function to be used while typing in the song search input
  const debouncedSearchSongs = debounce(searchSongs, 666);

  return (
    <div className="flex justify-center">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();

          const query = inputRef.current?.value;
          inputRef.current?.blur();

          if (query) {
            searchSongs(query.toString());
          }
        }}
        className="flex w-full"
      >
        <input
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className={classNames("input w-full", {
            "border-r-0": Boolean(searchQuery)
          })}
          defaultValue={searchQuery}
          enterKeyHint="search"
          id="song-search-input"
          name="search"
          onChange={(e) => {
            e.persist();

            // Replace any smart quotes with regular ones
            const query = e.target.value
              .replace(/[\u2018\u2019]/g, "'")
              .replace(/[\u201C\u201D]/g, '"');

            // Update the typed query
            e.target.value = query;

            if (query.length > 1 || query.length === 0) {
              debouncedSearchSongs(query);
            }
          }}
          placeholder="search songz"
          ref={inputRef}
          type="search"
        />
        {searchQuery && (
          <button
            aria-label="clear search"
            aria-controls="song-search-input"
            className="search-clear action-label h-full bg-primary px-3 text-secondary"
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
            type="button"
          >
            x
          </button>
        )}
      </form>
    </div>
  );
}

export default SongSearch;
