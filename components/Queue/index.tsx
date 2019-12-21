import React from "react";
import QueueItem from "components/QueueItem";
import styles from "./styles.scss";

function Queue({ queueData, loading }) {
  const queueItems = queueData.map((queue, i) => (
    <QueueItem key={queue.id} index={i} queue={queue} />
  ));

  return (
    <div className={styles.queue}>
      { loading ? "loading…" : queueItems }
    </div>
  );
}

export default Queue;
