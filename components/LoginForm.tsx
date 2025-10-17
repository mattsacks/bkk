import { useRouter } from "next/router";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import Loading from "@/components/Loading";
import usePost from "@/lib/usePost";
import { useToken } from "@/lib/useToken";

interface Response {
  token: string;
}

function LoginForm() {
  const [_, setToken] = useToken();
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const roomRef = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState(false);

  const { data, error, postRequest, isSubmitting } =
    usePost<Response>("/user/signin");

  const submitForm = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      postRequest({
        name: nameRef.current?.value,
        session_key: roomRef.current?.value
      });
    },
    [postRequest]
  );

  useEffect(() => {
    if (data) {
      setToken(data.token);
      router.push("/");
    }
  }, [data, router, setToken]);

  let errorMessage = error;
  if (error === "Bad Request") {
    errorMessage = "Invalid Room Code";
  }

  const onChange = useCallback(() => {
    if (nameRef.current?.value && roomRef.current?.value) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, []);

  return (
    <form className="app-container login-form" onSubmit={submitForm}>
      <fieldset className="flex flex-col">
        <label className="text-accent" htmlFor="name">
          ur name
        </label>
        <input
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="outlined-input input"
          id="name"
          name="name"
          onChange={onChange}
          placeholder="jaybee"
          ref={nameRef}
          required
          type="text"
        />
      </fieldset>
      <fieldset className="flex flex-col">
        <label className="text-accent" htmlFor="room">
          room code
        </label>
        <input
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="outlined-input input"
          defaultValue={router.query.roomCode}
          id="room"
          name="room"
          onChange={onChange}
          placeholder="pardee"
          required
          ref={roomRef}
          type="text"
        />
      </fieldset>
      <button
        disabled={!isValid || isSubmitting}
        className="submit primary-action mt-2"
        type="submit"
      >
        {isSubmitting ? <Loading /> : "sing songz!"}
      </button>
      {error && (
        <div className="text-accent text-center text-lg uppercase tracking-widest">
          {errorMessage}
        </div>
      )}
    </form>
  );
}

export default LoginForm;
