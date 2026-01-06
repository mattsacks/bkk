import { useMemo } from "react";

import SongListItem from "@/components/SongListItem";
import { SongSearch } from "@/lib/SongSearch";
import { Song } from "@/lib/types";
import useQueue from "@/lib/useQueue";

interface SongListProps {
  /** The search query. */
  query: string;
  /** Songs available for filtering & display. */
  songs: Song[];
}

function SongList({ query, songs }: SongListProps) {
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

    return <SongListItem key={song.id} queuedTrack={queuedTrack} song={song} />;
  });

  if (filteredSongs.length === 0) {
    return <div className="flex w-full flex-col gap-8">no songs found</div>;
  }

  return <div className="flex w-full flex-col gap-4 sm:gap-6">{ListItems}</div>;
}

export default SongList;
