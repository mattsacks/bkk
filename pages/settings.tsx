import { useRouter } from "next/router";
import React from "react";
import { useSetRecoilState } from "recoil";

import { HeartIcon } from "@/components/Heart";
import Nav, { NavItem } from "@/components/Nav";
import ThemeSettingsSection from "@/components/ThemeSettingsSection";
import searchState from "@/store/atoms/searchState";
import tokenState from "@/store/atoms/tokenState";

import styles from "./settings.module.css";

export default function Settings() {
  const router = useRouter();
  const setSearchQuery = useSetRecoilState(searchState);
  const setToken = useSetRecoilState(tokenState);

  return (
    <div className="app-container flex w-full flex-1 flex-col">
      <Nav>
        <NavItem href="/queue" text="&lt; view queue" />
        <NavItem href="/" text="search songs &gt;" />
      </Nav>
      <div className="flex flex-1 flex-col gap-6">
        <ThemeSettingsSection />
        <section className="flex flex-1 flex-col justify-end text-center text-sm">
          <p>
            Made with <HeartIcon className={styles["heart-icon"]} /> in
            Portland, Oregon
          </p>
          <p>
            Code available on{" "}
            <a
              className="underline"
              href="https://github.com/mattsacks/bkk"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
        </section>
        <section className="mb-8 flex flex-col justify-end">
          <button
            className="outline-button mx-auto"
            onClick={() => {
              setSearchQuery("");
              setToken(undefined);

              router.push("/login");
            }}
          >
            Leave room
          </button>
        </section>
      </div>
    </div>
  );
}
