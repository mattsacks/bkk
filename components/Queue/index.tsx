import React, { useEffect, useState } from "react";
import request from "lib/request";
import QueueItem from "components/QueueItem";
import styles from "./styles.scss";

async function getQueue() {
  const response = await request("playlist");
  const queue = await response.json();

  return queue.tracks;
}

function Queue() {
  const [queueData, setQueue] = useState([]);

  useEffect(() => {
    getQueue().then((queue) => {
      setQueue(queue);
    });
  }, []);

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
