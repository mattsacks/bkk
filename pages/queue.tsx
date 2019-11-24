// View the current queue
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Song } from "lib/types";
import request from "lib/request";
import useLoggedIn from "lib/useLoggedIn";
import Nav from "components/Nav";
import Queue from "components/Queue";
import styles from "./queue.scss";

async function nextTrack() {
  await request("tracks/skip", {
    method: "POST"
  });
}

// TODO
async function pauseTrack() {
  return null;
}

// TODO
async function playTrack() {
  return null;
}

async function fetchQueue() {
  const response = await request("playlist");
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
  const [loggedInState] = useLoggedIn();
  const user = loggedInState.user || {};

  async function getQueue() {
    const queue = await fetchQueue();
    setQueue(queue);
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
  };

  async function play() {
    setIsPaused(false);
    await playTrack();
  }

  useEffect(() => {
    getQueue();

    // TODO
    //  get current play/pause status from server
    //  update isPaused if currently paused
  }, []);

  if (process.browser && !user.userName) {
    router.push("/");
  }

  return (
    <React.Fragment>
      <Nav showLeaveRoom={false} link="/" name="search songs" />
      <div className={styles.queueButtons}>
        <button className={styles.playPause} onClick={isPaused ? play : pause}>
          { isPaused ? "\u25B6 play" : "\u2758\u2758 pause" }
        </button>
        <button
          className={styles.skipTrack}
          disabled={isSkipping}
          onClick={skipSong}
        >
          { isSkipping ? "skipping…" : "skip current song \u00BB" }
        </button>
      </div>
      {user.userName != undefined && (
        <div className={styles.queue}>
          <h1 className={styles.heading}>{user.bookingKey} queue:</h1>
          <Queue queueData={queueData} />
        </div>
      )}
    </React.Fragment>
  );
}

export default QueuePage;
