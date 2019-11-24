// Input that filters a list of songs

import React, { memo, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Song } from "lib/types";
import { SongSearchFilters, SongSearchFilter } from "components/SearchFilters";
import styles from "./styles.scss";

interface SongSearchProps {
  activeSearchFilter: SongSearchFilter;
  setFilteredSongs: (songs: Song[]) => void;
  setSearchStatus: (status: string) => void;
  songs: Song[];
}

// TODO
// * convert accent characters to non-accents?
//   i.e, pokémon -> pokemon
function search(query: string, filter: SongSearchFilter, songs: Song[]) {
  // FIXME prob doesn't scale, we'll want to remove characters we don't care
  // about
  const queryTerms = query.toLowerCase().split(" ");

  function matchSong(song: Song) {
    if (filter === SongSearchFilters.ALL) {
      return queryTerms.every(queryTerm => `${song.artist} ${song.name}`.includes(queryTerm));
    } else if (filter === SongSearchFilters.ARTIST) {
      return queryTerms.every(queryTerm => `${song.artist}`.includes(queryTerm));
    } else if (filter === SongSearchFilters.SONG) {
      return queryTerms.every(queryTerm => `${song.name}`.includes(queryTerm));
    } else {
      return true;
    }
  };

  return songs.filter(matchSong);
}

let persistedQuery: string;

function SongSearch({
  activeSearchFilter,
  setFilteredSongs,
  setSearchStatus,
  songs
}: SongSearchProps) {
  function searchSongs(query: string) {
    if (!query) {
      setFilteredSongs([]);
      setSearchStatus(null);
      return;
    }

    const searchResults = search(query, activeSearchFilter, songs) as Song[];
    setFilteredSongs(searchResults);
    setSearchStatus(`${searchResults.length} results`);
  }

  const inputRef = useRef(null);

  useEffect(() => {
    searchSongs(inputRef.current.value);
  }, [activeSearchFilter]);

  useEffect(() => {
    if (persistedQuery) {
      searchSongs(persistedQuery);
    }

    return function() {
      persistedQuery = inputRef.current.value;
    };
  }, []);

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
      placeholder="search songz"
      ref={inputRef}
      type="text"
      value={persistedQuery}
    />
  );
}

export default memo(
  SongSearch,
  (prevProps, nextProps) =>
    prevProps.songs.length === nextProps.songs.length &&
    prevProps.activeSearchFilter === nextProps.activeSearchFilter
);
