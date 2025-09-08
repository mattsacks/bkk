import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { useSetRecoilState } from "recoil";

import { HeartIcon } from "@/components/Heart";
import Nav, { NavItem } from "@/components/Nav";
import ThemeSettingsSection from "@/components/ThemeSettingsSection";
import useDialog from "@/lib/useDialog";
import searchState from "@/store/atoms/searchState";
import tokenState from "@/store/atoms/tokenState";

const Dialog = dynamic(() => import("@/components/Dialog"), {
  ssr: false
});

export default function Settings() {
  const router = useRouter();
  const setSearchQuery = useSetRecoilState(searchState);
  const setToken = useSetRecoilState(tokenState);

  function leaveRoom() {
    setSearchQuery("");
    setToken(undefined);
    router.push("/login");
  }

  const leaveRoomDialog = useDialog({
    confirm: {
      action: leaveRoom,
      text: "see ya l8r"
    }
  });

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
            Made with <HeartIcon className="heart-icon" /> in Portland, Oregon
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
            className="outline-button mx-auto my-8"
            onClick={() => {
              leaveRoomDialog.showDialog();
            }}
            aria-haspopup="dialog"
            aria-controls="leave-room-dialog"
          >
            Leave room
          </button>
          <Dialog
            {...leaveRoomDialog}
            dialogProps={{
              "aria-labelledby": "leave-room-dialog-label",
              id: "leave-room-dialog"
            }}
          >
            <h2 id="leave-room-dialog-label">leave the room?</h2>
          </Dialog>
        </section>
      </div>
    </div>
  );
}
