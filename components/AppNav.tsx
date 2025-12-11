import classNames from "classnames";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { MusicNoteIcon } from "./icons/MusicNoteIcon";
import { SearchIcon } from "./icons/SearchIcon";
import { SettingsIcon } from "./icons/SettingsIcon";

interface AppNavLinkProps
  extends
    LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /**
   * Regex matcher for the active pathname for this link. Overrides direct
   * matching of the href to the current pathname.
   */
  activeMatch?: RegExp;
}

function AppNavLink(props: AppNavLinkProps) {
  const { activeMatch, ...linkProps } = props;

  const router = useRouter();

  const isActive = activeMatch
    ? activeMatch.test(router.pathname)
    : router.pathname === props.href;

  const className = classNames(
    "app-nav-link",
    {
      "active-nav-link": isActive
    },
    props.className
  );

  const spreadProps = Object.assign({}, linkProps, {
    className
  });

  return <Link {...spreadProps} />;
}

export function AppNav() {
  return (
    <nav
      aria-label="baby ketten karaoke navigation"
      className="app-nav"
      data-color-scheme="invert"
    >
      <ul className="app-nav-list">
        <li className="app-nav-item">
          <AppNavLink href="/settings">
            <SettingsIcon
              aria-hidden="true"
              className="app-nav-icon"
              focusable={false}
            />
            <span className="app-nav-label">Settings</span>
          </AppNavLink>
        </li>
        <li className="app-nav-item">
          <AppNavLink href="/">
            <SearchIcon
              aria-hidden="true"
              className="app-nav-icon"
              focusable={false}
            />
            <span className="app-nav-label">Search</span>
          </AppNavLink>
        </li>
        <li className="app-nav-item">
          <AppNavLink activeMatch={/^\/queue/} href="/queue">
            <MusicNoteIcon
              aria-hidden="true"
              className="app-nav-icon"
              focusable={false}
            />
            <span className="app-nav-label">Songs</span>
          </AppNavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
