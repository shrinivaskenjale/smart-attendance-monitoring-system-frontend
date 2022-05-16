import Link from "next/link";
import styles from "../../styles/tables.module.css";
import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../context/app-context";
import AccessDenied from "../../components/AccessDenied";

const FacultyPage = (props) => {
  const { isAuth, user, token } = useContext(AppContext);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // ===================================
  // methods
  // ===================================

  const fetchFaculty = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/get-faculty",
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
        setFaculty(data.faculty);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  }, [token]);

  const clearFacultyHandler = async (e) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/admin/clear-faculty",
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
        setFaculty([]);
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
    fetchFaculty();
  }, [fetchFaculty]);

  // ===================================
  // render
  // ===================================

  if (!isAuth || user.type !== "admin") {
    return <AccessDenied />;
  }

  let content;
  let list;

  if (faculty.length > 0) {
    let facultyList = faculty.map((teacher) => {
      return (
        <tr key={teacher._id} className={styles.row}>
          {/* <td>{teacher.rollNumber}</td> */}
          <td>{teacher.name}</td>
          <td>
            <Link href={"/faculty/" + teacher._id}>
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
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{facultyList}</tbody>
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
      <h2 className="title">All Faculty</h2>
      {content}
      {faculty.length > 0 && (
        <div className="buttons">
          <button className="btn danger" onClick={clearFacultyHandler}>
            Clear All
          </button>
        </div>
      )}

      {list}
    </div>
  );
};

export default FacultyPage;
