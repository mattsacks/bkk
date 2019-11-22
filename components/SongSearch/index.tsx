// Input that filters a list of songs
//
// Note: The component is memoized so it only re-renders when the list of songs
// is changed.

import React, { memo, useMemo } from "react";
import { Search } from "js-search";
import { debounce } from "lodash";
import { Song } from "lib/types";
import styles from "./styles.scss";

interface SongSearchProps {
  setFilteredSongs: (songs: Song[]) => void;
  setSearchStatus: (string) => void;
  songs: Song[];
}

function SongSearch({
  setFilteredSongs,
  setSearchStatus,
  songs
}: SongSearchProps) {
  const searcher = useMemo(() => {
    let searchInstance = new Search("id");
    searchInstance.addIndex("artist");
    searchInstance.addIndex("name");
    searchInstance.addDocuments(songs);

    return searchInstance;
  }, [songs]);

  function searchSongs(query) {
    if (!query) {
      setFilteredSongs([]);
      setSearchStatus(null);
      return;
    }

    const searchResults = searcher.search(query);
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
