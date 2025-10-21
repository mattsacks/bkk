// View the current queue
import React from "react";
import useSWR from "swr";

import AppNav from "@/components/AppNav";
import Loading from "@/components/Loading";
import { QueueActions } from "@/components/QueueActions";
import QueueList from "@/components/QueueList";
import useQueue from "@/lib/useQueue";
import { useToken } from "@/lib/useToken";

export default function QueuePage() {
  const [token] = useToken();
  const { queue } = useQueue();
  const hasQueuedTracks = queue && queue.length > 0;

  const { data: user = {}, isLoading } = useSWR(token && "/whoami");

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
      <div className="app-container flex flex-col gap-gutter-2">
        <div className="flex flex-col gap-[8px]">
          <h1 className="queue-heading">{user?.bookingKey} queue:</h1>
          <QueueActions />
        </div>
        {hasQueuedTracks ? (
          <React.Fragment>
            <QueueList queueData={queue} />
          </React.Fragment>
        ) : (
          <h4>nothing queued yet!</h4>
        )}
      </div>
    </>
  );
}
