import {
  ComponentPropsWithoutRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef
} from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  dialogProps?: ComponentPropsWithoutRef<"dialog">;
  children: ReactNode;
  isShowing?: boolean;
  confirm?: {
    action: () => void;
    text?: string;
  };
  cancel?: {
    action: () => void;
    text?: string;
  };
}

export default function Dialog(props: DialogProps) {
  const { children, dialogProps, isShowing, confirm, cancel } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = useCallback(() => {
    dialogRef.current?.close();
    document.body.classList.remove("overflow-hidden");
  }, []);

  function handleCancel() {
    cancel?.action();
    handleClose();
  }

  function handleConfirm() {
    confirm?.action();
    handleClose();
  }

  // When the 'show' prop changes, toggle show & hide on the dialog and body
  // scrolling
  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }

    const isOpen = dialogRef.current?.open;

    if (isShowing && !isOpen) {
      dialogRef.current.show();
      document.body.classList.add("overflow-hidden");
    }
  }, [isShowing]);

  // If the browser doesn't support inert, hide the element
  useEffect(() => {
    const supportsInert = "inert" in document.createElement("div");

    if (supportsInert || !dialogRef.current) {
      return;
    }

    if (!isShowing) {
      dialogRef.current.classList.add("hidden");
    } else {
      dialogRef.current.classList.remove("hidden");
    }
  }, [isShowing]);

  return createPortal(
    <dialog
      {...{
        ...dialogProps,
        inert: !isShowing ? true : undefined
      }}
      ref={dialogRef}
    >
      {children}
      <div className="align-center mt-4 flex gap-4">
        <button className="outline-button" onClick={handleCancel} type="button">
          {cancel?.text ?? "nvm"}
        </button>
        <button className="button" onClick={handleConfirm} type="button">
          {confirm?.text ?? "confirm"}
        </button>
      </div>
    </dialog>,
    document.body
  );
}
