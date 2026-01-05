import { orderBy } from "lodash";

import { ACTIVE_SEARCH_KEY, PREVIOUS_QUERIES_KEY, Song } from "./types";

export class SongSearch {
  private static _queries: string[] = [];
  private static _activeQuery = "";

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
        const storedActive = sessionStorage.getItem(ACTIVE_SEARCH_KEY);
        this._activeQuery = storedActive ?? "";
      } catch {
        this._activeQuery = "";
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
   * Gets the user's active input query.
   */
  static get activeQuery(): string {
    return this._activeQuery;
  }

  /**
   * Updates the user's active input query.
   */
  static set activeQuery(query: string) {
    this._activeQuery = query;

    try {
      sessionStorage.setItem(ACTIVE_SEARCH_KEY, query);
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Clears the user's active input query.
   */
  static clearActiveQuery() {
    this._activeQuery = "";
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
    const maxResults = 150;

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
      const artistScore = this.calculateRelevanceScore(query, song.artist);
      const nameScore = this.calculateRelevanceScore(query, song.name);

      const score = Math.max(artistScore, nameScore);

      return {
        score,
        song
      };
    });

    return orderBy(songsWithScores, "score", "desc").map((item) => item.song);
  }

  /**
   * Calculates a relevance score for a search term against a target string.
   * Higher scores indicate better matches based on exact matches, prefix
   * matches, word boundaries, and string length.
   *
   * @param searchTerm - The search query to match against
   * @param targetString - The target string (e.g., artist name or song title)
   * to score
   * @returns A numeric score where higher values indicate better relevance
   */
  private static calculateRelevanceScore(
    searchTerm: string,
    targetString: string
  ): number {
    const search = searchTerm.toLowerCase();
    const target = targetString.toLowerCase();
    let score = 0;

    // Exact match bonus (highest priority)
    if (target === search) score += 1000;

    // Bonus for starts with
    if (target.startsWith(search)) score += 500;

    // Bonus for discrete words
    if (target.match(new RegExp(`\\b${search}`, "i"))) score += 300;

    // Length factor (shorter is better for same match)
    if (target.includes(search)) {
      score += 100 - target.length;
    }

    return score;
  }
}
