import useSWR from "swr";

import { QueuedTrack } from "@/lib/types";

import formatTracks from "./formatTracks";
import { fetcher } from "./request";
import { useToken } from "./useToken";

export default function useQueue() {
  const [token] = useToken();

  const { data, ...rest } = useSWR<QueuedTrack[]>(
    token ? "/playlist" : null,
    async (endpoint: string) => {
      const data = await fetcher<{ tracks: QueuedTrack[] }>(endpoint);

      return formatTracks(data.tracks);
    }
  );

  return {
    ...rest,
    queue: data ?? []
  };
}
