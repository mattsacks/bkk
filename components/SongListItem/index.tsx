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

  return (
    <button
      className={classnames(styles.songButton, {
        [styles.addedToQueue]: isAddedToQueue
      })}
      disabled={isAddedToQueue}
      onClick={(e) => {
        addToQueue(song).then((response) => {
          if (response.ok) {
            setIsAddedToQueue(true);

            setTimeout(() => {
              setIsAddedToQueue(false);
            }, 2500);
          } else {
            response.json().then((body) => {
              alert("Could not add track: " + body.error)
            });
          }
        });

      }}
    >
      <div>
        {song.name}
        <span className={styles.songTag}>{song.tags}</span>
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
