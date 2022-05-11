import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { AppContext } from "../context/app-context";
import AccessDenied from "../components/AccessDenied";
import styles from "../components/Form.module.css";

const DeleteRecordPage = (props) => {
  const { isAuth, user, token } = useContext(AppContext);
  const [attendanceId, setAttendanceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  // ============================
  // methods
  // ============================

  const deleteRecord = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (attendanceId.trim() === "") {
        throw new Error("Please enter an attendance id.");
      }
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/faculty/delete-record/" +
          attendanceId,
        {
          method: "DELETE",
          headers: {
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
        setAttendanceId("");
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };
  // ============================
  // side effects
  // ============================

  // ============================
  // render
  // ============================

  if (!isAuth || user.type !== "faculty") {
    return <AccessDenied />;
  }

  let content;

  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Loading...</p>;
  }

  return (
    <div className="main-content">
      <h2 className="title">Delete Record</h2>
      {content}
      <form onSubmit={deleteRecord} className={styles.form}>
        <div className={styles.formControl}>
          <label htmlFor="attendanceId" className={styles.label}>
            Attendance Id
          </label>
          <input
            required
            type="text"
            id="attendanceId"
            value={attendanceId}
            className={styles.input}
            onChange={(e) => {
              setAttendanceId(e.target.value);
            }}
          />
        </div>
        <div className="buttons">
          <button type="submit" className="btn danger">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteRecordPage;
