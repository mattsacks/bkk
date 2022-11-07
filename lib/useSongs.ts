import { useRecoilState } from "recoil";
import useSWR from "swr";

import { Song } from "@/lib/types";
import tokenState from "@/store/atoms/tokenState";

import formatTracks from "./formatTracks";
import { fetcher } from "./request";

export default function useSongs() {
  const [token] = useRecoilState(tokenState);

  const { data, ...rest } = useSWR(
    token && "/songs",
    async (endpoint: string) => {
      const songs = (await fetcher(endpoint)) as Song[];
      return formatTracks(songs);
    }
  );

  return {
    ...rest,
    songs: data ?? []
  };
}
