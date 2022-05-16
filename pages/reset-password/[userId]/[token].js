import styles from "../../../components/Form.module.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ResetRequestPage = (props) => {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const router = useRouter();

  // methods
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          `/auth/reset-password/${userId}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
          }),
        }
      );
      if (res.status === 500) {
        throw new Error("Something went wrong.");
      }
      const data = await res.json();
      if (res.status >= 300) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
        setResetDone(true);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  // ============================
  // side effects
  // ============================
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setUserId(router.query.userId);
    setToken(router.query.token);
  }, [router.isReady, router.query.userId, router.query.token]);

  //   render
  let content;
  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Wait...</p>;
  }

  return (
    <div className="main-content">
      <h2 className="title">Reset Password</h2>
      {content}
      {!resetDone && (
        <form className={styles.form} onSubmit={formSubmitHandler}>
          <div className={styles.formControl}>
            <label htmlFor="password" className={styles.label}>
              New Password
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
              Reset Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetRequestPage;
