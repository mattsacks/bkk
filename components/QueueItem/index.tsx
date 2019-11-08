import React from "react";
import styles from "./styles.scss";

function QueueItem({ index, queue }) {
  const indexText = index === 1 ? "up next" : index;

  return (
    <div className={styles.queueItem}>
      <span className={styles.index}>{indexText}:</span>
      {queue.song_name} by {queue.artist}
    </div>
  )
}

export default QueueItem;
