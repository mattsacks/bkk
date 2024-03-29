import { useRouter } from "next/router";
import React from "react";
import { useSetRecoilState } from "recoil";

import Nav, { NavItem } from "@/components/Nav";
import ThemeSettingsSection from "@/components/ThemeSettingsSection";
import searchState from "@/store/atoms/searchState";
import tokenState from "@/store/atoms/tokenState";

interface SettingsSectionProps extends React.PropsWithChildren {
  heading: React.ReactNode;
}

function SettingsSection(props: SettingsSectionProps) {
  const { children, heading } = props;

  return (
    <section>
      {typeof heading === "string" ? (
        <div className="mb-1">{heading}:</div>
      ) : (
        heading
      )}
      {children}
    </section>
  );
}

export default function Settings() {
  const router = useRouter();
  const setSearchQuery = useSetRecoilState(searchState);
  const setToken = useSetRecoilState(tokenState);

  return (
    <div className="app-container">
      <Nav>
        <NavItem href="/queue" text="&lt; view queue" />
        <NavItem href="/" text="search songs &gt;" />
      </Nav>
      <div className="flex flex-col gap-6">
        <ThemeSettingsSection />
        <SettingsSection heading="About">
          <p className="leading-tight">
            Code for bkk.bar is available on{" "}
            <a
              className="underline"
              href="https://github.com/mattsacks/bkk"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
        </SettingsSection>
        <SettingsSection heading="Session">
          <button
            className="outline-button"
            onClick={() => {
              setSearchQuery("");
              setToken(undefined);

              router.push("/login");
            }}
          >
            Leave room
          </button>
        </SettingsSection>
      </div>
    </div>
  );
}
