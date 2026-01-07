// --- Local ---

/** Number of seconds in a day. */
export const SECONDS_IN_DAY = 86_400;
/** Maximum number of days a cookie can be stored. */
export const MAX_COOKIE_DAYS = 400;

/** Storage key for user's previous search queries. */
export const PREVIOUS_QUERIES_KEY = "bkk_queries";
/** Storage key for user's active input query. */
export const ACTIVE_SEARCH_KEY = "bkk_active_search";
/** User authentication token. */
export const USER_COOKIE = "mathis_user";
/** User preferred theme token. */
export const THEME_COOKIE = "bkk_theme";
/** User preferred color scheme token. */
export const COLOR_SCHEME_COOKIE = "bkk_color_scheme";

export type CookieKeys =
  | typeof USER_COOKIE
  | typeof THEME_COOKIE
  | typeof COLOR_SCHEME_COOKIE;

export type CookieStore = Record<CookieKeys, string>;

export const Themes = ["bkk", "weird", "terminal", "rose"] as const;
export type Theme = (typeof Themes)[number];
export type ColorScheme = "light" | "dark";

// --- API ---

export interface SongSearchQuery {
  /** The song artist's name, lowercased for text match. */
  artist: string;
  /** The song name, lowercased for text match. */
  name: string;
  /** A query string to match against the song, usually `${artist} ${name}`. */
  query: string;
}

export interface Song {
  artist: string;
  id: number;
  name: string;
  tags: string;
  search: SongSearchQuery;
}

export interface User {
  bookingKey: string;
  userName: string;
}

export interface QueuedTrack {
  artist: string;
  booking_id: number;
  created_at: string; // FIXME: Timestamp
  id: number;
  path: string;
  song_id: number;
  song_name: string;
  status: string;
  tags: string;
  user_name: string;
}
