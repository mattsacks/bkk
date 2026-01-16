import classNames from "classnames";
import { QueuedTrack } from "lib/types";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
  label?: string;
  queue: QueuedTrack;
}

function QueueItem({ label, queue, className }: Props) {
  return (
    <Link className={classNames("list-item", className)} href={`/queue/${queue.id}`}>
      <div className="list-item-content">
        <div className="text-sm">
          {label && (
            <span>{label} </span>
          )}
          {queue.user_name}
        </div>
        <div className="mt-0.5 text-lg capitalize leading-none sm:max-w-none">
          {queue.song_name}
        </div>
      </div>
      <div className="list-item-icon">&gt;</div>
    </Link>
  );
}

export default QueueItem;
