import cntl from "cntl";
import request from "lib/request";
import { QueuedTrack, Song } from "lib/types";
import usePost from "lib/usePost";
import React, { useCallback, useEffect, useState } from "react";
import { mutate } from "swr";

const songListItemClassName = cntl`
  border-2
  border-primary
  ease-out
  items-center
  justify-between
  relative
  w-full
`;

const addToQueueButtonClassName = cntl`
  border-primary
  border-t-2
  disabled:opacity-50
  duration-300
  py-1
  shrink-0
  text-center
  text-sm
  transition-opacity
  w-full
  md:text-md
`;

let buttonAnimationTimeout: number;

interface SongListItemProps {
  queuedTrack: QueuedTrack | undefined;
  song: Song;
}

function SongListItem(props: SongListItemProps) {
  const { queuedTrack, song } = props;
  const { postRequest } = usePost("/tracks", {
    song_id: song.id
  });

  const [songWasAdded, setSongWasAdded] = useState(false);
  const [songWasRemoved, setSongWasRemoved] = useState(false);

  let buttonText: string;
  if (songWasRemoved) {
    buttonText = "removed!";
  } else if (songWasAdded) {
    buttonText = `added! `;
  } else {
    buttonText = queuedTrack ? "- remove from queue" : "+ add to queue";
  }

  const setButtonTimeout = useCallback((setter: (set: boolean) => void) => {
    setter(true);

    buttonAnimationTimeout = window.setTimeout(() => {
      setter(false);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(buttonAnimationTimeout);
    };
  }, []);

  return (
    <div className={songListItemClassName}>
      <div className="p-3 text-left capitalize">
        <h4 className="mb-0.5 text-balance text-lg leading-none md:mb-0 md:text-xl">
          {song.name}
        </h4>
        <h3 className="text-sm">{song.artist}</h3>
      </div>
      <button
        className={addToQueueButtonClassName}
        disabled={songWasAdded || songWasRemoved}
        onClick={async () => {
          if (queuedTrack) {
            // Remove song from queue
            await request(`/tracks/remove/${queuedTrack.id}`, {
              method: "DELETE"
            });
            mutate("/playlist");
            setButtonTimeout(setSongWasRemoved);
          } else {
            // Add song to queue
            await postRequest();
            mutate("/playlist");
            setButtonTimeout(setSongWasAdded);
          }
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default SongListItem;
