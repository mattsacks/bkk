// Creates props for easy interfacing with the <Dialog> component

import { useState } from "react";

interface UseDialogOptions {
  cancel?: {
    action?: () => void;
    text?: string;
  };
  confirm: {
    action: () => void;
    text?: string;
  };
}

export default function useDialog(params: UseDialogOptions) {
  const { cancel, confirm } = params;
  const [showDialog, setShowDialog] = useState(false);

  return {
    show: showDialog,
    setShow: () => setShowDialog(true),
    cancel: {
      action: () => {
        cancel?.action?.();
        setShowDialog(false);
      },
      text: cancel?.text
    },
    confirm: {
      action: () => {
        confirm.action();
        setShowDialog(false);
      },
      text: confirm.text
    }
  };
}
