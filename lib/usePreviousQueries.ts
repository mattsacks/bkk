import { useCallback, useState } from "react";

import { SongSearch } from "./songSearch";

/**
 * Tracks previous search queries with localStorage persistence.
 */
export function usePreviousQueries() {
  const [queries, setQueries] = useState<string[]>(() => SongSearch.queries);

  const addQuery = useCallback((query: string) => {
    SongSearch.addQuery(query);
    setQueries([...SongSearch.queries]);
  }, []);

  const clearQueries = useCallback(() => {
    SongSearch.clearQueries();
    setQueries([]);
  }, []);

  return { queries, addQuery, clearQueries };
}
