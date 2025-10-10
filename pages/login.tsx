import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

import LoginForm from "@/components/LoginForm";
import { isServer } from "@/lib/isServer";
import tokenState from "@/store/atoms/tokenState";

export default function Login() {
  const router = useRouter();
  const token = useRecoilValue(tokenState);

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

  if (token) {
    router.replace("/");
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="login-heading">
        <h1>baby ketten karaoke</h1>
      </div>
      <LoginForm />
    </div>
  );
}
