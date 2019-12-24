import React, { useState } from "react";
import classnames from "classnames";
import request from "lib/request";
import SVG from "react-inlinesvg";
import { Song } from "lib/types";
import styles from "./styles.scss";

async function addToQueue(song: Song) {
  return request("tracks", {
    body: {
      song_id: song.id
    },
    method: "POST"
  });
}

function SongListItem(props: { song: Song }) {
  const { song } = props;
  const [isAddedToQueue, setIsAddedToQueue] = useState(false);
  const [errorMessage, setError] = useState();

  async function queueSong() {
    const response = await addToQueue(song);

    if (response.ok) {
      setIsAddedToQueue(true);
      setTimeout(() => {
        setIsAddedToQueue(false);
      }, 2500);
    } else {
      const { error } = await response.json();

      // TODO set error and disable all buttons
      setError(`Error: ${error.Code}`);
    }
  }

  return (
    <button
      className={classnames(styles.songButton, {
        [styles.addedToQueue]: isAddedToQueue
      })}
      disabled={isAddedToQueue}
      onClick={queueSong}
    >
      <div>
        {song.name}
        <span className={styles.songTag}>{song.tags}</span>
      </div>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : isAddedToQueue ? (
        <div>queued!</div>
      ) : (
        "+"
      )}
    </button>
  );
}

export default SongListItem;
