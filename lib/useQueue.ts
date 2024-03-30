import { useRecoilState } from "recoil";
import useSWR from "swr";

import { QueuedTrack } from "@/lib/types";
import tokenState from "@/store/atoms/tokenState";

import formatTracks from "./formatTracks";
import { fetcher } from "./request";

export default function useQueue() {
  const [token] = useRecoilState(tokenState);

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
