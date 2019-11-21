// View the current queue
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import request from "lib/request";
import SVG from "react-inlinesvg";
import useLoggedIn from "lib/useLoggedIn";
import Nav from "components/Nav";
import Queue from "components/Queue";
import styles from "./queue.scss";

async function nextTrack() {
  await request("tracks/skip", {
    method: "POST"
  });
}

async function fetchQueue() {
  const response = await request("playlist");
  const queue = await response.json();

  // FIXME use this until backend fixes artist names
  const formattedTracks = queue.tracks.map((song) => {
    const [last, ...rest] = song.artist.split(", ");
    song.artist = [...rest, last].join(" ");
    return song;
  });


  return formattedTracks;
}

function QueuePage() {
  const router = useRouter();
  const [queueData, setQueue] = useState([]);
  const [loggedInState] = useLoggedIn();
  const user = loggedInState.user || {};

  useEffect(() => {
    getQueue();
  }, []);

  if (process.browser && !user.userName) {
    router.push("/");
  }

  async function getQueue() {
    const queue = await fetchQueue();
    setQueue(queue);
  }

  async function skipSong() {
    await nextTrack();
    await getQueue();
  }

  return (
    <React.Fragment>
      <Nav showLeaveRoom={false} link="/" name="search songs" />
      <div className={styles.queueButtons}>
        <div />
        <button onClick={skipSong} className={styles.skipTrack}>
          skip current song >>
        </button>
      </div>
      { user.userName != undefined && (
        <div className={styles.queue}>
          <h1 className={styles.heading}>{user.bookingKey} queue:</h1>
          <Queue queueData={queueData} />
        </div>
      )}
    </React.Fragment>
  );
};

export default QueuePage;
