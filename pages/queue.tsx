// View the current queue
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Song, User } from "lib/types";
import request from "lib/request";
import useLoggedIn from "lib/useLoggedIn";
import Nav from "components/Nav";
import Queue from "components/Queue";
import styles from "./queue.scss";

const emptyUser = {
  bookingKey: undefined,
  userName: undefined
};

async function whoAmI(): Promise<User> {
  const response = await request("whoami");

  if (response.ok) {
    return await response.json();
  } else {
    return emptyUser;
  }
}

async function nextTrack() {
  await request("tracks/skip", {
    method: "POST"
  });
}

async function pauseTrack() {
  await request("tracks/pause", {
    method: "POST"
  });
}

async function playTrack() {
  await request("tracks/play", {
    method: "POST"
  });
}

async function fetchQueue() {
  const response = await request("playlist");

  if (!response.ok) {
    return [];
  }

  const queue = await response.json();

  // FIXME use this until backend fixes artist names
  const formattedTracks = queue.tracks.map((song: Song) => {
    const [last, ...rest] = song.artist.split(", ");
    rest.push(last);
    song.artist = rest.join(" ");
    return song;
  });

  return formattedTracks;
}

function QueuePage() {
  const router = useRouter();
  const [queueData, setQueue] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const { 0: loggedInState, 3: setLoggedIn } = useLoggedIn();
  const { token } = loggedInState;

  // FIXME these get defined on every render
  async function getQueue() {
    setIsLoadingQueue(true);
    const queue = await fetchQueue();
    setQueue(queue);

    if (queue[0] && queue[0].status === "paused") {
      setIsPaused(true);
    }

    setIsLoadingQueue(false);
  }

  async function skipSong() {
    setIsSkipping(true);
    await nextTrack();
    await getQueue();
    setIsSkipping(false);
  }

  async function pause() {
    setIsPaused(true);
    await pauseTrack();
  }

  async function play() {
    setIsPaused(false);
    await playTrack();
  }

  async function getUser() {
    const user = await whoAmI();
    setLoggedIn({
      ...loggedInState,
      user: {
        bookingKey: user.bookingKey,
        username: user.userName
      }
    });
  }

  useEffect(() => {
    getQueue();
    getUser();
  }, []);

  if (process.browser && !token) {
    router.push("/");
  }

  return (
    <React.Fragment>
      <Nav showLeaveRoom={false} link="/" name="search songs" />
      <div className={styles.queue}>
        <div className={styles.queueButtons}>
          {!isLoadingQueue && (
            <React.Fragment>
              <button
                className={styles.playPause}
                onClick={isPaused ? play : pause}
              >
                {isPaused ? "play" : "pause"}
              </button>
              <button
                className={styles.skipTrack}
                disabled={isSkipping}
                onClick={skipSong}
              >
                {isSkipping ? "skipping…" : "skip current song"}
              </button>
            </React.Fragment>
          )}
        </div>
        <h1 className={styles.heading}>
          {loggedInState.user?.bookingKey} queue:
        </h1>
        <Queue queueData={queueData} loading={isLoadingQueue} />
      </div>
    </React.Fragment>
  );
}

export default QueuePage;
