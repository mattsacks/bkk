// --- Local ---

export const USER_COOKIE = "mathis_user";
export const SEARCH_KEY = "mathis_search";

export const THEMES = {
  default: "bkk",
  terminal: "term",
  blue: "nord",
  miami: "miami"
};

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
