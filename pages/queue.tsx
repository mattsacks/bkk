// View the current queue
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import request from "lib/request";
import useLoggedIn from "lib/useLoggedIn";
import Nav from "components/Nav";
import Queue from "components/Queue";
import styles from "./queue.scss";


function QueuePage() {
  const router = useRouter();
  const [loggedInState] = useLoggedIn();
  const user = loggedInState.user || {};

  if (process.browser && !user.userName) {
    router.push("/");
  }

  return (
    <React.Fragment>
      <Nav showLeaveRoom={false} link="/" name="search songs" />
      { user.userName != undefined && (
        <div className={styles.queue}>
          <h1 className={styles.heading}>{user.bookingKey} queue:</h1>
          <Queue />
        </div>
      )}
    </React.Fragment>
  );
};

export default QueuePage;
