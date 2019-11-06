import React, { useEffect, useState } from "react";
import anime from "animejs";
import classNames from "classnames";
import { Song } from "lib/types";
import request from "lib/request";
import useLoggedIn from "lib/useLoggedIn";
import LoginForm from "components/LoginForm";
import SongList from "components/SongList";
import styles from "./index.scss";

let hasSeenAnimation = false;

function Index() {
  const [loggedIn, setLoggedIn] = useLoggedIn();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function getSongs() {
      const response = await request("songs");
      const songs = await response.json();
      setSongs(songs);
    }

    if (loggedIn.authed) {
      getSongs();
    }
  }, [loggedIn.authed]);

  // Don't render anything for the initial page
  if (!process.browser) {
    return null;
  }

  if (!loggedIn.authed) {
    return (
      <div className={styles.container}>
        <h1
          className={classNames(styles.heading, {
            [styles.noAnimation]: !hasSeenAnimation
          })}
        >
            baby ketten karaoke
        </h1>
        <LoginForm loggedIn={loggedIn} onLogin={setLoggedIn} />
      </div>
    );
  }

  return <SongList songs={songs} />;
}

export default Index;
