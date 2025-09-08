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
  const [isShowing, setIsShowing] = useState(false);

  return {
    isShowing,
    showDialog: () => setIsShowing(true),
    cancel: {
      action: () => {
        cancel?.action?.();
        setIsShowing(false);
      },
      text: cancel?.text
    },
    confirm: {
      action: () => {
        confirm.action();
        setIsShowing(false);
      },
      text: confirm.text
    }
  };
}
