import React, { useEffect, useState } from "react";
import classnames from "classnames";
import useLoggedIn from "lib/useLoggedIn";
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
  const { 2: logoutUser } = useLoggedIn();

  // TODO make getSongs and setSongs into a useSongs hook
  useEffect(() => {
    getSongs().then((songs) => {
      setSongs(songs);
    });
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.buttons}>
        <button onClick={logoutUser}>&lt; leave room</button>
        <button>view queue &gt;</button>
      </div>
      <div className={styles.toolbar}>
        <SongSearch setFilteredSongs={setFilteredSongs} songs={songs} />
        <div className={classnames(styles.loading, {
          [styles.isLoading]: songs.length === 0
        })}>loading songs…</div>
      </div>
      <SongList songs={filteredSongs} />
    </div>
  );
}
