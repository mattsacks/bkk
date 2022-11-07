// Input that filters a list of songs
import { Song } from "lib/types";
import { debounce, orderBy } from "lodash";
import React, { useRef } from "react";

interface SongSearchProps {
  onSearch: (filteredSongs: Song[]) => void;
  songs: Song[];
}

function search(query: string, songs: Song[]) {
  const queryTerms = query
    // .replace(/[\d]/g, "") maybe don't do this?
    .toLowerCase()
    .split(" ");

  function matchSong(song: Song) {
    const songString = `${song.artist} ${song.name}`.toLowerCase();
    return queryTerms.every((term) => songString.includes(term));
  }

  return songs.filter(matchSong);
}

let persistedQuery: string;

function SongSearch({ onSearch, songs }: SongSearchProps) {
  function searchSongs(query: string) {
    if (!query) {
      onSearch([]);
      return;
    }

    const searchResults = search(query, songs);
    onSearch(orderBy(searchResults, "artist", "asc"));
  }

  const inputRef = useRef(null);

  const debouncedSearchSongs = debounce(searchSongs, 666);

  return (
    <input
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      className="input w-full"
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
      ref={inputRef}
      type="text"
      value={persistedQuery}
    />
  );
}

export default SongSearch;
