// Input that filters a list of songs
//
// Note: The component is memoized so it only re-renders when the list of songs
// is changed.

import React, { memo } from "react";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import { Song } from "lib/types";
import styles from "./styles.scss";

const fuseOptions = {
  distance: 0,
  keys: [{ name: "artist", weight: 0.7 }, { name: "name", weight: 0.3 }],
  location: 0,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  shouldSort: true,
  threshold: 0.1
};

interface SongSearchProps {
  setFilteredSongs: (songs: Song[]) => void;
  setSearchStatus: (string) => void;
  songs: Song[];
};

function SongSearch({
  setFilteredSongs,
  setSearchStatus,
  songs
}: SongSearchProps) {
  const fuse = new Fuse(songs, fuseOptions);

  function searchSongs(query) {
    if (!query) {
      setFilteredSongs([]);
      setSearchStatus(null);
      return;
    }

    const searchResults = fuse.search(query);
    setFilteredSongs(searchResults);
    setSearchStatus(`${searchResults.length} results`);
  }

  const debouncedSearchSongs = debounce(searchSongs, 666);

  return (
    <input
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      className={styles.searchSongs}
      onChange={(e) => {
        e.persist();

        // FIXME
        setSearchStatus("searching…");
        const query = e.target.value;

        if (query.length > 2 || query.length === 0) {
          debouncedSearchSongs(query);
        }
      }}
      type="text"
      placeholder="search songz"
    />
  );
}

export default memo(
  SongSearch,
  (prevProps, nextProps) => prevProps.songs === nextProps.songs
);
