import { Song } from "lib/types";
import { createGlobal } from "lib/useGlobalState";

const withSongs = createGlobal<Song[]>("songs");
export default withSongs;
