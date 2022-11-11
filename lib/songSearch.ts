import { orderBy } from "lodash";
import { Song } from "./types";

export default function songSearch(query: string, songs: Song[]) {
  const queryTerms = query.toLowerCase().split(" ");

  function matchSong(song: Song) {
    const songString = `${song.artist} ${song.name}`.toLowerCase();
    return queryTerms.every((term) => songString.includes(term));
  }

  const filteredSongs = songs.filter(matchSong);

  return orderBy(filteredSongs, "artist", "asc");
}
