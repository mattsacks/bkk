import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { withFormik, FormikProps } from "formik";
import styles from "./styles.scss";
import request from "lib/request";

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
        onClick={() => skipTrack() }
      >
        &#xe044;
      </button>
    </div>
  );
}

export default BookingControls;
