import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { withFormik, FormikProps } from "formik";
import styles from "./styles.scss";
import { LoginRequest } from "lib/useLoggedIn";

interface LoginFormValues {
  name: string;
  room: string;
}

interface LoginFormProps {
  loggedIn: any;
  onLogin: LoginRequest;
}

function LoginForm(props: LoginFormProps & FormikProps<LoginFormValues>) {
  const {
    errors,
    handleChange,
    handleSubmit,
    loggedIn,
    isValid,
    onLogin,
    values
  } = props;

  const [isLoggingIn, setLoggingInState] = useState(loggedIn.authed);

  const submitForm = useCallback(
    (e) => {
      e.preventDefault();
      setLoggingInState(true);
      handleSubmit();
    },
    [loggedIn.authed]
  );

  useEffect(() => {
    if (loggedIn.authed && isLoggingIn) {
      setLoggingInState(false);
    } else if (loggedIn.status && isLoggingIn) {
      setLoggingInState(false);
    }
  }, [loggedIn]);

  return (
    <form className={styles.loginForm} onSubmit={submitForm}>
      <input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        name="name"
        className={styles.input}
        onChange={handleChange}
        placeholder="ur name"
        required
        type="text"
        value={values.name}
      />
      <input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        name="room"
        className={styles.input}
        onChange={handleChange}
        placeholder="bkk code"
        required
        type="text"
        value={values.room}
      />
      <button
        className={classNames(styles.input, styles.submit)}
        disabled={!isValid || isLoggingIn}
        type="submit"
      >
        {isLoggingIn ? "loading…" : "sing songz!"}
      </button>
      {loggedIn.status && (
        <div className={styles.statusText}>{loggedIn.status}</div>
      )}
    </form>
  );
}

const loginFormLogic = withFormik<LoginFormProps, LoginFormValues>({
  displayName: "LoginForm",
  handleSubmit(values, formikBag) {
    const { onLogin } = formikBag.props;

    onLogin(values.name, values.room);
  },
  validate(values: LoginFormValues) {
    const errors: {
      name?: string;
      room?: string;
    } = {};

    if (!values.name) {
      errors.name = "enter ur name";
    }

    if (!values.room) {
      errors.room = "enter da code!";
    }

    return errors;
  },
  validateOnBlur: false
});

export default loginFormLogic(LoginForm);
