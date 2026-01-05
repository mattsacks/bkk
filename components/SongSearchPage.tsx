import { useDeferredValue, useMemo, useState } from "react";

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
    lastQuery,
    previousQueries,
    submitQuery,
    updateSearchFilter
  } = useSongSearch();

  const { songs, isLoading } = useSongs();

  const [searchQuery, setSearchQuery] = useState(lastQuery || "");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const isPending = searchQuery !== deferredSearchQuery;

  // Derive filtered songs from deferred search query
  const filteredSongs = useMemo(() => {
    if (typeof deferredSearchQuery === "string" && deferredSearchQuery) {
      return SongSearch.search(deferredSearchQuery, songs);
    } else {
      return [];
    }
  }, [deferredSearchQuery, songs]);

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
              onSearchChange={(query) => {
                setSearchQuery(query || "");
                updateSearchFilter(query);
              }}
              onSubmit={submitQuery}
              lastQuery={lastQuery}
            />
          </div>
          {searchQuery && (
            <div className="mt-gutter flex w-full flex-1 flex-col">
              {isPending && filteredSongs.length === 0 ? (
                <Loading className="flex-1" />
              ) : (
                <div
                  style={{
                    opacity: isPending ? 0.5 : 1
                  }}
                >
                  <SongList songs={filteredSongs} />
                </div>
              )}
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
                      onClick={() => {
                        setSearchQuery(query);
                        submitQuery(query);
                      }}
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
