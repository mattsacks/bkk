// View the current queue
import { useRouter } from "next/router";
import React from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

import AppNav from "@/components/AppNav";
import Loading from "@/components/Loading";
import { QueueActions } from "@/components/QueueActions";
import QueueList from "@/components/QueueList";
import { isServer } from "@/lib/isServer";
import useQueue from "@/lib/useQueue";
import tokenState from "@/store/atoms/tokenState";

export default function QueuePage() {
  const token = useRecoilValue(tokenState);
  const router = useRouter();
  const { queue } = useQueue();
  const hasQueuedTracks = queue && queue.length > 0;

  const { data: user = {}, isLoading } = useSWR(token && "/whoami");

  if (!token && router.isReady) {
    router.replace("/login");
    return null;
  }

  if (isServer || isLoading) {
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
          <h1 className="remove-line-height text-4xl sm:flex-1">
            {user?.bookingKey} queue:
          </h1>
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
