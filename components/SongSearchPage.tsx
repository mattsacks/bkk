import debounce from "lodash/debounce";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import AppNav from "@/components/AppNav";
import Loading from "@/components/Loading";
import SongList from "@/components/SongList";
import { SongSearchInput } from "@/components/SongSearchInput";
import useSongs from "@/lib/useSongs";
import { useSongSearch } from "@/lib/useSongSearch";

export default function SongSearchPage() {
  const {
    clearQueries,
    currentQuery,
    previousQueries,
    submitQuery,
    updateCurrentQuery
  } = useSongSearch();

  const { songs, isLoading } = useSongs();

  const [searchQuery, setSearchQuery] = useState(currentQuery || "");

  // Debounced submit for persisting queries to history after user stops typing
  const debouncedSubmit = useMemo(
    () => debounce((query: string) => submitQuery(query), 1250),
    [submitQuery]
  );

  // Cancel any pending updates on component unmount
  useEffect(() => {
    return () => debouncedSubmit.cancel();
  }, [debouncedSubmit]);

  const deferredSearchQuery = useDeferredValue(searchQuery);

  return (
    <>
      <AppNav />
      {isLoading ? (
        <div className="app-container gap-gutter flex flex-1 flex-col">
          <Loading className="flex-1" />
        </div>
      ) : (
        <div className="app-container gap-gutter flex flex-1 flex-col items-center">
          <div className="bg-background sticky top-0 z-10 w-full">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                debouncedSubmit.cancel();
                submitQuery(searchQuery);
              }}
            >
              <SongSearchInput
                value={searchQuery}
                onChange={(query) => {
                  setSearchQuery(query);
                  updateCurrentQuery(query);
                  debouncedSubmit(query);
                }}
                onSubmit={() => {
                  debouncedSubmit.cancel();
                  submitQuery(searchQuery);
                }}
              />
            </form>
          </div>
          {searchQuery && (
            <div className="mt-gutter flex w-full flex-1 flex-col">
              <SongList query={deferredSearchQuery} songs={songs} />
            </div>
          )}
          {!searchQuery && previousQueries.length > 0 && (
            <div className="mt-gutter flex w-full flex-1 flex-col">
              <div className="mb-gutter flex items-center justify-between">
                <p id="previous-queries-label">Previous</p>
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
