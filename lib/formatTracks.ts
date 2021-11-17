// Formats all "last, first" to "first last" artist keys in a dataset

export default function formatTracks(tracks: any[]): any[] {
  return tracks.map((track) => {
    if (!track) return;

    const [last, ...rest] = track.artist.split(", ");
    rest.push(last);
    track.artist = rest.join(" ");
    return track;
  });
}
