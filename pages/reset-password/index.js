import styles from "../../components/Form.module.css";
import { useState } from "react";

const ResetRequestPage = (props) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // methods
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
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
        setEmailSent(true);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  // side effects

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
      {!emailSent && (
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

          <div className="buttons">
            <button className="btn success" type="sumbit">
              Send Reset Link
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetRequestPage;
