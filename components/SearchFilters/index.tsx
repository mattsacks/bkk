import React from "react";
import classnames from "classnames";
import styles from "./styles.scss";

export const SongSearchFilters = {
  ALL: "all",
  ARTIST: "artist",
  SONG: "song"
} as const;

export type SongSearchFilterKey = keyof typeof SongSearchFilters;
export type SongSearchFilter = typeof SongSearchFilters[SongSearchFilterKey];

interface Props {
  activeSearchFilter: SongSearchFilter;
  setSearchFilter: (searchFilter: SongSearchFilter) => void;
}

function SearchFilter(props: {
  isActive: boolean;
  onClick: () => void;
  searchFilter: SongSearchFilter;
}) {
  const { isActive, onClick, searchFilter } = props;

  return (
    <button
      className={classnames(styles.searchFilter, {
        [styles.activeSearchFilter]: isActive
      })}
      onClick={onClick}
      type="button"
    >
      {searchFilter}
    </button>
  );
}

function SearchFilters(props: Props) {
  const { activeSearchFilter, setSearchFilter } = props;

  const searchFilterElements = Object.keys(SongSearchFilters).map(
    (searchFilterKey: SongSearchFilterKey) => {
      const searchFilter = SongSearchFilters[searchFilterKey];

      return (
        <SearchFilter
          key={searchFilterKey}
          isActive={searchFilter === activeSearchFilter}
          onClick={() => setSearchFilter(searchFilter)}
          searchFilter={searchFilter}
        />
      );
    }
  );

  return <div className={styles.searchFilters}>{searchFilterElements}</div>;
}

export default SearchFilters;
