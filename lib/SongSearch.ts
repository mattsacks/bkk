import { orderBy } from "lodash";

import { ACTIVE_SEARCH_KEY, PREVIOUS_QUERIES_KEY, Song } from "./types";

export class SongSearch {
  private static _queries: string[] = [];
  private static _currentQuery = "";

  static {
    // Initialize from sessionStorage if available
    if (
      typeof window !== "undefined" &&
      typeof sessionStorage !== "undefined"
    ) {
      try {
        const storedQueries = sessionStorage.getItem(PREVIOUS_QUERIES_KEY);

        if (storedQueries) {
          const parsed = JSON.parse(storedQueries);
          this._queries = Array.isArray(parsed) ? parsed : [];
        }
      } catch {
        this._queries = [];
      }

      try {
        const storedCurrent = sessionStorage.getItem(ACTIVE_SEARCH_KEY);
        this._currentQuery = storedCurrent ?? "";
      } catch {
        this._currentQuery = "";
      }
    }
  }

  /**
   * Adds a query to the previous query history.
   */
  static addQuery(query: string) {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    const queries = this.queries;

    if (queries[0] === trimmed) {
      return;
    }

    // Remove existing entry if found
    const filteredQueries = queries.filter((q) => q !== trimmed);

    // Add the new query to the front
    filteredQueries.unshift(trimmed);

    const maxQueries = 20;

    if (filteredQueries.length > maxQueries) {
      filteredQueries.length = maxQueries;
    }

    this.queries = filteredQueries;
  }

  /**
   * Gets the user's previous queries.
   */
  static get queries(): string[] {
    return this._queries;
  }

  /**
   * Updates the user's previous queries.
   */
  static set queries(queries: string[]) {
    this._queries = queries;
    try {
      sessionStorage.setItem(PREVIOUS_QUERIES_KEY, JSON.stringify(queries));
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Removes all user's previous queries.
   */
  static clearQueries() {
    this._queries = [];
    try {
      sessionStorage.removeItem(PREVIOUS_QUERIES_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Gets the user's current input query.
   */
  static get currentQuery(): string {
    return this._currentQuery;
  }

  /**
   * Updates the user's current input query.
   */
  static set currentQuery(query: string) {
    this._currentQuery = query;

    try {
      sessionStorage.setItem(ACTIVE_SEARCH_KEY, query);
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Clears the user's current input query.
   */
  static clearCurrentQuery() {
    this._currentQuery = "";
    try {
      sessionStorage.removeItem(ACTIVE_SEARCH_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Filters all loaded songs by a search query.
   *
   * @param query - A search string to filter songs by.
   * @param songs - An array of songs to filter against.
   * @returns A list of filtered songs sorted by relevance score.
   */
  static search(query: string, songs: Song[]): Song[] {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return [];
    }

    const queryTerms = trimmedQuery.toLowerCase().split(" ");
    const MAX_RESULTS = 500;

    const filteredSongs: Song[] = [];

    // Filter matching songs with early exit at MAX_RESULTS
    for (const song of songs) {
      if (filteredSongs.length >= MAX_RESULTS) {
        break;
      }

      // Use pre-computed search query
      const songString = song.search.query;

      if (queryTerms.every((term) => songString.includes(term))) {
        filteredSongs.push(song);
      }
    }

    const searchLower = trimmedQuery.toLowerCase();
    const wordBoundaryRegex = new RegExp(`\\b${searchLower}`, "i");

    // Calculate relevance scores and sort by them
    const songsWithScores = filteredSongs.map((song) => {
      const artistScore = this.calculateRelevanceScore(
        searchLower,
        song.search.artist,
        wordBoundaryRegex
      );

      const nameScore = this.calculateRelevanceScore(
        searchLower,
        song.search.name,
        wordBoundaryRegex
      );

      const score = Math.max(artistScore, nameScore);

      return {
        score,
        song
      };
    });

    const ordered = orderBy(songsWithScores, "score", "desc").map(
      (item) => item.song
    );

    return ordered;
  }

  /**
   * Calculates a relevance score for a search term against a target string.
   * Higher scores indicate better matches based on exact matches, prefix
   * matches, word boundaries, and string length.
   *
   * @param searchLower - Pre-computed lowercase search query
   * @param targetLower - Pre-computed lowercase target string
   * @param wordBoundaryRegex - Pre-compiled regex for word boundary matching
   * @returns A numeric score where higher values indicate better relevance
   */
  private static calculateRelevanceScore(
    searchLower: string,
    targetLower: string,
    wordBoundaryRegex: RegExp
  ): number {
    let score = 0;

    // Exact match bonus (highest priority)
    if (targetLower === searchLower) {
      score += 1000;
      return score; // Early exit - no need to check further
    }

    // Bonus for starts with
    if (targetLower.startsWith(searchLower)) {
      score += 500;
      return score; // Early exit - word boundary regex won't add value
    }

    // Bonus for discrete words - use pre-compiled regex
    if (targetLower.match(wordBoundaryRegex)) {
      score += 300;
    }

    // Length factor (shorter is better for same match)
    if (targetLower.includes(searchLower)) {
      score += 100 - targetLower.length;
    }

    return score;
  }
}
