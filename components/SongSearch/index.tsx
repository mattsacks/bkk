// Input that filters a list of songs
import { Song } from "lib/types";
import { debounce, orderBy } from "lodash";
import React from "react";
import { useRecoilState } from "recoil";

import songSearch from "@/lib/songSearch";
import searchState from "@/store/atoms/searchState";

interface SongSearchProps {
  onSearch: (filteredSongs: Song[]) => void;
  songs: Song[];
}

function SongSearch({ onSearch, songs }: SongSearchProps) {
  const [searchQuery, setSearchQuery] = useRecoilState(searchState);

  function searchSongs(query: string) {
    setSearchQuery(query);

    if (!query) {
      onSearch([]);
      return;
    }

    const searchResults = songSearch(query, songs);
    onSearch(orderBy(searchResults, "artist", "asc"));
  }

  const debouncedSearchSongs = debounce(searchSongs, 666);

  return (
    <input
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      className="input w-full"
      defaultValue={searchQuery}
      onChange={(e) => {
        e.persist();

        // FIXME
        /* setSearchStatus("searching…"); */
        const query = e.target.value;

        if (query.length > 1 || query.length === 0) {
          debouncedSearchSongs(query);
        }
      }}
      placeholder="search songz"
      type="text"
    />
  );
}

export default SongSearch;
