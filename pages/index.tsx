import { useMemo } from "react";

import AppNav from "@/components/AppNav";
import Loading from "@/components/Loading";
import SongList from "@/components/SongList";
import { SongSearchForm } from "@/components/SongSearchForm";
import { SongSearch } from "@/lib/SongSearch";
import useSongs from "@/lib/useSongs";
import { useSongSearch } from "@/lib/useSongSearch";

function Index() {
  const {
    clearQueries,
    previousQueries,
    searchQuery,
    submitQuery,
    updateQuery
  } = useSongSearch();

  const { songs, isLoading } = useSongs();

  // Derive filtered songs from search query and songs
  const filteredSongs = useMemo(() => {
    if (typeof searchQuery === "string" && searchQuery) {
      return SongSearch.search(searchQuery, songs);
    }
    return [];
  }, [searchQuery, songs]);

  const showLoading = isLoading;

  return (
    <>
      <AppNav />
      {showLoading ? (
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
          <div className="mt-gutter flex w-full flex-1 flex-col">
            {searchQuery && <SongList songs={filteredSongs} />}
            {!searchQuery && previousQueries.length > 0 && (
              <>
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
                  id="previous-queries-list"
                  className="queries-list"
                  aria-labelledby="previous-queries-label"
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Index;
