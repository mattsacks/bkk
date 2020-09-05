// -------------------- Local

export const USER_COOKIE = "mathis_user";

export const SongSearchFilters = {
  ALL: "all",
  ARTIST: "artist",
  SONG: "song"
} as const;

export type SongSearchFilter = typeof SongSearchFilters[keyof typeof SongSearchFilters];

export const THEMES = {
  default: "bkk",
  terminal: "term",
  blue: "nord",
  miami: "miami"
};

// -------------------- API

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

// -------------------- State

export type TokenState = string | null;

export interface UserState {
  name?: string;
}

export interface GlobalState {
  songs: Song[];
  token: TokenState;
  user: UserState;
}
