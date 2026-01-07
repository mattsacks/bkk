import { Song } from "./types";

export function computeSongSearch(song: Song): Song {
  // Pre-compute search string for performance
  try {
    song.search = {
      artist: song.artist.toLowerCase(),
      name: song.name.toLowerCase(),
      query: `${song.artist.toLowerCase()} ${song.name.toLowerCase()}`
    };
  } catch (e) {
    console.error(`Could not pre-compute search query for song: ${song.name}`, e);
  }

  return song;
}
