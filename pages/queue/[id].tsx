import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";

import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
import Nav, { NavItem } from "@/components/Nav";
import request from "@/lib/request";
import { QueuedTrack } from "@/lib/types";
import useDialog from "@/lib/useDialog";
import useQueue from "@/lib/useQueue";

function getLabel(index: number) {
  if (index === 0) {
    return "Now Singing";
  } else if (index === 1) {
    return "Up Next";
  } else {
    return `#${index + 1}`;
  }
}

export default function QueueItemPage() {
  const router = useRouter();
  const id = parseInt(router.query.id as string);

  const { queue, isValidating } = useQueue();

  const queueData = queue.find((item) => item.id === id) ?? ({} as QueuedTrack);
  const index = queue.indexOf(queueData) ?? -1;

  useHotkeys(
    "right",
    () => {
      if (queue.length === 0 || index === undefined) {
        return;
      }

      if (index !== queue.length - 1) {
        router.replace("/queue/[id]", `/queue/${queue[index + 1].id}`);
      }
    },
    [index, queue]
  );

  useHotkeys(
    "left",
    () => {
      if (queue.length === 0 || index === undefined) {
        return;
      }

      if (index !== 0) {
        router.replace("/queue/[id]", `/queue/${queue[index - 1].id}`);
      }
    },
    [index, queue]
  );

  async function removeFromQueue() {
    await request(`/tracks/remove/${queueData.id}`, {
      method: "DELETE"
    });

    queue.splice(index, 1);
    mutate("/playlist", queue);

    router.push("/queue");
  }

  async function moveInQueue(dir: "up" | "down") {
    const to = dir === "up" ? index - 1 : index + 1;

    const newTracks = [...queue];
    newTracks.splice(to, 0, newTracks.splice(index, 1)[0]);
    mutate("/playlist", newTracks, false);

    await request(`/tracks/move/${dir}/${queueData.id}`, {
      method: "POST"
    });
  }

  const skipCurrentSong = useDialog({
    confirm: {
      action: () => moveInQueue("down"),
      text: "sing next"
    }
  });

  const replaceCurrentSong = useDialog({
    confirm: {
      action: () => moveInQueue("up"),
      text: "sing now"
    }
  });

  const removeSong = useDialog({
    confirm: {
      action: () => removeFromQueue(),
      text: "remove song"
    }
  });

  // TODO: Load the queue on the server
  if (typeof window === "undefined" || isValidating) {
    return (
      <div className="app-container flex flex-1 flex-col">
        <Nav>
          <NavItem href="/queue" text="&lt; view queue" />
          <div></div>
        </Nav>
        <Loading />
      </div>
    );
  }

  return (
    <div className="app-container flex flex-1 flex-col">
      <Nav>
        <NavItem href="/queue" text="&lt; view queue" />
        <div></div>
      </Nav>
      <div className="flex-1 text-center">
        <div className="flex items-center">
          <div className="flex-1 text-left">
            {index !== 0 && (
              <Link
                className="block underline"
                href={`/queue/${queue[index - 1]?.id}`}
                replace
              >
                &lt;{" "}
                <span className="hidden sm:inline">{getLabel(index - 1)}</span>
              </Link>
            )}
          </div>
          <h2 className="text-3xl">{getLabel(index)}</h2>
          <div className="flex-1 text-right">
            {index !== queue.length - 1 && (
              <Link
                className="block text-right underline"
                href={`/queue/${queue[index + 1]?.id}`}
                replace
              >
                <span className="hidden sm:inline">{getLabel(index + 1)}</span>{" "}
                &gt;
              </Link>
            )}
          </div>
        </div>
        <div className="text-lg">
          <h4>{queueData.user_name}</h4>
        </div>
        <div className="mt-5">
          <h3 className="mb-1 text-xl capitalize leading-none">
            {queueData.song_name}
          </h3>
          <div>
            <span className="capitalize">{queueData.artist}</span>
          </div>
        </div>
      </div>
      <div className="mb-3 flex justify-between">
        {index === 0 ? (
          <div />
        ) : (
          <button
            className="mr-1 underline"
            onClick={() => {
              if (index === 1) {
                replaceCurrentSong.showDialog();
              } else {
                moveInQueue("up");
              }
            }}
          >
            {index === 1 ? "sing now" : "sing sooner"} (#{index + 1 - 1})
          </button>
        )}
        {index === queue.length - 1 ? (
          <div />
        ) : (
          <button
            className="ml-1 underline"
            onClick={() => {
              if (index === 0) {
                skipCurrentSong.showDialog();
              } else {
                moveInQueue("down");
              }
            }}
          >
            {index === 0 ? "sing next" : "sing later"} (#{index + 2})
          </button>
        )}
      </div>
      <div className="mx-auto mb-3">
        <button
          className="outline-button"
          onClick={async () => removeSong.showDialog()}
        >
          remove from queue
        </button>
      </div>
      <Dialog {...removeSong}>
        <div className="w-56 text-center leading-tight">
          remove song from queue?
        </div>
      </Dialog>
      <Dialog {...skipCurrentSong}>
        <div className="w-56 text-center leading-tight">
          move the current playing song next?
        </div>
      </Dialog>
      <Dialog {...replaceCurrentSong}>
        <div className="w-56 text-center leading-tight">
          sing this song now? this will replace the current song
        </div>
      </Dialog>
    </div>
  );
}
