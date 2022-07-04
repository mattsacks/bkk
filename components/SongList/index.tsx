import SongListItem from "components/SongListItem";
import { Song } from "lib/types";
import React from "react";

// function groupSongsByArtist(songs: Song[]) {
//   return songs.reduce((grouped, song: Song) => {
//     if (grouped[song.artist] == undefined) {
//       grouped[song.artist] = [];
//     }

//     grouped[song.artist].push(song);

//     return grouped;
//   }, {});
// }

function SongList(props: { songs: Song[] }) {
  const { songs } = props;

  const ListItems = songs.map((song) => (
    <SongListItem key={song.id} song={song} />
  ));

  return <>{ListItems}</>;
}

export default SongList;
