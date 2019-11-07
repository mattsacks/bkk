import React, { useCallback, useMemo, useState } from "react";
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
  const [addedSongIds, setAddedSongIds] = useState([]);

  const groupedSongsByArtist = useMemo(() => groupSongsByArtist(songs), [
    songs
  ]);

  const onSongClick = useCallback(
    (song) => {
      return (e) => {
        addToQueue(song);
        setAddedSongIds((prevAddedSongIds) => [...prevAddedSongIds, song.id]);

        // Remove the song from list of added songs after a timeout
        setTimeout(() => {
          setAddedSongIds((prevAddedSongIds) => {
            return prevAddedSongIds.filter((songId) => songId !== song.id);
          });
        }, 2500);
      };
    },
    [songs]
  );

  const songsByArtist = [];
  for (const artist in groupedSongsByArtist) {
    const songElements = [];

    for (const song of groupedSongsByArtist[artist]) {
      const isAddedSong = addedSongIds.includes(song.id);

      // FIXME don't re-create all of these buttons on each render 😓
      songElements.push(
        <button
          className={styles.songButton}
          disabled={isAddedSong}
          key={song.id}
          onClick={onSongClick(song)}
        >
          <div
            className={classnames(styles.song, {
              [styles.addedToQueue]: isAddedSong
            })}
          >
            {song.name}
          </div>
          {isAddedSong ? (
            <div>queued!</div>
          ) : (
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
