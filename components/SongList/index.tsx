import React, { useCallback, useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import Fuse from "fuse.js";
import { debounce } from "lodash";
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

function Songs(props: { songs: Song[] }) {
  const { songs } = props;
  const [filteredSongs, setFilteredSongs] = useState([]);

  return (
    <div className={styles.container}>
      <SongSearch setFilteredSongs={setFilteredSongs} songs={songs} />
      <SongSearchResults songs={filteredSongs} />
    </div>
  );
}

const SongSearch = React.memo(
  function SongSearch(props: {
    setFilteredSongs: (songs: Song[]) => void;
    songs: Song[];
  }) {
    const { setFilteredSongs, songs } = props;

    const fuseOptions = {
      distance: 100,
      keys: [{ name: "artist", weight: 0.7 }, { name: "name", weight: 0.3 }],
      location: 0,
      maxPatternLength: 32,
      minMatchCharLength: 3,
      shouldSort: true,
      threshold: 0.2
    };

    const fuse = new Fuse(songs, fuseOptions);

    function searchSongs(query) {
      const searchResults = fuse.search(query);
      setFilteredSongs(searchResults);
    }

    const debouncedSearchSongs = debounce(searchSongs, 250);

    return (
      <input
        className={styles.searchSongs}
        onChange={(e) => {
          e.persist();
          debouncedSearchSongs(e.target.value);
        }}
        type="text"
        placeholder="search songz"
      />
    );
  },
  (prevProps, nextProps) => prevProps.songs === nextProps.songs
);

function SongSearchResults(props: { songs: Song[] }) {
  const { songs } = props;

  // Group songs by artist
  const groupedByArtist = songs.reduce((grouped, song: Song) => {
    if (grouped[song.artist] == undefined) {
      grouped[song.artist] = [];
    }

    grouped[song.artist].push(song);

    return grouped;
  }, {});

  const songsByArtist = [];
  for (const artist in groupedByArtist) {
    const songElements = [];

    for (const song of groupedByArtist[artist]) {
      songElements.push(
        <button
          className={styles.songButton}
          key={song.id}
          onClick={() => addToQueue(song)}
        >
          <div className={styles.song}>{song.name}</div>
          <SVG className={styles.songIcon} src="/right-chevron.svg" />
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

export default Songs;
