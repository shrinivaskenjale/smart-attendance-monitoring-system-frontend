import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/app-context";
import styles from "../../../styles/tables.module.css";
import AccessDenied from "../../../components/AccessDenied";

const EditRecordPage = (props) => {
  const { isAuth, user, token } = useContext(AppContext);

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  // ============================
  // methods
  // ============================

  const fetchRecord = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/faculty/records/" +
          router.query.slug +
          "?edit=true",
        {
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
        // setMessage(data.message);
        setRecord(data.record);
      }
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  const toggleStatusHandler = (id) => {
    let updatedRecord = record.map((student) => {
      if (student._id === id) {
        student.present = !student.present;
      }
      return student;
    });
    setRecord(updatedRecord);
  };

  const updateRecordHandler = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/faculty/records/" +
          router.query.slug,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            updatedRecord: record,
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
        router.push("/records/" + router.query.slug);
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
    fetchRecord();
  }, [router.isReady]);

  // ===================================
  // render
  // ===================================

  if (!isAuth || user.type !== "faculty") {
    return <AccessDenied />;
  }

  console.log(record);

  let content = <p className="msg">Record not found.</p>;

  if (record && record.length > 0) {
    let studentList = record.map((student) => {
      return (
        <tr
          key={student._id}
          className={`${styles.row} ${
            student.present ? styles.present : styles.absent
          }`}
          onClick={() => toggleStatusHandler(student._id)}
        >
          <td>{student.rollNumber}</td>
          <td>{student.name}</td>
        </tr>
      );
    });

    content = (
      <table className={styles.table}>
        <thead>
          <tr className={styles.row}>
            <th>Roll</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>{studentList}</tbody>
      </table>
    );
  }

  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Loading...</p>;
  }

  let date;
  if (record) {
    date = new Date(record.createdAt);
  }

  return (
    <div className="main-content">
      <h2 className="title">Edit Record</h2>

      {content}
      <div className="buttons">
        <button
          type="submit"
          className="btn success"
          onClick={updateRecordHandler}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default EditRecordPage;
