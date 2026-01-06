import { useCallback, useState } from "react";

import { SongSearch } from "./SongSearch";

/**
 * Manages search query state with sessionStorage persistence.
 * Handles both current query and previous queries history.
 */
export function useSongSearch() {
  const [currentQuery, setCurrentQuery] = useState<string | undefined>(
    () => SongSearch.currentQuery || undefined
  );

  const [previousQueries, setPreviousQueries] = useState<string[]>(
    () => SongSearch.queries
  );

  /**
   * Updates the current query (called on every keystroke).
   * @param query - The search query string
   * @returns The query string for filtering
   */
  const updateCurrentQuery = useCallback((query = "") => {
    SongSearch.currentQuery = query;
    return query;
  }, []);

  /**
   * Submits a search query. Sets it as the current query and persists to history.
   * @param query - The search query string to submit
   * @returns void
   */
  const submitQuery = useCallback((query = "") => {
    setCurrentQuery(query);
    SongSearch.currentQuery = query;

    // Immediately persist non-empty queries to history
    if (query.trim()) {
      SongSearch.addQuery(query);
      setPreviousQueries(SongSearch.queries);
    }
  }, []);

  /**
   * Clears all previous search queries from history and resets the current
   * query.
   * @returns void
   */
  const clearQueries = useCallback(() => {
    SongSearch.clearQueries();
    setPreviousQueries([]);
    setCurrentQuery(undefined);
  }, []);

  return {
    clearQueries,
    currentQuery,
    previousQueries,
    submitQuery,
    updateCurrentQuery
  };
}
