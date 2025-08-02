import { orderBy } from "lodash";

import { Song } from "./types";

function calculateRelevanceScore(
  searchTerm: string,
  targetString: string
): number {
  const search = searchTerm.toLowerCase();
  const target = targetString.toLowerCase();
  let score = 0;

  // Exact match bonus (highest priority)
  if (target === search) score += 1000;

  // Starts with bonus
  if (target.startsWith(search)) score += 500;

  // Word boundary bonus
  if (target.match(new RegExp(`\\b${search}`, "i"))) score += 300;

  // Length factor (shorter is better for same match)
  if (target.includes(search)) {
    score += 100 - target.length;
  }

  return score;
}

/**
 * Filters all loaded songs by a search query.
 *
 * @param query - A search string to filter songs by.
 * @param songs - An array of songs to filter against.
 * @returns A list of filtered songs sorted by relevance score.
 */
export default function songSearch(query: string, songs: Song[]): Song[] {
  // Don't search very short queries to avoid massive result sets
  if (query.trim().length < 2) {
    return [];
  }

  // Lowercase the search terms and create an array of each word to match
  // against
  const queryTerms = query.toLowerCase().split(" ");
  const maxResults = 500; // Limit results for performance

  const filteredSongs: Song[] = [];

  // Filter with early exit when we hit max results
  for (const song of songs) {
    if (filteredSongs.length >= maxResults) break;

    const songString = `${song.artist} ${song.name}`.toLowerCase();
    if (queryTerms.every((term) => songString.includes(term))) {
      filteredSongs.push(song);
    }
  }

  // Calculate relevance scores and sort by them
  const songsWithScores = filteredSongs.map((song) => {
    const artistScore = calculateRelevanceScore(query, song.artist);
    const nameScore = calculateRelevanceScore(query, song.name);
    return {
      song,
      score: Math.max(artistScore, nameScore) // Use the higher of the two scores
    };
  });

  return orderBy(songsWithScores, "score", "desc").map((item) => item.song);
}
