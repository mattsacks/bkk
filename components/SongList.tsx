import { useEffect, useMemo, useRef, useState } from "react";

import { SongListItemMemo } from "@/components/SongListItem";
import { SongSearch } from "@/lib/SongSearch";
import { Song } from "@/lib/types";
import useQueue from "@/lib/useQueue";

interface SongListProps {
  /** Whether or not the search is using a deferred value. */
  isPending?: boolean;
  /** The search query. */
  query: string;
  /** Songs available for filtering & display. */
  songs: Song[];
}

/** Total number of songs displayed per page. */
const SONGS_PER_PAGE = 50;

function SongList({ isPending = false, query, songs }: SongListProps) {
  const { queue } = useQueue();
  const [page, setPage] = useState(1);
  const [prevQuery, setPrevQuery] = useState(query);
  const scrollPositionRef = useRef<number | null>(null);

  // Reset page when query changes (during render, not in effect)
  if (query !== prevQuery) {
    setPage(1);
    setPrevQuery(query);
  }

  // Restore scroll position after loading more items
  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollPositionRef.current !== null) {
        window.scrollTo(0, scrollPositionRef.current);
        scrollPositionRef.current = null;
      }
    });
  }, [page]);

  // Perform expensive search filtering here, with the deferred query value
  // This computation will be interruptible and won't block the input
  const filteredSongs = useMemo(() => {
    if (typeof query === "string" && query) {
      return SongSearch.search(query, songs);
    } else {
      return [];
    }
  }, [query, songs]);

  const displayedSongs = filteredSongs.slice(0, page * SONGS_PER_PAGE);
  const hasMore = filteredSongs.length > displayedSongs.length;

  const ListItems = displayedSongs.map((song) => {
    const queuedTrack = queue.find((q) => q.song_id === song.id);

    return (
      <SongListItemMemo key={song.id} queuedTrack={queuedTrack} song={song} />
    );
  });

  if (filteredSongs.length === 0 && !isPending) {
    return <div className="song-list-container">no songs found</div>;
  }

  return (
    <div
      className="song-list-container"
      style={{
        contentVisibility: page > 1 ? "auto" : undefined
      }}
    >
      {ListItems}
      {hasMore && (
        <button
          className="button"
          onClick={() => {
            scrollPositionRef.current = window.scrollY;
            setPage((prev) => prev + 1);
          }}
          style={{ alignSelf: "center", marginTop: "1rem" }}
        >
          Load more
        </button>
      )}
    </div>
  );
}

export default SongList;
