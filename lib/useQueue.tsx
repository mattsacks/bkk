import useSWR from "swr";
import { QueuedTrack } from "lib/types";
import { fetcher } from "lib/request";

export async function fetchQueue(url: string): Promise<QueuedTrack[]> {
  const data = (await fetcher(url)) as { tracks: QueuedTrack[] };

  // FIXME use this until backend fixes artist names
  const formattedTracks = data.tracks.map((track: QueuedTrack) => {
    const [last, ...rest] = track.artist.split(", ");
    rest.push(last);
    track.artist = rest.join(" ");
    return track;
  });

  return formattedTracks;
}

export default function useQueue(ready = true) {
  return useSWR(ready ? "/playlist" : null, fetchQueue);
}
