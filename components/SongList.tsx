import { useMemo } from "react";

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

function SongList({ isPending = false, query, songs }: SongListProps) {
  const { queue } = useQueue();

  // Perform expensive search filtering here, with the deferred query value
  // This computation will be interruptible and won't block the input
  const filteredSongs = useMemo(() => {
    if (typeof query === "string" && query) {
      return SongSearch.search(query, songs);
    } else {
      return [];
    }
  }, [query, songs]);

  const ListItems = filteredSongs.map((song) => {
    const queuedTrack = queue.find((q) => q.song_id === song.id);

    return (
      <SongListItemMemo key={song.id} queuedTrack={queuedTrack} song={song} />
    );
  });

  if (filteredSongs.length === 0 && !isPending) {
    return <div className="song-list-container">no songs found</div>;
  } else {
    return <div className="song-list-container">{ListItems}</div>;
  }
}

export default SongList;
