import React from "react";
import classnames from "classnames";
import useLoggedIn from "lib/useLoggedIn";
import styles from "./styles.scss";

function QueueItem({ index, queue }) {
  let indexText: string;

  if (index === 0) {
    indexText = "now playing";
  } else if (index === 1) {
    indexText = "up next";
  } else {
    indexText = index;
  }

  const { user } = useLoggedIn()[0];

  return (
    <div
      className={classnames(styles.queueItem, {
        [styles.mySong]: user.userName === queue.user_name
        // James should go to jail for this right here
      })}
    >
      <span className={styles.index}>{indexText}:</span>
      {queue.song_name} by {queue.artist}
      <span className={styles.user}>({queue.user_name})</span>
    </div>
  );
}

export default QueueItem;
