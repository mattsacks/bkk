import React, { useState } from "react";
import useSWR from "swr";
import { fetcher } from "lib/request";
import {
  TokenState,
  Song
} from "lib/types";
import Nav, { NavItem } from "components/Nav";
import SongList from "components/SongList";
import Loading from "components/Loading";
import SongSearch from "components/SongSearch";
import styles from "./styles.module.css";

function formatSongs(songs: Song[]): Song[] {
  return songs.map((song: Song) => {
    const [last, ...rest] = song.artist.split(", ");
    rest.push(last);
    song.artist = rest.join(" ");
    return song;
  });
}

interface Props {
  setToken: (newToken: TokenState) => void;
}

export default function App({ setToken }: Props) {
  const { data: songs } = useSWR("/songs", async (endpoint) => {
    const songs = (await fetcher(endpoint)) as Song[];
    return formatSongs(songs);
  });

  const [filteredSongs, setFilteredSongs] = useState([]);

  return (
    <div className="app-container flex flex-1 flex-col h-full w-full">
      <Nav>
        <NavItem href="/settings" text="&lt; settings" />
        <NavItem href="/queue" text="view queue &gt;" />
      </Nav>
      {songs ? (
        <>
          <div className="mb-4 relative">
            <SongSearch setFilteredSongs={setFilteredSongs} songs={songs} />
          </div>
          <div className="flex-1">
            <SongList songs={filteredSongs} />
          </div>
          <button className={styles.leaveButton} onClick={() => setToken(null)}>
            Leave room
          </button>
        </>
      ) : (
        <>
          <div className="flex-1">
            <Loading />
          </div>
          <button className={styles.leaveButton} onClick={() => setToken(null)}>
            Leave room
          </button>
        </>
      )}
    </div>
  );
}
