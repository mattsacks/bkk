import React, { useEffect, useState } from "react";
import classnames from "classnames";
import useLoggedIn from "lib/useLoggedIn";
import request from "lib/request";
import Nav from "components/Nav";
import SongSearch from "components/SongSearch";
import SongList from "components/SongList";
import styles from "./styles.scss";

let globalSongs = [];

async function getSongs() {
  const response = await request("songs");
  const songs = await response.json();

  globalSongs = songs;
  return songs;
}

export default function App() {
  const [songs, setSongs] = useState(globalSongs);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const { 0: loggedIn, 2: logoutUser } = useLoggedIn();

  // TODO make getSongs and setSongs into a useSongs hook
  useEffect(() => {
    // Prevent reloading songs between navs
    if (globalSongs.length !== 0) {
      return;
    }

    getSongs().then((songs) => {
      setSongs(songs);
    });
  }, [loggedIn.user]);

  return (
    <div className={styles.app}>
      <Nav link="/queue" name="view queue" />
      <div className={styles.toolbar}>
        <SongSearch setFilteredSongs={setFilteredSongs} songs={songs} />
      </div>
      <div className={styles.statusContainer}>
        <div
          className={classnames(styles.status, {
            [styles.isLoading]: songs.length === 0
          })}
        >
          loading songs…
        </div>
        <div
          className={classnames(styles.status, {
            [styles.hasResults]: songs.length !== 0 && filteredSongs.length !== 0
          })}
        >
          { filteredSongs.length !== 0 && `${filteredSongs.length} results` }
        </div>
      </div>
      <SongList songs={filteredSongs} />
    </div>
  );
}
