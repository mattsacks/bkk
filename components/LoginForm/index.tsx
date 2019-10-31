import React from "react";
import classNames from "classnames";
import { withFormik, FormikProps } from "formik";
import styles from "./styles.scss";
import { LoginRequest } from "lib/useLoggedIn";

interface LoginFormValues {
  name: string;
  room: string;
}

interface LoginFormProps {
  onLogin: LoginRequest;
}

function LoginForm(props: LoginFormProps & FormikProps<LoginFormValues>) {
  const {
    errors,
    handleChange,
    handleSubmit,
    isValid,
    onLogin,
    values
  } = props;

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <input
        autoComplete="off"
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
        disabled={!isValid}
        onClick={() => handleSubmit}
        type="submit"
      >
        sing songz!
      </button>
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
