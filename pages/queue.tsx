// View the current queue
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import useSWR, { mutate } from "swr";

import Loading from "@/components/Loading";
import Nav, { NavItem } from "@/components/Nav";
import Queue from "@/components/Queue";
import usePost from "@/lib/usePost";
import useQueue from "@/lib/useQueue";
import tokenState from "@/store/atoms/tokenState";

export default function QueuePage() {
  const token = useRecoilValue(tokenState);
  const router = useRouter();
  const { queue } = useQueue();
  const { data: user } = useSWR(token && "/whoami");

  const { postRequest: skipTrack } = usePost("/tracks/skip");
  const { postRequest: pauseTrack } = usePost("/tracks/pause");
  const { postRequest: playTrack } = usePost("/tracks/play");

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
          <div></div>
        </Nav>
        <Loading />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Nav>
        <NavItem href="/" text="&lt; search songs" />
        <div></div>
      </Nav>
      <div className="pb-1">
        {hasQueuedTracks ? (
          <React.Fragment>
            <div className="sm:flex block sm:justify-between sm:items-center mb-8">
              <h1 className="text-3xl sm:flex-1 mb-3">
                {user?.bookingKey} queue:
              </h1>
              <div className="xs:flex sm:block justify-between">
                <button
                  className={`mb-2 mr-2 xs:mb-0 sm:mr-6 button button-thin`}
                  onClick={isPaused ? play : pause}
                >
                  {isPaused ? "play" : "pause"}
                </button>
                <button className="button button-thin" onClick={skipSong}>
                  {"skip current song"}
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
    </div>
  );
}
