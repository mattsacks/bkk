// View the current queue
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import request from "lib/request";
import useLoggedIn from "lib/useLoggedIn";
import Nav from "components/Nav";
import Queue from "components/Queue";
import styles from "./queue.scss";

async function whoAmI() {
  const response = await request("whoami");
  const data = await response.json();

  return data;
}


function QueuePage() {
  const router = useRouter();
  const [loggedIn] = useLoggedIn();
  const [user, setUser] = useState({
    bookingKey: undefined,
    userName: undefined
  });

  if (process.browser && !loggedIn.authed) {
    router.push("/");
  }

  useEffect(() => {
    whoAmI().then((user) => {
      setUser(user);
    });
  }, [loggedIn.authed]);

  return (
    <React.Fragment>
      <Nav link="/" name="search songs" />
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
