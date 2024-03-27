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
      <div className="relative -mt-px list-item">
        <div className="mr-6 flex flex-col">
          <div className="text-sm">
            {label}: {queue.user_name}
          </div>
          {/* TODO: Use text-balance instead of max-width when supported in Safari. */}
          <div className="max-w-[20ch] text-lg capitalize leading-none sm:mt-0.5 sm:max-w-none">
            {queue.song_name}
          </div>
        </div>
        <div className="text-right">&gt;</div>
      </div>
    </Link>
  );
}

export default QueueItem;
