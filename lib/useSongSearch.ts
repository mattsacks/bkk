import { useCallback, useEffect, useState } from "react";

import { SongSearch } from "./SongSearch";

/**
 * Manages search query state with localStorage persistence.
 * Handles both active query and previous queries history.
 */
export function useSongSearch() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const [previousQueries, setPreviousQueries] = useState<string[]>([]);

  // Sync w/ localStorage
  useEffect(() => {
    const activeQuery = SongSearch.activeQuery;

    if (activeQuery) {
      setSearchQuery(activeQuery);
    }

    setPreviousQueries(SongSearch.queries);
  }, []);

  /**
   * Updates the active query as user types. Does not persist to search
   * history.
   * @param query - The search query string
   * @returns void
   */
  const updateQuery = useCallback((query = "") => {
    setSearchQuery(query);
    SongSearch.activeQuery = query;
  }, []);

  /**
   * Submits a search query. Persists non-empty queries to search history.
   * @param query - The search query string to submit
   * @returns void
   */
  const submitQuery = useCallback((query = "") => {
    setSearchQuery(query);
    SongSearch.activeQuery = query;

    // Only persist non-empty queries to history
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
    setSearchQuery(undefined);
  }, []);

  return {
    clearQueries,
    previousQueries,
    searchQuery,
    submitQuery,
    updateQuery
  };
}
