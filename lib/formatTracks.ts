// Formats all "last, first" to "first last" artist keys in a dataset

interface Track {
  artist: string;
}

export default function formatTracks<T extends Track>(tracks: T[]): T[] {
  return tracks.map((track) => {
    const [last, ...rest] = track.artist.split(", ");
    rest.push(last);
    track.artist = rest.join(" ");
    return track;
  });
}
