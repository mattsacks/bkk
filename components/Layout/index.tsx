import React from "react";
import classNames from "classnames";
import styles from "./styles.scss";

export default function Layout(props) {
  return (
    <React.Fragment>
      <div className={styles.background} />
      <main className={styles.layout}>
        {props.children}
      </main>
    </React.Fragment>
  );
}
