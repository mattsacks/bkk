import React from "react";
import Link from "next/link";
import useLoggedIn from "lib/useLoggedIn";
import styles from "./styles.scss";

interface NavProps {
  link: string,
  name: string
};

function Nav({ link, name}: NavProps) {
  const { 2: logoutUser } = useLoggedIn();

  return (
    <nav className={styles.nav}>
      <button className={styles.navItem} onClick={logoutUser}>
        &lt; leave room
      </button>
      <Link href={link}>
        <a className={styles.navItem}>{name} &gt;</a>
      </Link>
    </nav>
  );
}

export default Nav;
