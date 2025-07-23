// View the current queue
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import useSWR, { mutate } from "swr";

import Loading from "@/components/Loading";
import Nav, { NavItem } from "@/components/Nav";
import Queue from "@/components/Queue";
import useDialog from "@/lib/useDialog";
import usePost from "@/lib/usePost";
import useQueue from "@/lib/useQueue";
import tokenState from "@/store/atoms/tokenState";

const Dialog = dynamic(() => import("@/components/Dialog"), {
  ssr: false
});

export default function QueuePage() {
  const token = useRecoilValue(tokenState);
  const router = useRouter();
  const { queue } = useQueue();

  const { data: user = {} } = useSWR(token && "/whoami");

  const { postRequest: skipTrack } = usePost("/tracks/skip");
  const { postRequest: pauseTrack } = usePost("/tracks/pause");
  const { postRequest: playTrack } = usePost("/tracks/play");
  const { postRequest: restartTrack } = usePost("/tracks/restart");

  const [isPaused, setIsPaused] = useState(false);
  const hasQueuedTracks = queue && queue.length > 0;

  useEffect(() => {
    if (hasQueuedTracks && queue[0].status === "paused" && !isPaused) {
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

  async function play() {
    setIsPaused(false);
    await playTrack();
  }

  if (!token && router.isReady) {
    router.replace("/login");
    return null;
  }

  if (!queue || !user) {
    return (
      <div className="app-container">
        <Nav>
          <NavItem href="/" text="&lt; search songs" />
          <NavItem href="/settings" text="settings &gt;" />
        </Nav>
        <Loading />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Nav>
        <NavItem href="/" text="&lt; search songs" />
        <NavItem href="/settings" text="settings &gt;" />
      </Nav>
      <div className="pb-1">
        {hasQueuedTracks ? (
          <React.Fragment>
            <div className="mb-6 block sm:flex sm:items-center sm:justify-between">
              <h1 className="text-3xl sm:flex-1">{user?.bookingKey} queue:</h1>
              <div className="mt-2 flex gap-2 sm:ml-4 sm:mt-0">
                <button
                  className={`button button-thin w-16 px-2 py-1`}
                  onClick={isPaused ? play : pause}
                >
                  {isPaused ? "play" : "pause"}
                </button>
                <button
                  className="button button-thin w-16 px-2 py-1"
                  onClick={restartSongDialog.showDialog}
                >
                  {"restart"}
                </button>
                <button
                  className="button button-thin w-16 px-2 py-1"
                  onClick={skipSongDialog.showDialog}
                >
                  {"skip"}
                </button>
              </div>
            </div>
            <Queue queueData={queue} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="text-3xl sm:flex-1">{user?.bookingKey} queue:</h1>
            <h4>nothing queued yet!</h4>
          </React.Fragment>
        )}
      </div>
      <Dialog {...skipSongDialog}>
        <div>skip the current song?</div>
      </Dialog>
      <Dialog {...restartSongDialog}>
        <div>restart the current song?</div>
      </Dialog>
    </div>
  );
}
