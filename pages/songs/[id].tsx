import { useRouter } from "next/router";
import React from "react";

import useSongs from "@/lib/useSongs";

export default function SongPage() {
  const router = useRouter();
  const { songs } = useSongs();

  const song = songs.find((song) => song.id === Number(router.query.id));

  if (!song) {
    return null;
  }

  return <div>{song.name}</div>;
}
