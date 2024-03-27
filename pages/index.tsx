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

function Index() {
  const [searchQuery, setSearchQuery] = useRecoilState(searchState);
  const [token, setToken] = useRecoilState(tokenState);
  const router = useRouter();

  const [filteredSongs, setFilteredSongs] = useState<Song[]>(() => {
    // Initialize filteredSongs with an existing searchQuery on a cached
    // version of songs previously loaded
    if (searchQuery && cachedSongs.length > 0) {
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

  const isServer = typeof window === "undefined";
  const isLoading = isValidating || isServer;

  return (
    <div className="app-container flex w-full flex-1 flex-col">
      <Nav>
        <NavItem href="/settings" text="&lt; settings" />
        <NavItem href="/queue" text="view queue &gt;" />
      </Nav>
      {isLoading ? (
        <>
          <div className="flex-1">
            <Loading />
          </div>
          <button
            className="outline-button mx-auto my-8"
            onClick={() => setToken(undefined)}
          >
            Leave room
          </button>
        </>
      ) : (
        <>
          <div className="sticky top-0 z-10 mb-4 bg-secondary">
            <SongSearch
              onSearch={(filteredSongs) => {
                setFilteredSongs(filteredSongs);
              }}
              songs={songs}
            />
          </div>
          <div className="flex-1">
            {searchQuery && <SongList songs={filteredSongs} />}
          </div>
          <button
            className="outline-button mx-auto my-8"
            onClick={() => {
              setSearchQuery("");
              setToken(undefined);
            }}
          >
            Leave room
          </button>
        </>
      )}
    </div>
  );
}

export default Index;
