import Link from "next/link";
import React from "react";
import useSWR, { mutate } from "swr";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import request from "lib/request";
import Nav, { NavItem } from "components/Nav";
import Loading from "components/Loading";
import styles from "./styles.module.css";
/* import GeniusAnnotations from "components/GeniusAnnotations"; */

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

  const { data: queue } = useSWR(id ? "/playlist" : null);

  const queueData = queue?.tracks.find((item) => item.id === id);
  const index = queue?.tracks.indexOf(queueData);

  useHotkeys(
    "right",
    () => {
      if (!queue?.tracks || index === undefined) {
        return;
      }

      if (index !== queue.tracks.length - 1) {
        router.replace("/queue/[id]", `/queue/${queue.tracks[index + 1].id}`);
      }
    },
    [index, queue?.tracks]
  );

  useHotkeys(
    "left",
    () => {
      if (!queue?.tracks || index === undefined) {
        return;
      }

      if (index !== 0) {
        router.replace("/queue/[id]", `/queue/${queue.tracks[index - 1].id}`);
      }
    },
    [index, queue?.tracks]
  );

  async function removeFromQueue() {
    await request(`/tracks/remove/${queueData.id}`, {
      method: "DELETE"
    });

    queue.tracks.splice(index, 1);
    mutate("/playlist", queue);

    router.push("/queue");
  }

  if (!queue) {
    return (
      <div className="app-container flex flex-col flex-1">
        <Nav>
          <NavItem href="/queue" text="&lt; view queue" />
          <div></div>
        </Nav>
        <Loading />
      </div>
    );
  }

  if (!queueData) {
    // TODO: Show an error message instead about the missing queue id
    router.push("/queue");
  }

  return (
    <div className="app-container flex flex-col flex-1">
      <Nav>
        <NavItem href="/queue" text="&lt; view queue" />
        <div></div>
      </Nav>
      <div className="text-center flex-1">
        <div className="flex items-center">
          <div className={`${styles.queueNavLink} text-left`}>
            {index !== 0 && (
              <Link
                href="/queue/[id]"
                as={`/queue/${queue.tracks[index - 1].id}`}
                replace
              >
                <a className="underline">
                  &lt;{" "}
                  <span className="hidden sm:inline">
                    {getLabel(index - 1)}
                  </span>
                </a>
              </Link>
            )}
          </div>
          <h2 className="text-3xl flex-2">{getLabel(index)}</h2>
          <div className={`${styles.queueNavLink} text-right`}>
            {index !== queue.tracks.length - 1 && (
              <Link
                href="/queue/[id]"
                as={`/queue/${queue.tracks[index + 1].id}`}
                replace
              >
                <a className="underline flex-1 text-right">
                  <span className="hidden sm:inline">
                    {getLabel(index + 1)}
                  </span>{" "}
                  &gt;
                </a>
              </Link>
            )}
          </div>
        </div>
        <div className="mb-6">
          <h4>{queueData.user_name}</h4>
          <h3 className="text-xl capitalize">{queueData.song_name}</h3>
        </div>
        <div className="mb-6">
          <h3 className="">
            Song by <span className="capitalize">{queueData.artist}</span>
          </h3>
          <h3 className="">Karaoke by {queueData.tags.replace(/[()]/g, "")}</h3>
        </div>
      </div>
      <div className="mb-3 mx-auto">
        <button
          className="button"
          onClick={async () => {
            removeFromQueue();
          }}
        >
          remove <span className="underline">{queueData.song_name}</span> from
          queue
        </button>
      </div>
    </div>
  );
}
