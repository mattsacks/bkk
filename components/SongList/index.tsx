import React, { useState } from "react";
import SVG from "react-inlinesvg";
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
  const groupedByArtist = filteredSongs.reduce((grouped, song: Song) => {
    if (grouped[song.artist] == undefined) {
      grouped[song.artist] = [];
    }

    grouped[song.artist].push(song);

    return grouped;
  }, {});

  const songsByArtist = [];
  for (const artist in groupedByArtist) {
    const songElements = [];

    for (const song of groupedByArtist[artist]) {
      songElements.push(
        <button
          className={styles.songButton}
          key={song.id}
          onClick={() => addToQueue(song)}
        >
          <div className={styles.song}>{song.name}</div>
          <SVG className={styles.songIcon} src="/right-chevron.svg" />
        </button>
      );
    }

    songsByArtist.push(
      <div key={artist}>
        <div className={styles.artist}>{artist}</div>
        {songElements}
      </div>
    );
  }

  return (
    <div className={styles.songList}>
      <input
        className={styles.searchSongs}
        onChange={searchSongs}
        type="text"
        placeholder="search songz"
      />
      <div className={styles.songs}>{songsByArtist}</div>
    </div>
  );
}

export default SongList;
