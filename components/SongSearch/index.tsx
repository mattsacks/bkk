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
  distance: 100,
  keys: [{ name: "artist", weight: 0.7 }, { name: "name", weight: 0.3 }],
  location: 0,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  shouldSort: true,
  threshold: 0.2
};

function SongSearch(props: {
  setFilteredSongs: (songs: Song[]) => void;
  songs: Song[];
}) {
  const { setFilteredSongs, songs } = props;

  const fuse = new Fuse(songs, fuseOptions);

  function searchSongs(query) {
    const searchResults = fuse.search(query);
    setFilteredSongs(searchResults);
  }

  const debouncedSearchSongs = debounce(searchSongs, 250);

  return (
    <input
      autoComplete="off"
      autoCapitalize="none"
      className={styles.searchSongs}
      onChange={(e) => {
        e.persist();

        const query = e.target.value;

        if (query.length > 2 || query.length === 0) {
          debouncedSearchSongs(e.target.value);
        }
      }}
      type="text"
      placeholder="search songz"
    />
  );
};

export default memo(
  SongSearch,
  (prevProps, nextProps) => prevProps.songs === nextProps.songs
);
