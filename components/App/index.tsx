import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

import Loading from "@/components/Loading";
import Nav, { NavItem } from "@/components/Nav";
import SongList from "@/components/SongList";
import SongSearch from "@/components/SongSearch";
import { Song } from "@/lib/types";
import useSongs from "@/lib/useSongs";
import tokenState from "@/store/atoms/tokenState";

export default function App() {
  const [token, setToken] = useRecoilState(tokenState);
  const router = useRouter();
  const { songs } = useSongs();

  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

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
            <SongSearch
              onSearch={(filteredSongs) => {
                setFilteredSongs(filteredSongs);
              }}
              songs={songs}
            />
          </div>
          <div className="flex-1">
            <SongList songs={filteredSongs} />
          </div>
          <button
            className="mx-auto mb-3 outline-button"
            onClick={() => setToken(undefined)}
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
            onClick={() => setToken(undefined)}
          >
            Leave room
          </button>
        </>
      )}
    </div>
  );
}
