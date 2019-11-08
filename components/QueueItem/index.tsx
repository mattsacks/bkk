import React from "react";
import classnames from "classnames";
import styles from "./styles.scss";

function QueueItem({ index, queue }) {
  const indexText = index === 1 ? "up next" : index;

  return (
    <div className={styles.queueItem}>
      <span className={styles.index}>{indexText}:</span>
      {queue.song_name} by {queue.artist}
      <span className={styles.user}>({queue.user_name})</span>
    </div>
  )
}

export default QueueItem;
