import QueueItem from "components/QueueItem";
import { QueuedTrack } from "lib/types";
import React from "react";

interface Props {
  queueData: QueuedTrack[];
}

function QueueList({ queueData }: Props) {
  // const NowSinging = <QueueItem queue={queueData[0]} label="Now Singing" />;

  const QueueRest = queueData
    .slice(1)
    .map((queue, index) => (
      <li key={queue.id}>
      <QueueItem label={`[${index + 2}]`} queue={queue} />
      </li>
    ));

  return (
    <ul className="mb-6 h-full gap-gutter flex flex-col">
      {QueueRest}
    </ul>
  );
}

export default QueueList;
