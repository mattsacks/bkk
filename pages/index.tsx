import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";

import AppNav from "@/components/AppNav";
import Loading from "@/components/Loading";
import SongList from "@/components/SongList";
import SongSearch from "@/components/SongSearch";
import { isServer } from "@/lib/isServer";
import songSearch from "@/lib/songSearch";
import { Song } from "@/lib/types";
import useDialog from "@/lib/useDialog";
import useSongs from "@/lib/useSongs";
import tokenState from "@/store/atoms/tokenState";

const Dialog = dynamic(() => import("@/components/Dialog"), {
  ssr: false
});

function Index() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const [token, setToken] = useRecoilState(tokenState);
  const router = useRouter();

  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  const { songs, isLoading } = useSongs();

  // Cached so debounced handler can persist between updates
  const onSearch = useCallback(
    (query?: string) => {
      setSearchQuery(query);

      if (typeof query === "string") {
        setFilteredSongs(songSearch(query, songs));
      } else {
        setFilteredSongs([]);
      }
    },
    [songs]
  );

  function leaveRoom() {
    setToken(undefined);
  }

  const leaveRoomDialog = useDialog({
    confirm: {
      action: leaveRoom,
      text: "see ya l8r"
    }
  });

  if (typeof window !== "undefined" && !token && router.isReady) {
    router.replace({
      pathname: "/login",
      query: router.query
    });

    return null;
  }

  const showLoading = isLoading || isServer;

  return (
    <>
      <AppNav />
      {showLoading ? (
        <>
          <div className="app-container flex flex-1 flex-col gap-gutter">
            <Loading className="flex-1" />
            <button
              className="outline-button mx-auto"
              onClick={() => {
                leaveRoomDialog.showDialog();
              }}
              aria-haspopup="dialog"
              aria-controls="leave-room-dialog"
            >
              Leave room
            </button>
          </div>
        </>
      ) : (
        <div className="app-container flex flex-1 flex-col items-center gap-gutter">
          <div className="bg-background sticky top-0 z-10 w-full">
            <SongSearch onSearch={onSearch} />
          </div>
          <div className="mt-gutter w-full flex-1">
            {searchQuery && <SongList songs={filteredSongs} />}
          </div>
          {!searchQuery && (
            <button
              className="outline-button mx-auto"
              onClick={() => {
                leaveRoomDialog.showDialog();
              }}
              aria-haspopup="dialog"
              aria-controls="leave-room-dialog"
            >
              Leave room
            </button>
          )}
          <Dialog
            {...leaveRoomDialog}
            dialogProps={{
              "aria-labelledby": "leave-room-dialog-label",
              id: "leave-room-dialog"
            }}
          >
            <h2 id="leave-room-dialog-label">leave the room?</h2>
          </Dialog>
        </div>
      )}
    </>
  );
}

export default Index;
