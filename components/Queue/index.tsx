import React from "react";
import QueueItem from "components/QueueItem";
import { QueuedTrack } from "lib/types";

interface Props {
  queueData: QueuedTrack[];
}

function Queue({ queueData }: Props) {
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
    <div className="h-full mb-6">
      {NowSinging}
      {UpNext}
      {QueueRest}
    </div>
  );
}

export default Queue;
