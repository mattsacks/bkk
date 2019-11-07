import React, { useMemo } from "react";
import { Song } from "lib/types";
import SongListItem from "components/SongListItem";
import styles from "./styles.scss";

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

  const groupedSongsByArtist = useMemo(() => groupSongsByArtist(songs), [
    songs
  ]);

  const songsByArtist = [];
  for (const artist in groupedSongsByArtist) {
    const songElements = [];

    for (const song of groupedSongsByArtist[artist]) {
      songElements.push(
        <SongListItem key={song.id} song={song} />
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
