import React from "react";
import classNames from "classnames";
import styles from "./styles.scss";

export default function Layout(props) {
  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.background}></div>
      <main className={styles.layout}>
        {props.children}
      </main>
    </div>
  );
}
