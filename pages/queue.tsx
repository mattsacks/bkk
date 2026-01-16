// View the current queue
import Link from "next/link";
import React from "react";

import AppNav from "@/components/AppNav";
import Loading from "@/components/Loading";
import { QueueActions } from "@/components/QueueActions";
import QueueItem from "@/components/QueueItem";
import QueueList from "@/components/QueueList";
import useQueue from "@/lib/useQueue";

export default function QueuePage() {
  const { queue, isLoading } = useQueue();

  if (isLoading) {
    return (
      <>
        <AppNav />
        <div className="app-container">
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      <AppNav />
      <div className="app-container gap-gutter-2 flex flex-col">
        <div className="flex flex-col">
          {queue[0] ? (
            <>
              <h1 className="mb-gutter-0.5">Now Singing</h1>
              <QueueItem queue={queue[0]} className="now-playing" />
              <QueueActions />
            </>
          ) : (
            <Link href="/" className="list-item queue-empty-state">
              <div className="list-item-content">
                Add a song to start singing!
              </div>
              <div className="list-item-icon">&gt;</div>
            </Link>
          )}
        </div>
        {queue && queue.length > 1 && (
          <div className="flex flex-col">
            <div className="flex justify-between mb-gutter-0.5">
              <h2>Queue</h2>
            </div>
            <QueueList queueData={queue} />
          </div>
        )}
      </div>
    </>
  );
}
