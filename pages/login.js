import styles from "../components/Form.module.css";
import { useState, useContext } from "react";
import { AppContext } from "../context/app-context";
import { useRouter } from "next/router";
import Link from "next/link";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authLoading, authMessage, loginHandler } = useContext(AppContext);

  const router = useRouter();

  // methods
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const success = await loginHandler({ email, password });
    if (success) {
      router.replace("/");
    }
  };

  // side effects

  //   render
  let content;
  if (authMessage) {
    content = <p className="msg">{authMessage}</p>;
  }

  if (authLoading) {
    content = <p className="msg">Loading...</p>;
  }

  return (
    <div className="main-content">
      <h2 className="title">Log In</h2>
      {content}
      <form className={styles.form} onSubmit={formSubmitHandler}>
        <div className={styles.formControl}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            required
            type="email"
            id="email"
            value={email}
            className={styles.input}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            required
            type="password"
            id="password"
            value={password}
            className={styles.input}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <div className="buttons">
          <button className="btn success" type="sumbit">
            Log In
          </button>
        </div>
        <div className="extraButtons">
          <Link href="/reset-password">
            <a className="">Forgotten password?</a>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
