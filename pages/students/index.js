import Link from "next/link";
import styles from "../../styles/tables.module.css";
import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../context/app-context";
import AccessDenied from "../../components/AccessDenied";

const StudentsPage = (props) => {
  const { isAuth, user, token } = useContext(AppContext);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  // ===================================
  // methods
  // ===================================
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/get-students",
        {
          headers: { Authorization: "Bearer " + token },
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
        setStudents(data.students);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  }, [token]);

  const clearStudentsHandler = async (e) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/admin/clear-students",
        {
          method: "DELETE",
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
        setStudents([]);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };
  // ===================================
  // side effects
  // ===================================
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ===================================
  // render
  // ===================================

  if (!isAuth || user.type === "student") {
    return <AccessDenied />;
  }

  let content;
  let list;

  if (students.length > 0) {
    let studentsList = students.map((student) => {
      return (
        <tr key={student._id} className={styles.row}>
          <td>{student.rollNumber}</td>
          <td>{student.name}</td>
          <td>
            <Link href={"/students/" + student._id}>
              <a className={styles.link}>
                {user.type === "admin" ? "Edit" : "View"}
              </a>
            </Link>
          </td>
        </tr>
      );
    });

    list = (
      <table className={styles.table}>
        <thead>
          <tr className={styles.row}>
            <th>Roll No.</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{studentsList}</tbody>
      </table>
    );
  } else {
    content = <p className="msg">No recods found.</p>;
  }

  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Loading...</p>;
  }

  return (
    <div className="main-content">
      <h2 className="title">All Students</h2>
      {content}

      {students.length > 0 && user.type === "admin" && (
        <div className="buttons">
          <button className="btn danger" onClick={clearStudentsHandler}>
            Clear All
          </button>
        </div>
      )}

      {list}
    </div>
  );
};

export default StudentsPage;
