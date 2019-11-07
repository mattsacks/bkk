import React, { useEffect, useState } from "react";
import request from "lib/request";
import SongSearch from "components/SongSearch";
import SongList from "components/SongList";
import styles from "./styles.scss";

async function getSongs() {
  const response = await request("songs");
  const songs = await response.json();

  return songs;
}

export default function App() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);

  // TODO make getSongs and setSongs into a useSongs hook
  useEffect(() => {
    getSongs().then((songs) => {
      setSongs(songs);
    });
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.toolbar}>
        <SongSearch setFilteredSongs={setFilteredSongs} songs={songs} />
      </div>
      <SongList songs={filteredSongs} />
    </div>
  );
}
