// View the current queue
import React, { useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import formatTracks from "lib/formatTracks";
import usePost from "lib/usePost";
import withToken from "lib/withToken";
import { TokenState } from "lib/types";
import Nav, { NavItem } from "components/Nav";
import Loading from "components/Loading";
import Queue from "components/Queue";

interface Props {
  token: TokenState;
  setToken: (newToken: TokenState) => void;
}

function QueuePage({ token }: Props) {
  const router = useRouter();
  const { data: queue } = useSWR("/playlist");
  const { data: user } = useSWR("/whoami");

  const { postRequest: skipTrack } = usePost("/tracks/skip");
  const { postRequest: pauseTrack } = usePost("/tracks/pause");
  const { postRequest: playTrack } = usePost("/tracks/play");

  const [isPaused, setIsPaused] = useState(false);
  const hasQueuedTracks = queue && queue.tracks.length > 0;

  const formattedTracks = useMemo(() => {
    if (!queue) {
      return [];
    }

    return formatTracks(queue.tracks);
  }, [queue]);

  useEffect(() => {
    if (hasQueuedTracks && queue.tracks[0].status === "paused" && !isPaused) {
      setIsPaused(true);
    }
  }, [queue]);

  async function skipSong() {
    await skipTrack();
    mutate("/playlist", { tracks: queue.tracks.slice(1) }, false);
  }

  async function pause() {
    setIsPaused(true);
    await pauseTrack();
  }

  async function play() {
    setIsPaused(false);
    await playTrack();
  }

  if (process.browser && !token) {
    router.replace("/");
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
    <div className="app-container mb-8 sm:mb-12">
      <Nav>
        <NavItem href="/" text="&lt; search songs" />
        <div></div>
      </Nav>
      <div className="">
        {hasQueuedTracks ? (
          <React.Fragment>
            <div className="sm:flex block sm:justify-between sm:items-center mb-8">
              <h1 className="text-3xl sm:flex-1">{user?.bookingKey} queue:</h1>
              <div className="flex sm:block justify-between">
                <button
                  className={`sm:mr-6 button button-thin`}
                  onClick={isPaused ? play : pause}
                >
                  {isPaused ? "play" : "pause"}
                </button>
                <button className="button button-thin" onClick={skipSong}>
                  {"skip current song"}
                </button>
              </div>
            </div>
            <Queue queueData={formattedTracks} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="text-3xl sm:flex-1">{user?.bookingKey} queue:</h1>
            <h4 className="sm:-mt-6">nothing queued yet!</h4>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default withToken(QueuePage);
