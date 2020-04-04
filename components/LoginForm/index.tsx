import React, { useCallback, useEffect, useRef, useState } from "react";
import usePost from "lib/usePost";
import Loading from "components/Loading";
import styles from "./styles.module.css";

interface Response {
  token: string;
}

interface Props {
  setToken: (TokenState) => void;
}

function LoginForm({ setToken }: Props) {
  const nameRef = useRef(null);
  const roomRef = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data, error, postRequest, isSubmitting } = usePost<Response>(
    "/user/signin"
  );

  const submitForm = useCallback((e) => {
    e.preventDefault();
    postRequest({
      name: nameRef.current.value,
      session_key: roomRef.current.value
    });
  }, []);

  useEffect(() => {
    if (data) {
      setToken(data.token);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error === "Bad Request" ? "Invalid Room Code" : error);
    }
  }, [error]);

  const onChange = useCallback(() => {
    // Clear the error message
    setErrorMessage("");

    if (nameRef.current.value && roomRef.current.value) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, []);

  return (
    <form className={styles.form} onSubmit={submitForm}>
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
      <label className="text-primary" htmlFor="room">
        room code
      </label>
      <input
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        className="input"
        id="room"
        name="room"
        onChange={onChange}
        placeholder="TAC0"
        required
        ref={roomRef}
        type="text"
      />
      <button
        disabled={!isValid || isSubmitting}
        className="submit disabled:submit-disabled mt-3 mb-3"
        type="submit"
      >
        {isSubmitting ? <Loading /> : "sing songz!"}
      </button>
      {error && (
        <div className="text-center text-primary text-lg tracking-widest uppercase">
          {errorMessage}
        </div>
      )}
    </form>
  );
}

export default LoginForm;
