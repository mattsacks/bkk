import { useCallback, useState } from "react";

import { SongSearch } from "./SongSearch";

/**
 * Manages search query state with sessionStorage persistence.
 * Handles both active query and previous queries history.
 */
export function useSongSearch() {
  const [lastQuery, setLastQuery] = useState<string | undefined>(
    () => SongSearch.activeQuery || undefined
  );

  const [previousQueries, setPreviousQueries] = useState<string[]>(
    () => SongSearch.queries
  );

  /**
   * Updates the search filter (called on every keystroke).
   * @param query - The search query string
   * @returns The query string for filtering
   */
  const updateSearchFilter = useCallback((query = "") => {
    SongSearch.activeQuery = query;

    return query;
  }, []);

  /**
   * Submits a search query. Sets it as the initial query and persists to history.
   * @param query - The search query string to submit
   * @returns void
   */
  const submitQuery = useCallback((query = "") => {
    setLastQuery(query);
    SongSearch.activeQuery = query;

    // Immediately persist non-empty queries to history
    if (query.trim()) {
      SongSearch.addQuery(query);
      setPreviousQueries(SongSearch.queries);
    }
  }, []);

  /**
   * Clears all previous search queries from history and resets the active
   * query.
   * @returns void
   */
  const clearQueries = useCallback(() => {
    SongSearch.clearQueries();
    setPreviousQueries([]);
    setLastQuery(undefined);
  }, []);

  return {
    clearQueries,
    lastQuery,
    previousQueries,
    submitQuery,
    updateSearchFilter
  };
}
