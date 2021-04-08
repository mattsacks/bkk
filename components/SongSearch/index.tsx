// Input that filters a list of songs
import React, { useRef } from "react";
import { debounce, orderBy } from "lodash";
import { Song, SongSearchFilters, SongSearchFilter } from "lib/types";

interface SongSearchProps {
  setFilteredSongs: (songs: Song[]) => void;
  songs: Song[];
}

function search(query: string, filter: SongSearchFilter, songs: Song[]) {
  const queryTerms = query
    // .replace(/[\d]/g, "") maybe don't do this?
    .toLowerCase()
    .split(" ");

  function matchSong(song: Song) {
    let songString =
      filter === SongSearchFilters.ARTIST
        ? song.artist
        : filter === SongSearchFilters.SONG
        ? song.name
        : `${song.artist} ${song.name}`;

    songString = songString.toLowerCase();

    return queryTerms.every((term) => songString.includes(term));
  }

  return songs.filter(matchSong);
}

let persistedQuery: string;

function SongSearch({ setFilteredSongs, songs }: SongSearchProps) {
  function searchSongs(query: string) {
    if (!query) {
      setFilteredSongs([]);
      return;
    }

    const searchResults = search(query, undefined, songs) as Song[];
    setFilteredSongs(orderBy(searchResults, "artist", "asc"));
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
