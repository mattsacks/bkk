import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { withFormik, FormikProps } from "formik";
import styles from "./styles.scss";
import request from "lib/request";

async function skipTrack() {
  await request("tracks/skip", {
    body: {},
    method: "POST"
  });
}

function BookingControls() {
  return (
    <div className={styles.bookingControls} >
      <button
        onClick={() => skipTrack()}
      >
        >>
      </button>
    </div>
  );
}

export default BookingControls;
