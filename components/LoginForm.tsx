import cntl from "cntl";
import { useRouter } from "next/router";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { useSetRecoilState } from "recoil";
import tokenState from "store/atoms/tokenState";

import Loading from "@/components/Loading";
import usePost from "@/lib/usePost";

const formStyles = cntl`
  flex
  flex-col
  justify-center
  gap-3
  max-w-md
  mx-auto
  pt-6
  px-6
  text-lg
  w-full
  md:flex-2
  md:pt-6
  md:text-xl
`;

interface Response {
  token: string;
}

function LoginForm() {
  const setToken = useSetRecoilState(tokenState);
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
    }
  }, [data, setToken]);

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
    <form className={formStyles} onSubmit={submitForm}>
      <fieldset className="flex flex-col">
        <label className="text-primary" htmlFor="name">
          ur name
        </label>
        <input
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="input"
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
        <label className="text-primary" htmlFor="room">
          room code
        </label>
        <input
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="input"
          defaultValue={router.query.roomCode}
          id="room"
          name="room"
          onChange={onChange}
          placeholder="TAC0"
          required
          ref={roomRef}
          type="text"
        />
      </fieldset>
      <button
        disabled={!isValid || isSubmitting}
        className="submit disabled:submit-disabled mt-2"
        type="submit"
      >
        {isSubmitting ? <Loading /> : "sing songz!"}
      </button>
      {error && (
        <div className="text-center text-lg uppercase tracking-widest text-primary">
          {errorMessage}
        </div>
      )}
    </form>
  );
}

export default LoginForm;
