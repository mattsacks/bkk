import useSWR, { SWRConfiguration } from "swr";

import { Song } from "@/lib/types";

import formatTracks from "./formatTracks";
import { fetcher } from "./request";
import { useToken } from "./useToken";

type SongData = Song[];

export default function useSongs(swrOptions: SWRConfiguration<SongData> = {}) {
  const [token] = useToken();

  const { data, ...rest } = useSWR<SongData>(
    token ? "/songs" : null,
    async (endpoint: string) => {
      const songs = await fetcher<SongData>(endpoint);
      return formatTracks(songs);
    },
    {
      revalidateIfStale: false,
      ...swrOptions
    }
  );

  return {
    ...rest,
    songs: data ?? []
  };
}
