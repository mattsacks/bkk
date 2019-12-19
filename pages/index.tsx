import React from "react";
import classnames from "classnames";
import useLoggedIn from "lib/useLoggedIn";
import LoginForm from "components/LoginForm";
import App from "components/App";
import styles from "./index.scss";

function Index() {
  const [loggedIn, setLoggedIn] = useLoggedIn();

  // Don't render anything for the initial page
  if (!process.browser) {
    return null;
  }

  // TODO this should be on a separate page
  if (!loggedIn.token) {
    return (
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1
            className={classnames(styles.bkk)}
          >
            baby ketten karaoke
          </h1>
          <div className={styles.version}>v0.0.1 alpha alpaca</div>
        </div>
        <LoginForm loggedIn={loggedIn} onLogin={setLoggedIn} />
      </div>
    );
  }

  return <App />;
}

export default Index;
