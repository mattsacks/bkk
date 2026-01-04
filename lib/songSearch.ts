import { orderBy } from "lodash";

import { SEARCH_KEY,Song } from "./types";

export class SongSearch {
  private static calculateRelevanceScore(
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
  static search(query: string, songs: Song[]): Song[] {
    if (query.trim().length < 2) {
      return [];
    }

    const queryTerms = query.toLowerCase().split(" ");
    const maxResults = 500;

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
   * Adds a query to the store.
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

    queries.unshift(trimmed);

    const maxQueries = 20;

    if (queries.length > maxQueries) {
      queries.length = maxQueries;
    }

    this.queries = queries;
  }

  private static _queries: string[] = [];
  private static _queriesInitialized = false;

  private static _initializeQueries() {
    if (this._queriesInitialized) {
      return;
    }

    // Check if we're in a browser environment with localStorage available
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this._queries = [];
      this._queriesInitialized = true;
      return;
    }

    try {
      const stored = localStorage.getItem(SEARCH_KEY);
      if (!stored) {
        this._queries = [];
      } else {
        const parsed = JSON.parse(stored);
        this._queries = Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      this._queries = [];
    }

    this._queriesInitialized = true;
  }

  /**
   * Gets the user's previous queries.
   */
  static get queries(): string[] {
    this._initializeQueries();
    return this._queries;
  }

  /**
   * Updates the user's previous queries.
   */
  static set queries(queries: string[]) {
    this._queries = queries;
    this._queriesInitialized = true;
    try {
      localStorage.setItem(SEARCH_KEY, JSON.stringify(queries));
    } catch {}
  }

  /**
   * Removes all user's previous queries.
   */
  static clearQueries() {
    this._queries = [];
    this._queriesInitialized = true;
    try {
      localStorage.removeItem(SEARCH_KEY);
    } catch {}
  }
}
