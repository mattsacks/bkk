// --- Local ---

export const SECONDS_IN_DAY = 86_400;
export const MAX_COOKIE_DAYS = 400;

export const SEARCH_KEY = "mathis_search";
export const USER_COOKIE = "mathis_user";
export const THEME_COOKIE = "bkk_theme";
export const COLOR_SCHEME_COOKIE = "bkk_color_scheme";

export type CookieKeys =
  | typeof USER_COOKIE
  | typeof THEME_COOKIE
  | typeof COLOR_SCHEME_COOKIE;

export type CookieStore = Record<CookieKeys, string>;

export const Themes = ["bkk", "terminal", "rose", "sky"] as const;
export type Theme = (typeof Themes)[number];
export type ColorScheme = "light" | "dark";

// --- API ---

export interface Song {
  artist: string;
  id: number;
  name: string;
  tags: string;
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
