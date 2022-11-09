import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

import Loading from "@/components/Loading";
import Nav, { NavItem } from "@/components/Nav";
import SongList from "@/components/SongList";
import SongSearch from "@/components/SongSearch";
import songSearch from "@/lib/songSearch";
import { Song } from "@/lib/types";
import useSongs from "@/lib/useSongs";
import searchState from "@/store/atoms/searchState";
import tokenState from "@/store/atoms/tokenState";

let cachedSongs: Song[] = [];

export default function App() {
  const [searchQuery] = useRecoilState(searchState);
  const [token, setToken] = useRecoilState(tokenState);
  const router = useRouter();

  const [filteredSongs, setFilteredSongs] = useState<Song[]>(() => {
    // Initialize filteredSongs with an existing searchQuery on a cached
    // version of songs previously loaded
    if (searchQuery) {
      return songSearch(searchQuery, cachedSongs);
    }

    return [];
  });

  const { songs, isValidating } = useSongs({
    onSuccess: (data) => {
      cachedSongs = data;

      // After songs are loaded, update the filtered list of songs if there's a
      // query
      if (searchQuery) {
        setFilteredSongs(songSearch(searchQuery, data));
      }
    }
  });

  if (!token && router.isReady) {
    router.replace({
      pathname: "/login",
      query: router.query
    });

    return null;
  }

  return (
    <div className="app-container flex flex-1 flex-col w-full">
      <Nav>
        <NavItem href="/settings" text="&lt; settings" />
        <NavItem href="/queue" text="view queue &gt;" />
      </Nav>
      {isValidating ? (
        <>
          <div className="flex-1">
            <Loading />
          </div>
          <button
            className="mx-auto my-8 outline-button"
            onClick={() => setToken(undefined)}
          >
            Leave room
          </button>
        </>
      ) : (
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
            className="mx-auto my-8 outline-button"
            onClick={() => setToken(undefined)}
          >
            Leave room
          </button>
        </>
      )}
    </div>
  );
}
