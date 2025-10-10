import QueueItem from "components/QueueItem";
import { QueuedTrack } from "lib/types";
import React from "react";

interface Props {
  queueData: QueuedTrack[];
}

function QueueList({ queueData }: Props) {
  const NowSinging = <QueueItem queue={queueData[0]} label="Now Singing" />;

  const UpNext = queueData[1] ? (
    <QueueItem queue={queueData[1]} label="Up Next" />
  ) : null;

  const QueueRest = queueData
    .slice(2)
    .map((queue, index) => (
      <QueueItem label={`#${index + 3}`} key={queue.id} queue={queue} />
    ));

  return (
    <ul className="mb-6 h-full">
      {NowSinging}
      {UpNext}
      {QueueRest}
    </ul>
  );
}

export default QueueList;
