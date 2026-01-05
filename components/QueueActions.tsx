// View the current queue
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { mutate } from "swr";

import { PauseIcon } from "@/components/icons/PauseIcon";
import { PlayIcon } from "@/components/icons/PlayIcon";
import { RepeatIcon } from "@/components/icons/RepeatIcon";
import { SkipIcon } from "@/components/icons/SkipIcon";
import useDialog from "@/lib/useDialog";
import usePost from "@/lib/usePost";
import useQueue from "@/lib/useQueue";

const Dialog = dynamic(() => import("@/components/Dialog"), {
  ssr: false
});

export function QueueActions() {
  const [isPaused, setIsPaused] = useState(false);
  const { queue } = useQueue();

  const { postRequest: skipTrack } = usePost("/tracks/skip");
  const { postRequest: pauseTrack } = usePost("/tracks/pause");
  const { postRequest: playTrack } = usePost("/tracks/play");
  const { postRequest: restartTrack } = usePost("/tracks/restart");

  const hasQueuedTracks = queue && queue.length > 0;

  useEffect(() => {
    if (hasQueuedTracks && queue[0].status === "paused" && !isPaused) {
      // Sync local isPaused state with server-fetched queue status
      // after SSR hydration
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPaused(true);
    }
  }, [hasQueuedTracks, queue, isPaused]);

  async function skipSong() {
    await skipTrack();
    mutate("/playlist", queue.slice(1), false);
  }

  const skipSongDialog = useDialog({
    confirm: {
      action: skipSong,
      text: "skip song"
    }
  });

  async function restart() {
    setIsPaused(false);
    await restartTrack();
  }

  const restartSongDialog = useDialog({
    confirm: {
      action: restart,
      text: "restart song"
    }
  });

  async function pause() {
    setIsPaused(true);
    await pauseTrack();
  }

  const pauseSongDialog = useDialog({
    confirm: {
      action: pause,
      text: "pause song"
    }
  });

  async function play() {
    setIsPaused(false);
    await playTrack();
  }

  return (
    <>
      <ul className="queue-actions flex gap-3">
        <li>
          <button
            type="button"
            className="action"
            onClick={() => {
              restartSongDialog.showDialog();
            }}
            data-with-icon
            aria-labelledby="queue-restart-action"
            aria-haspopup="dialog"
            aria-controls="restart-song-dialog"
          >
            <RepeatIcon className="action-icon" />
            <span className="action-label" id="queue-restart-action">
              restart
            </span>
          </button>
        </li>
        <li>
          {isPaused ? (
            <button
              type="button"
              className="action"
              onClick={() => {
                play();
              }}
              aria-labelledby="queue-play-action"
              data-with-icon
            >
              <PlayIcon className="action-icon" />
              <span className="action-label" id="queue-play-action">
                play
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="action"
              onClick={() => {
                pauseSongDialog.showDialog();
              }}
              aria-labelledby="queue-pause-action"
              data-with-icon
              aria-haspopup="dialog"
              aria-controls="pause-room-dialog"
            >
              <PauseIcon className="action-icon" />
              <span className="action-label" id="queue-action">
                pause
              </span>
            </button>
          )}
        </li>
        <li>
          <button
            aria-controls="skip-song-dialog"
            aria-haspopup="dialog"
            aria-labelledby="queue-skip-action"
            data-with-icon
            type="button"
            className="action"
            onClick={() => {
              skipSongDialog.showDialog();
            }}
          >
            <SkipIcon className="action-icon" />
            <span className="action-label" id="queue-skip-action">
              skip
            </span>
          </button>
        </li>
      </ul>
      <Dialog
        {...restartSongDialog}
        dialogProps={{
          "aria-labelledby": "restart-song-dialog-label",
          id: "restart-song-dialog"
        }}
      >
        <h2 id="restart-song-dialog-label">restart the current song?</h2>
      </Dialog>
      <Dialog
        {...pauseSongDialog}
        dialogProps={{
          "aria-labelledby": "pause-room-dialog-label",
          id: "pause-room-dialog"
        }}
      >
        <h2 id="pause-room-dialog-label">pause the room?</h2>
      </Dialog>
      <Dialog
        {...skipSongDialog}
        dialogProps={{
          "aria-labelledby": "skip-song-dialog-label",
          id: "skip-song-dialog"
        }}
      >
        <h2 id="skip-song-dialog-label">skip the current song?</h2>
      </Dialog>
    </>
  );
}
