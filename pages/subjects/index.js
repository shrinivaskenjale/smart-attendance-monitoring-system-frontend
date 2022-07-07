import Link from "next/link";
import styles from "../../styles/tables.module.css";
import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../context/app-context";
import AccessDenied from "../../components/AccessDenied";

const SubjectsPage = (props) => {
  const { isAuth, user, token } = useContext(AppContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // ===================================
  // methods
  // ===================================

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/get-subjects",
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
        setSubjects(data.subjects);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  }, [token]);

  // ===================================
  // side effects
  // ===================================
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // ===================================
  // render
  // ===================================

  if (!isAuth || user.type !== "admin") {
    return <AccessDenied />;
  }

  let content;
  let list;

  if (subjects.length > 0) {
    let subjectsList = subjects.map((subj) => {
      return (
        <tr key={subj._id} className={styles.row}>
          {/* <td>{div.rollNumber}</td> */}
          <td>{subj.subjectName}</td>
          <td>
            <Link href={"#"}>
              <a className={styles.link}>Edit</a>
            </Link>
          </td>
        </tr>
      );
    });

    list = (
      <table className={styles.table}>
        <thead>
          <tr className={styles.row}>
            {/* <th>Roll No.</th> */}
            <th>Subject</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{subjectsList}</tbody>
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
      <h2 className="title">All Subjects</h2>
      {content}

      {list}
    </div>
  );
};

export default SubjectsPage;
