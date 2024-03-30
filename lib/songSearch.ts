import { orderBy } from "lodash";

import { Song } from "./types";

/**
 * Filters all loaded songs by a search query.
 *
 * @param query - A search string to filter songs by.
 * @param songs - An array of songs to filter against.
 * @returns A list of filtered songs sorted by artist in ascending order.
 */
export default function songSearch(query: string, songs: Song[]): Song[] {
  // Lowercase the search terms and create an array of each word to match
  // against
  const queryTerms = query.toLowerCase().split(" ");

  const filteredSongs = songs.filter((song) => {
    const songString = `${song.artist} ${song.name}`.toLowerCase();
    return queryTerms.every((term) => songString.includes(term));
  });

  return orderBy(filteredSongs, "artist", "asc");
}
