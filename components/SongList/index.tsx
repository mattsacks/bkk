import SongListItem from "components/SongListItem";
import { Song } from "lib/types";
import React from "react";

import useQueue from "@/lib/useQueue";

function SongList(props: { songs: Song[] }) {
  const { songs } = props;
  const { queue } = useQueue();

  const ListItems = songs.map((song) => {
    const queuedTrack = queue.find((q) => q.song_id === song.id);

    return <SongListItem key={song.id} queuedTrack={queuedTrack} song={song} />;
  });

  return <div className="flex flex-col gap-8">{ListItems}</div>;
}

export default SongList;
