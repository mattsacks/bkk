import { QueuedTrack } from "lib/types";
import Link from "next/link";
import React from "react";

interface Props {
  label: string;
  queue: QueuedTrack;
}

function QueueItem({ label, queue }: Props) {
  return (
    <li>
      <Link className="list-item" href={`/queue/${queue.id}`}>
        <div className="list-item-content">
          <div className="text-sm">
            {label}: {queue.user_name}
          </div>
          <div className="mt-0.5 text-lg capitalize leading-none sm:max-w-none">
            {queue.song_name}
          </div>
        </div>
        <div className="list-item-icon">&gt;</div>
      </Link>
    </li>
  );
}

export default QueueItem;
