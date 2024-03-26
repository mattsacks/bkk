import { QueuedTrack } from "lib/types";
import Link from "next/link";
import React from "react";

interface Props {
  label: string;
  queue: QueuedTrack;
}

function QueueItem({ label, queue }: Props) {
  return (
    <Link href={`/queue/${queue.id}`}>
      <div className="list-item relative -mt-px">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm">
            {label}: {queue.user_name}
          </h4>
          <div className="text-lg leading-none capitalize">
            {queue.song_name}
          </div>
        </div>
        <div className="w-1/3 text-right">&gt;</div>
      </div>
    </Link>
  );
}

export default QueueItem;