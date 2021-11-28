import Link from "next/link";
import React from "react";
import useSWR, { mutate } from "swr";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import request from "lib/request";
import { WithTokenProps } from "lib/withToken";
import Nav, { NavItem } from "components/Nav";
import Loading from "components/Loading";
import styles from "./styles.module.css";
import formatTracks from "lib/formatTracks";
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

type Props = WithTokenProps;

export default function QueueItemPage({ token }: Props) {
  const router = useRouter();
  const id = parseInt(router.query.id as string);

  const { data: queue } = useSWR(token && id ? "/playlist" : null);

  let queueData = queue?.tracks.find((item) => item.id === id);
  [queueData] = formatTracks([queueData]);
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

  async function moveInQueue(dir: "up" | "down") {
    const to = dir === "up" ? index - 1 : index + 1;

    const newTracks = [...queue.tracks];
    newTracks.splice(to, 0, newTracks.splice(index, 1)[0]);
    mutate("/playlist", { ...queue, tracks: newTracks }, false);

    await request(`/tracks/move/${dir}/${queueData.id}`, {
      method: "POST"
    });
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
        <div className="my-3">
          <h4>{queueData.user_name}</h4>
        </div>
        <div className="my-3">
          <h3 className="text-xl capitalize">{queueData.song_name}</h3>
          <div>
            <span className="capitalize">{queueData.artist}</span>
          </div>
        </div>
      </div>
      <div className="mb-3 flex justify-between">
        {index === 0 ? (
          <div />
        ) : (
          <button className="mr-1 underline" onClick={() => moveInQueue("up")}>
            {index === 1 ? "sing now" : "sing sooner"} (#{index + 1 - 1})
          </button>
        )}
        {index === queue?.tracks.length - 1 ? (
          <div />
        ) : (
          <button
            className="ml-1 underline"
            onClick={() => moveInQueue("down")}
          >
            sing later (#{index + 2})
          </button>
        )}
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
