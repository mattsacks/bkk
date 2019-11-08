import React from "react";
import classNames from "classnames";
import styles from "./styles.scss";
import request from "lib/request";
import SVG from "react-inlinesvg";

const confirmText = "Are you sure you want to skip the current track?"

async function skipTrack() {
  if (confirm(confirmText)) {
    await request("tracks/skip", {
      body: {},
      method: "POST"
    })
  }
}

function BookingControls() {
  return (
    <div className={styles.bookingControls} >
      <button
        className={styles.skipTrackButton}
        onClick={skipTrack}
      >
        <SVG className={styles.skipTrackIcon} src="/step-forward-solid.svg" />
      </button>
    </div>
  );
}

export default BookingControls;
