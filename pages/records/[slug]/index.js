import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/app-context";
import AccessDenied from "../../../components/AccessDenied";
import styles from "../../../styles/tables.module.css";

const SingleRecordsPage = (props) => {
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
          router.query.slug,
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

  if (record && record.present.length > 0) {
    record.present.sort((a, b) => a.rollNumber - b.rollNumber);

    let studentList = record.present.map((student) => {
      return (
        <tr key={student._id} className={styles.row}>
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
      <h2 className="title">Records</h2>
      <h4>{record && date.toLocaleString("en-IN")}</h4>
      <div className="buttons">
        <Link href={`/records/${router.query.slug}/edit`}>
          <button className="btn danger">Edit</button>
        </Link>
      </div>
      {content}
    </div>
  );
};

export default SingleRecordsPage;
