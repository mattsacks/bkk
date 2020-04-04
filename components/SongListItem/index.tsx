import React, { useEffect, useState } from "react";
import { mutate } from "swr";
import usePost from "lib/usePost";
import { Song } from "lib/types";
import styles from "./styles.module.css";

function SongListItem(props: { song: Song }) {
  const { song } = props;
  const { postRequest, isSubmitting } = usePost("/tracks", {
    song_id: song.id
  });

  const [wasAdded, setWasAdded] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      setWasAdded(true);

      setTimeout(() => {
        setWasAdded(false);
      }, 3000);
    }
  }, [isSubmitting]);

  return (
    <div className="relative">
      <button
        className={`list-item -mt-px relative w-full disabled:opacity-50 ${styles.submitTransition}`}
        disabled={isSubmitting || wasAdded}
        onClick={(e) => {
          e.preventDefault();
          postRequest();
          mutate("/playlist");
        }}
      >
        <div className="text-left capitalize">
          <h4 className="text-lg md:text-xl ">{song.name}</h4>
          <h3 className="text-sm">
            {song.artist} [{song.tags.replace(/[()]/g, "")}]
          </h3>
          <h3 className="text-sm hidden">[{song.tags.replace(/[()]/g, "")}]</h3>
        </div>
        <span className={`pl-3 md:text-xl ${wasAdded ? "opacity-0" : ""}`}>
          +
        </span>
      </button>
    </div>
  );
}

export default SongListItem;
