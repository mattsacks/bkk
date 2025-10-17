import { useEffect } from "react";

import LoginForm from "@/components/LoginForm";
import { isServer } from "@/lib/isServer";

export default function Login() {
  // Adds data-page="login" to the document body for styling
  useEffect(() => {
    if (isServer) {
      return;
    }

    document.documentElement.dataset.page = "login";

    return () => {
      delete document.documentElement.dataset.page;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="login-heading">
        <h1>baby ketten karaoke</h1>
      </div>
      <LoginForm />
    </div>
  );
}
