import React from "react";
import Link from "next/link";
import { QueuedTrack } from "lib/types";

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
          <div>&gt;</div>
        </div>
      </a>
    </Link>
  );
}

export default QueueItem;
