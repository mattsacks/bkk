import { orderBy } from "lodash";

import { Song } from "./types";

export default function songSearch(query: string, songs: Song[]) {
  // Lowercase the search terms and create an array of each word to match
  // against
  const queryTerms = query.toLowerCase().split(" ");

  function matchSong(song: Song) {
    const songString = `${song.artist} ${song.name}`.toLowerCase();
    return queryTerms.every((term) => songString.includes(term));
  }

  const filteredSongs = songs.filter(matchSong);

  return orderBy(filteredSongs, "artist", "asc");
}
