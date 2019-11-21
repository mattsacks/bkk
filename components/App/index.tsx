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

  // FIXME use this until backend fixes artist names
  const formattedSongs = songs.map((song) => {
    const [last, ...rest] = song.artist.split(", ");
    song.artist = [...rest, last].join(" ");
    return song;
  });

  globalSongs = formattedSongs;
  return formattedSongs;
}

export default function App() {
  const [songs, setSongs] = useState(globalSongs);
  const [searchStatus, setSearchStatus] = useState(null);
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
        <SongSearch
          setFilteredSongs={setFilteredSongs}
          setSearchStatus={setSearchStatus}
          songs={songs}
        />
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
            [styles.searchStatus]: Boolean(searchStatus)
          })}
        >
          {searchStatus}
        </div>
      </div>
      <SongList songs={filteredSongs} />
    </div>
  );
}
