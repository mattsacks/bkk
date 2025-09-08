// View the current queue
import { useRouter } from "next/router";
import React from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

import Loading from "@/components/Loading";
import Nav, { NavItem } from "@/components/Nav";
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
      <div className="app-container">
        <Nav>
          <NavItem href="/" text="&lt; search songs" />
          <NavItem href="/settings" text="settings &gt;" />
        </Nav>
        <Loading />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Nav>
        <NavItem href="/" text="&lt; search songs" />
        <NavItem href="/settings" text="settings &gt;" />
      </Nav>
      <div className="pb-1">
        {hasQueuedTracks ? (
          <React.Fragment>
            <div className="mb-6 block sm:flex sm:items-center">
              <h1 className="text-3xl sm:flex-1">{user?.bookingKey} queue:</h1>
              <QueueActions />
            </div>
            <QueueList queueData={queue} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="text-3xl sm:flex-1">
              {user?.bookingKey ? `${user?.bookingKey} queue` : ""}:
            </h1>
            <h4>nothing queued yet!</h4>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
