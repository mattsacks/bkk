interface Track {
  artist: string;
}

// Format "last, first" to "first last" artist
export function formatArtistName<T extends Track>(track: T): T {
  const [last, ...rest] = track.artist.split(", ");
  rest.push(last);
  track.artist = rest.join(" ");

  return track;
}
