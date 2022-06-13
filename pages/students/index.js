import Link from "next/link";
import styles from "../../styles/tables.module.css";
import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../context/app-context";
import AccessDenied from "../../components/AccessDenied";
import formStyles from "../../components/Form.module.css";

const StudentsPage = (props) => {
  const { isAuth, user, token } = useContext(AppContext);

  const [students, setStudents] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [divisionId, setDivisionId] = useState("");
  const [optionsList, setOptionsList] = useState([]);
  // ===================================
  // methods
  // ===================================
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (!divisionId) {
      setMessage("Select the class from dropdown.");
      setStudents(null);
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/get-students/" +
          divisionId,
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
  };

  const clearStudentsHandler = async (e) => {
    if (!divisionId) {
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/admin/clear-students/" +
          divisionId,
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
        setStudents(null);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  const fetchOptionsList = useCallback(async () => {
    // setLoading(true);
    // setMessage(null);
    let endpoint = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/get-classes";

    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.status === 500) {
        throw new Error("Something went wrong.");
      }
      const data = await res.json();
      if (res.status >= 300) {
        setMessage(data.message);
      } else {
        // setMessage(data.message);
        setOptionsList(data.divisions);
      }
    } catch (error) {
      // setMessage(error.message);
    }
    // setLoading(false);
  }, [token]);

  // ===================================
  // side effects
  // ===================================
  useEffect(() => {
    fetchOptionsList();
  }, [fetchOptionsList]);

  // ===================================
  // render
  // ===================================

  if (!isAuth || user.type === "student") {
    return <AccessDenied />;
  }

  let content;
  let list;

  if (students && students.length > 0) {
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
  } else if (students && students.length === 0) {
    content = <p className="msg">No recods found.</p>;
  }

  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Loading...</p>;
  }

  const divisionOptions = optionsList.map((division) => {
    return (
      <option key={division._id} value={division._id}>
        {division.divisionName}
      </option>
    );
  });

  return (
    <div className="main-content">
      <h2 className="title">All Students</h2>
      {content}
      <form className={formStyles.form} onSubmit={formSubmitHandler}>
        <div className={formStyles.formControl}>
          <label htmlFor="divisionId" className={formStyles.label}>
            Class
          </label>
          <select
            id="divisionId"
            name="divisionId"
            value={divisionId}
            onChange={(e) => {
              setDivisionId(e.target.value);
            }}
          >
            <option value="">--Please choose the class--</option>
            {divisionOptions}
          </select>
        </div>
        <div className="buttons">
          <button className="btn success" type="sumbit">
            Search
          </button>
        </div>
      </form>

      {students && students.length > 0 && user.type === "admin" && (
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
