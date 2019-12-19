import React, { useEffect, useState } from "react";
import classnames from "classnames";
import useLoggedIn from "lib/useLoggedIn";
import request from "lib/request";
import { Song } from "lib/types";
import Nav from "components/Nav";
import SearchFilters, {
  SongSearchFilter,
  SongSearchFilters
} from "components/SearchFilters";
import SongList from "components/SongList";
import SongSearch from "components/SongSearch";
import styles from "./styles.scss";

let globalSongs = [];

async function getSongs() {
  const response = await request("songs");
  const songs = await response.json();

  // FIXME use this until backend fixes artist names
  const formattedSongs = songs.map((song: Song) => {
    const [last, ...rest] = song.artist.split(", ");
    rest.push(last);
    song.artist = rest.join(" ");
    return song;
  });

  globalSongs = formattedSongs;
  return formattedSongs;
}

export default function App() {
  const [songs, setSongs] = useState(globalSongs);
  const [searchStatus, setSearchStatus] = useState(null);
  const [searchFilter, setSearchFilter] = useState<SongSearchFilter>(
    SongSearchFilters.ALL
  );
  const [filteredSongs, setFilteredSongs] = useState([]);
  const { 0: loggedIn } = useLoggedIn();

  // TODO make getSongs and setSongs into a useSongs hook
  useEffect(() => {
    // Prevent reloading songs between navs
    if (globalSongs.length !== 0) {
      return;
    }

    getSongs().then((songs) => {
      setSongs(songs);
    });
  }, [loggedIn.token]);

  return (
    <div className={styles.app}>
      <Nav link="/queue" name="view queue" />
      <div className={styles.toolbar}>
        <SongSearch
          activeSearchFilter={searchFilter}
          setFilteredSongs={setFilteredSongs}
          setSearchStatus={setSearchStatus}
          songs={songs}
        />
      </div>
      <div className={styles.searchInfo}>
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
        <SearchFilters
          activeSearchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
      </div>
      <SongList songs={filteredSongs} />
    </div>
  );
}
