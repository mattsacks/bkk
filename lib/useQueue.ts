import useSWR from "swr";

import { QueuedTrack } from "@/lib/types";

import { formatArtistName } from "./formatArtistName";
import { fetcher } from "./request";
import { useToken } from "./useToken";

export default function useQueue() {
  const [token] = useToken();

  const { data, ...rest } = useSWR<QueuedTrack[]>(
    token ? "/playlist" : null,
    async (endpoint: string) => {
      const data = await fetcher<{ tracks: QueuedTrack[] }>(endpoint);

      return data.tracks.map(formatArtistName);
    }
  );

  return {
    ...rest,
    queue: data ?? []
  };
}
