import { useDeferredValue, useMemo } from "react";

import AppNav from "@/components/AppNav";
import Loading from "@/components/Loading";
import SongList from "@/components/SongList";
import { SongSearchForm } from "@/components/SongSearchForm";
import { SongSearch } from "@/lib/SongSearch";
import useSongs from "@/lib/useSongs";
import { useSongSearch } from "@/lib/useSongSearch";

export default function SongSearchPage() {
  const {
    clearQueries,
    previousQueries,
    searchQuery,
    submitQuery,
    updateQuery
  } = useSongSearch();

  const { songs, isLoading } = useSongs();

  // Defer the search query so the input stays responsive
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Derive filtered songs from deferred search query
  const filteredSongs = useMemo(() => {
    if (typeof deferredSearchQuery === "string" && deferredSearchQuery) {
      return SongSearch.search(deferredSearchQuery, songs);
    }
    return [];
  }, [deferredSearchQuery, songs]);

  // Check if search is pending (user typed faster than search completed)
  const isPending = searchQuery !== deferredSearchQuery;

  return (
    <>
      <AppNav />
      {isLoading ? (
        <div className="app-container flex flex-1 flex-col gap-gutter">
          <Loading className="flex-1" />
        </div>
      ) : (
        <div className="app-container flex flex-1 flex-col items-center gap-gutter">
          <div className="bg-background sticky top-0 z-10 w-full">
            <SongSearchForm
              onSearch={updateQuery}
              onSubmit={submitQuery}
              searchQuery={searchQuery}
            />
          </div>
          {searchQuery && (
            <div className="mt-gutter flex w-full flex-1 flex-col">
              <div
                style={{
                  opacity: isPending ? 0.65 : 1
                }}
              >
                <SongList songs={filteredSongs} />
              </div>
            </div>
          )}
          {!searchQuery && previousQueries.length > 0 && (
            <div className="mt-gutter flex w-full flex-1 flex-col">
              <div className="mb-gutter flex items-center justify-between">
                <p id="previous-queries-label">Previous:</p>
                <button
                  aria-controls="previous-queries-list"
                  aria-label="Clear previous queries"
                  className="underline"
                  onClick={clearQueries}
                >
                  Clear
                </button>
              </div>
              <ol
                aria-labelledby="previous-queries-label"
                className="queries-list"
                id="previous-queries-list"
              >
                {previousQueries.map((query, index) => (
                  <li key={index}>
                    <button
                      className="text-start underline"
                      onClick={() => submitQuery(query)}
                    >
                      {query}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </>
  );
}
