import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import AppNav from "@/components/AppNav";
import { HeartIcon } from "@/components/Heart";
import { ThemeSettingsSection } from "@/components/ThemeSettingsSection";
import useDialog from "@/lib/useDialog";
import { useToken } from "@/lib/useToken";

const Dialog = dynamic(() => import("@/components/Dialog"), {
  ssr: false
});

export default function Settings() {
  const router = useRouter();
  const [_, setToken] = useToken();

  function leaveRoom() {
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
    <>
      <AppNav />
      <div className="app-container flex flex-1 flex-col gap-6">
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
        <section className="flex flex-col justify-end">
          <button
            className="outline-button mx-auto"
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
    </>
  );
}
