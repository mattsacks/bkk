import { useRecoilState } from "recoil";
import useSWR, { SWRConfiguration } from "swr";

import { Song } from "@/lib/types";
import tokenState from "@/store/atoms/tokenState";

import formatTracks from "./formatTracks";
import { fetcher } from "./request";

type SongData = Song[];

export default function useSongs(swrOptions: SWRConfiguration<SongData> = {}) {
  const [token] = useRecoilState(tokenState);

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
