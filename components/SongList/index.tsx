import React, { useState } from "react";
import Fuse from "fuse.js";
import request from "lib/request";
import { Song } from "lib/types";
import styles from "./styles.scss";

async function addToQueue(song: Song) {
  await request("tracks", {
    body: {
      song_id: song.id
    },
    method: "POST"
  });
}

function SongList(props: { songs: Song[] }) {
  const { songs } = props;
  const [addingTrack, setAddingTrack] = useState(-1);
  const [filteredSongs, setFilteredSongs] = useState([]);

  function searchSongs(event) {
    const search = fuse.search(event.target.value);
    setFilteredSongs(search);
  }

  const fuseOptions = {
    distance: 100,
    keys: [{ name: "artist", weight: 0.7 }, { name: "name", weight: 0.3 }],
    location: 0,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    shouldSort: true,
    threshold: 0.2
  };

  const fuse = new Fuse(songs, fuseOptions);

  // Group songs by artist
  const groupedByArtist = songs.reduce((grouped, song: Song) => {
    if (grouped[song.artist] == undefined) {
      grouped[song.artist] = [];
    }

    grouped[song.artist].push(song);

    return grouped;
  }, {});

  const songsByArtist = [];
  // for (const artist in groupedByArtist) {
  //   const songElements = groupedByArtist[artist].map((artistSong) => {
  //     let className =
  //       artistSong.id == addingTrack
  //         ? `${styles.song} ${styles.adding}`
  //         : styles.song;

  //     return (
  //       <button
  //         className={className}
  //         key={`${artist}-${artistSong.id}`}
  //         onClick={() => {
  //           setAddingTrack(artistSong.id);
  //           addToQueue(artistSong).then(() => setAddingTrack(-1));
  //         }}
  //       >
  //         {artistSong.name} {artistSong.tags}
  //       </button>
  //     );
  //   });
  //   // {songElements}

  //   songsByArtist.push(
  //     <div key={artist}>
  //       <div className={styles.artist}>{artist}</div>
  //     </div>
  //   );
  // }

  const songElements = filteredSongs.map((song) => {
    return (
      <div>
        <b>{song.artist}</b>
        {song.name}
      </div>
    );
  });

  return (
    <div>
      <input onChange={searchSongs} type="search" placeholder="search songz" />
      <div className={styles.songs}>{songElements}</div>
    </div>
  );
}

export default SongList;
