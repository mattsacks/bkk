import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

import Loading from "@/components/Loading";
import Nav, { NavItem } from "@/components/Nav";
import SongList from "@/components/SongList";
import SongSearch from "@/components/SongSearch";
import { isServer } from "@/lib/isServer";
import songSearch from "@/lib/songSearch";
import { Song } from "@/lib/types";
import useDialog from "@/lib/useDialog";
import useSongs from "@/lib/useSongs";
import searchState from "@/store/atoms/searchState";
import tokenState from "@/store/atoms/tokenState";

const Dialog = dynamic(() => import("@/components/Dialog"), {
  ssr: false
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let cachedSongs: Song[] = [];

function Index() {
  const [searchQuery, setSearchQuery] = useRecoilState(searchState);
  const [token, setToken] = useRecoilState(tokenState);
  const router = useRouter();

  const [filteredSongs, setFilteredSongs] = useState<Song[]>(() => {
    // Initialize filteredSongs with an existing searchQuery on a cached
    // version of songs previously loaded
    return [];
  });

  const { songs, isLoading } = useSongs({
    onSuccess: (data) => {
      cachedSongs = data;

      // After songs are loaded, update the filtered list of songs if there's a
      // query
      if (searchQuery) {
        setFilteredSongs(songSearch(searchQuery, data));
      }
    }
  });

  function leaveRoom() {
    setSearchQuery("");
    setToken(undefined);
  }

  const leaveRoomDialog = useDialog({
    confirm: {
      action: leaveRoom,
      text: "see ya l8r"
    }
  });

  if (!token && router.isReady) {
    router.replace({
      pathname: "/login",
      query: router.query
    });

    return null;
  }

  const showLoading = isLoading || isServer;

  return (
    <div className="app-container flex w-full flex-1 flex-col">
      <Nav>
        <NavItem href="/settings" text="&lt; settings" />
        <NavItem href="/queue" text="view queue &gt;" />
      </Nav>
      {showLoading ? (
        <>
          <div className="flex-1">
            <Loading />
          </div>
          <button
            className="outline-button mx-auto my-8"
            onClick={() => {
              leaveRoomDialog.showDialog();
            }}
            aria-haspopup="dialog"
            aria-controls="leave-room-dialog"
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
              leaveRoomDialog.showDialog();
            }}
            aria-haspopup="dialog"
            aria-controls="leave-room-dialog"
          >
            Leave room
          </button>
          <Dialog
            {...leaveRoomDialog}
            dialogProps={{
              "aria-labelledby": "leave-room-dialog-label",
              id: "leave-room-dialog"
            }}
          >
            <h2 id="leave-room-dialog-label">leave the room?</h2>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default Index;
