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

    // Animation
    if (!hasSeenAnimation) {
      const ANIMATION_DURATION = 1000;

      anime({
        delay: anime.stagger(ANIMATION_DURATION / 3),
        duration: ANIMATION_DURATION,
        easing: "spring(1, 90, 30, 0)",
        opacity: 1,
        targets: `.${styles.heading} span`,
        translateX: ["-75px", 0]
      });

      hasSeenAnimation = true;
    }
  }, [loggedIn.authed]);

  // Don't render anything for the initial page
  if (!process.browser) {
    return null;
  }

  if (!loggedIn.authed) {
    return (
      <div>
        <h1
          className={classNames(styles.heading, {
            [styles.noAnimation]: hasSeenAnimation
          })}
        >
          <span>Baby</span>
          <span>Ketten</span>
          <span>Karaoke</span>
        </h1>
        <LoginForm loggedIn={loggedIn} onLogin={setLoggedIn} />
      </div>
    );
  }

  return <SongList songs={songs} />;
}

export default Index;
