import { useRecoilState } from "recoil";
import useSWR, { SWRConfiguration } from "swr";

import { Song } from "@/lib/types";
import tokenState from "@/store/atoms/tokenState";

import formatTracks from "./formatTracks";
import { fetcher } from "./request";

export default function useSongs(swrOptions: SWRConfiguration = {}) {
  const [token] = useRecoilState(tokenState);

  const { data, ...rest } = useSWR<Song[]>(
    token ? "/songs" : null,
    async (endpoint: string) => {
      const songs = (await fetcher(endpoint)) as Song[];
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
