import React, { useState } from "react";
import classnames from "classnames";
import request from "lib/request";
import SVG from "react-inlinesvg";
import { Song } from "lib/types";
import styles from "./styles.scss";

async function addToQueue(song: Song) {
  await request("tracks", {
    body: {
      song_id: song.id
    },
    method: "POST"
  });
}

function SongListItem(props: { song: Song }) {
  const { song } = props;
  const [isAddedToQueue, setIsAddedToQueue] = useState(false);

  return (
    <button
      className={styles.songButton}
      disabled={isAddedToQueue}
      onClick={(e) => {
        addToQueue(song);
        setIsAddedToQueue(true);

        setTimeout(() => {
          setIsAddedToQueue(false);
        }, 2500);
      }}
    >
      <div
        className={classnames(styles.song, {
          [styles.isAddedToQueue]: isAddedToQueue
        })}
      >
        {song.name}
      </div>
      {isAddedToQueue ? (
        <div>queued!</div>
      ) : (
        <SVG className={styles.songIcon} src="/right-chevron.svg" />
      )}
    </button>
  );
}

export default SongListItem;
