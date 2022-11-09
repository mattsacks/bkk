import { Song } from "./types";

export default function songSearch(query: string, songs: Song[]) {
  const queryTerms = query
    // .replace(/[\d]/g, "") maybe don't do this?
    .toLowerCase()
    .split(" ");

  function matchSong(song: Song) {
    const songString = `${song.artist} ${song.name}`.toLowerCase();
    return queryTerms.every((term) => songString.includes(term));
  }

  return songs.filter(matchSong);
}
