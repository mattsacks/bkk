import React, { useEffect, useState } from "react";
import request from "lib/request";
import QueueItem from "components/QueueItem";
import styles from "./styles.scss";

function Queue({ queueData }) {
  const queueItems = queueData.map((queue, i) => (
    <QueueItem key={queue.id} index={i + 1} queue={queue} />
  ));

  return (
    <div className={styles.queue}>
      { queueData.length === 0 ? "loading…" : queueItems}
    </div>
  );
}

export default Queue;
