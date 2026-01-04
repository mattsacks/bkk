import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import AppNav from "@/components/AppNav";
import Loading from "@/components/Loading";
import SongList from "@/components/SongList";
import { SongSearchForm } from "@/components/SongSearchForm";
import { SongSearch } from "@/lib/SongSearch";
import useDialog from "@/lib/useDialog";
import useSongs from "@/lib/useSongs";
import { useToken } from "@/lib/useToken";

const Dialog = dynamic(() => import("@/components/Dialog"), {
  ssr: false
});

function Index() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const [_, setToken] = useToken();
  const router = useRouter();

  const { songs, isLoading } = useSongs();

  // Load previous query from storage
  useEffect(() => {
    const prevQuery = SongSearch.queries[0];

    if (prevQuery) {
      setSearchQuery(prevQuery);
    }
  }, []);

  // Derive filtered songs from search query and songs
  const filteredSongs = useMemo(() => {
    if (typeof searchQuery === "string" && searchQuery) {
      return SongSearch.search(searchQuery, songs);
    }
    return [];
  }, [searchQuery, songs]);

  // Cached so debounced handler can persist between updates
  const onSearch = useCallback((query?: string) => {
    setSearchQuery(query);

    if (query) {
      SongSearch.addQuery(query);
    }
  }, []);

  function leaveRoom() {
    setToken(undefined);
    router.push("/login");
  }

  const leaveRoomDialog = useDialog({
    confirm: {
      action: leaveRoom,
      text: "see ya l8r"
    }
  });

  const showLoading = isLoading;

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
            <SongSearchForm onSearch={onSearch} searchQuery={searchQuery} />
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
