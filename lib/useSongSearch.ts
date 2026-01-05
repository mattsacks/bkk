import debounce from "lodash/debounce";
import { useCallback, useMemo, useState } from "react";

import { SongSearch } from "./SongSearch";

/**
 * Manages search query state with localStorage persistence.
 * Handles both active query and previous queries history.
 */
export function useSongSearch() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(
    () => SongSearch.activeQuery || undefined
  );
  const [previousQueries, setPreviousQueries] = useState<string[]>(
    () => SongSearch.queries
  );

  // Wait for user to stop typing for persisting previous query
  const debouncedAddQuery = useMemo(
    () =>
      debounce((query: string) => {
        if (query.trim()) {
          SongSearch.addQuery(query);
          setPreviousQueries(SongSearch.queries);
        }
      }, 666),
    []
  );

  /**
   * Updates the active query and persists non-empty queries to search history
   * after user pauses typing.
   * @param query - The search query string
   * @returns void
   */
  const updateQuery = useCallback(
    (query = "") => {
      setSearchQuery(query);
      SongSearch.activeQuery = query;

      // Debounced: Add to history after user stops typing
      debouncedAddQuery(query);
    },
    [debouncedAddQuery]
  );

  /**
   * Submits a search query. Immediately persists non-empty queries to search
   * history.
   * @param query - The search query string to submit
   * @returns void
   */
  const submitQuery = useCallback(
    (query = "") => {
      setSearchQuery(query);
      SongSearch.activeQuery = query;

      // Cancel any pending debounced calls
      debouncedAddQuery.cancel();

      // Immediately persist non-empty queries to history
      if (query.trim()) {
        SongSearch.addQuery(query);
        setPreviousQueries(SongSearch.queries);
      }
    },
    [debouncedAddQuery]
  );

  /**
   * Clears all previous search queries from history and resets the active
   * query.
   * @returns void
   */
  const clearQueries = useCallback(() => {
    SongSearch.clearQueries();
    setPreviousQueries([]);
    setSearchQuery(undefined);
  }, []);

  return {
    clearQueries,
    /** Array of previous search queries from history */
    previousQueries,
    /** The current active search query string */
    searchQuery,
    submitQuery,
    updateQuery
  };
}
