import styles from "../../components/Form.module.css";
import { AppContext } from "../../context/app-context";
import AccessDenied from "../../components/AccessDenied";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

const AddSubjectPage = (props) => {
  const { token, isAuth, user } = useContext(AppContext);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const router = useRouter();
  // methods
  const cancelOperationHandler = (e) => {
    e.preventDefault();
    router.replace("/students");
  };
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    let reqBody = {
      subjectName,
    };
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/admin/add-subject",
        {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
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
        router.replace("/subjects");
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
  }, [router.isReady]);

  //   render
  if (!isAuth || user.type !== "admin") {
    return <AccessDenied />;
  }

  let content;
  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Wait...</p>;
  }

  return (
    <div className="main-content">
      <h2 className="title">Add New Subject</h2>
      {content}
      {
        <form className={styles.form} onSubmit={formSubmitHandler}>
          <div className={styles.formControl}>
            <label htmlFor="subject" className={styles.label}>
              Subject
            </label>
            <input
              required
              type="text"
              id="subject"
              value={subjectName}
              className={styles.input}
              onChange={(e) => {
                setSubjectName(e.target.value);
              }}
            />
          </div>

          {user.type === "admin" && (
            <div className="buttons">
              <button className="btn danger" onClick={cancelOperationHandler}>
                Cancel
              </button>
              <button className="btn success" type="sumbit">
                Save
              </button>
            </div>
          )}
        </form>
      }
    </div>
  );
};

export default AddSubjectPage;
