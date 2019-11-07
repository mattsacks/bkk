import React, { useMemo, useState } from "react";
import classnames from "classnames";
import SVG from "react-inlinesvg";
import request from "lib/request";
import { Song } from "lib/types";
import styles from "./styles.scss";

async function addToQueue(song: Song) {
  await request("tracks", {
    body: {
      song_id: song.id
    },
    method: "POST"
  });
}

function groupSongsByArtist(songs: Song[]) {
  return songs.reduce((grouped, song: Song) => {
    if (grouped[song.artist] == undefined) {
      grouped[song.artist] = [];
    }

    grouped[song.artist].push(song);

    return grouped;
  }, {});
}

function SongList(props: { songs: Song[] }) {
  const { songs } = props;
  const [addedSongId, setAddedSongId] = useState(null);

  const groupedSongsByArtist = useMemo(() => groupSongsByArtist(songs), [
    songs
  ]);

  const songsByArtist = [];
  for (const artist in groupedSongsByArtist) {
    const songElements = [];

    for (const song of groupedSongsByArtist[artist]) {
      const isAddedSong = song.id === addedSongId;

      songElements.push(
        <button
          className={styles.songButton}
          disabled={isAddedSong}
          key={song.id}
          onClick={(e) => {
            addToQueue(song);
            setAddedSongId(song.id);

            setTimeout(() => {
              setAddedSongId(null);
            }, 5000);
          }}
        >
          <div
            className={classnames(styles.song, {
              [styles.addedToQueue]: isAddedSong
            })}
          >
            {song.name}
          </div>
          {isAddedSong ? <div>queued!</div> : (
            <SVG className={styles.songIcon} src="/right-chevron.svg" />
          )}
        </button>
      );
    }

    songsByArtist.push(
      <div className={styles.artistGroup} key={artist}>
        <div className={styles.artist}>{artist}</div>
        {songElements}
      </div>
    );
  }

  return (
    <div className={styles.songListContainer}>
      <div className={styles.songList}>{songsByArtist}</div>
    </div>
  );
}

export default SongList;
