import { QueuedTrack } from "lib/types";
import Link from "next/link";
import React from "react";

interface Props {
  label: string;
  queue: QueuedTrack;
}

function QueueItem({ label, queue }: Props) {
  return (
    <Link href="/queue/[id]" as={`/queue/${queue.id}`}>
      <a>
        <div className="list-item relative -mt-px">
          <div>
            <h4 className="text-sm">
              {label}: {queue.user_name}
            </h4>
            <div className="text-lg leading-tight capitalize">
              {queue.song_name}
            </div>
          </div>
          <div className="w-1/3 text-right">&gt;</div>
        </div>
      </a>
    </Link>
  );
}

export default QueueItem;
