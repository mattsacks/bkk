import React, { useState } from 'react';
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

  // Group songs by artist
  const groupedByArtist = songs.reduce((grouped, song: Song) => {
    if (grouped[song.artist] == undefined) {
      grouped[song.artist] = [];
    }

    grouped[song.artist].push(song);

    return grouped;
  }, {});

  const songsByArtist = [];
  for (const artist in groupedByArtist) {
    const songElements = groupedByArtist[artist].map((artistSong) => {
      let className = artistSong.id == addingTrack ?
        `${styles.song} ${styles.adding}`: styles.song

      return (
        <button
          className={className}
          key={`${artist}-${artistSong.id}`}
          onClick={() => {
            setAddingTrack(artistSong.id)
            addToQueue(artistSong).then(() => setAddingTrack(-1))
          }}>
          {artistSong.name} {artistSong.tags}
        </button>
      );
    });
        // {songElements}

    songsByArtist.push(
      <div key={artist}>
        <div className={styles.artist}>
          {artist}
        </div>
      </div>
    );
  }
  // return <div>{songsByArtist}</div>;

  return (
    <div>
      <input type="search" placeholder="search songz" />
    </div>
  );

}

export default SongList;
