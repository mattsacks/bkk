import React from "react";
import classNames from "classnames";
import styles from "./styles.scss";

export default function Layout(props) {
  return (
    <main className={styles.layout}>
      {props.children}
    </main>
  );
}
