import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";

import Loading from "@/components/Loading";
import Nav, { NavItem } from "@/components/Nav";
import SongList from "@/components/SongList";
import SongSearch from "@/components/SongSearch";
import { fetcher } from "@/lib/request";
import { Song } from "@/lib/types";
import tokenState from "@/store/atoms/tokenState";

function formatSongs(songs: Song[]): Song[] {
  return songs.map((song: Song) => {
    const [last, ...rest] = song.artist.split(", ");
    rest.push(last);
    song.artist = rest.join(" ");
    return song;
  });
}

export default function App() {
  const [token, setToken] = useRecoilState(tokenState);
  const router = useRouter();

  const { data: songs } = useSWR(token && "/songs", async (endpoint) => {
    const songs = (await fetcher(endpoint)) as Song[];
    return formatSongs(songs);
  });

  const [filteredSongs, setFilteredSongs] = useState([]);

  if (!token && router.isReady) {
    router.replace({
      pathname: "/login",
      query: router.query
    });
    return null;
  }

  if (!token) {
    return <div className="app-container flex flex-1 flex-col w-full" />;
  }

  return (
    <div className="app-container flex flex-1 flex-col w-full">
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
          <button
            className="mx-auto mb-3 outline-button"
            onClick={() => setToken(null)}
          >
            Leave room
          </button>
        </>
      ) : (
        <>
          <div className="flex-1">
            <Loading />
          </div>
          <button
            className="mx-auto mb-3 outline-button"
            onClick={() => setToken(null)}
          >
            Leave room
          </button>
        </>
      )}
    </div>
  );
}
