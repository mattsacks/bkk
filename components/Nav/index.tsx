import React from "react";
import Link from "next/link";
import useLoggedIn from "lib/useLoggedIn";
import styles from "./styles.scss";

interface NavProps {
  showLeaveRoom?: boolean;
  link: string;
  name: string;
}

function Nav({ showLeaveRoom = true, link, name }: NavProps) {
  const { 2: logoutUser } = useLoggedIn();

  return (
    <nav className={styles.nav}>
      {showLeaveRoom ? (
        <button className={styles.navItem} onClick={logoutUser}>
          &lt; leave room
        </button>
      ) : (
        <div />
      )}
      <Link href={link}>
        <a className={styles.navItem}>{name} &gt;</a>
      </Link>
    </nav>
  );
}

export default Nav;
