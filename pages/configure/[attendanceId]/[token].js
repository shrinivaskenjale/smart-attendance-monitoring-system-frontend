import styles from "../../../components/Form.module.css";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

const ResetRequestPage = (props) => {
  const [attendanceId, setAttendanceId] = useState("");
  const [token, setToken] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [configureDone, setConfigureDone] = useState(false);
  const [optionsList, setOptionsList] = useState([]);
  const router = useRouter();

  // methods
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          `/faculty/configure/${attendanceId}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subjectId: subjectId,
            divisionId: divisionId,
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
        setConfigureDone(true);
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
      const res = await fetch(endpoint);
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
  }, []);

  // ============================
  // side effects
  // ============================
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setAttendanceId(router.query.attendanceId);
    setToken(router.query.token);
  }, [router.isReady, router.query.attendanceId, router.query.token]);

  useEffect(() => {
    fetchOptionsList();
  }, [fetchOptionsList]);

  //   =======================
  //   render
  // =======================
  console.log(subjectId, divisionId);

  let content;
  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Wait...</p>;
  }

  const divisionOptions = optionsList.map((division) => {
    return (
      <option key={division._id} value={division._id}>
        {division.divisionName}
      </option>
    );
  });

  let subjectOptions = [];
  if (divisionId) {
    const selectedDivision = optionsList.find((item) => {
      return item._id === divisionId;
    });
    if (selectedDivision) {
      subjectOptions = selectedDivision.subjects.map((subject) => {
        return (
          <option key={subject._id} value={subject._id}>
            {subject.subjectName}
          </option>
        );
      });
    }
  }

  return (
    <div className="main-content">
      <h2 className="title">Configure Attendance</h2>
      {content}
      {!configureDone && (
        <form className={styles.form} onSubmit={formSubmitHandler}>
          <div className={styles.formControl}>
            <label htmlFor="divisionId" className={styles.label}>
              Class
            </label>

            <select
              id="divisionId"
              name="divisionId"
              value={divisionId}
              onChange={(e) => {
                setDivisionId(e.target.value);
                setSubjectId("");
              }}
            >
              <option value="">--Please choose the class--</option>
              {divisionOptions}
            </select>
          </div>

          <div className={styles.formControl}>
            <label htmlFor="subjectId" className={styles.label}>
              Subject
            </label>

            <select
              id="subjectId"
              disabled={!divisionId}
              name="subjectId"
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
              }}
            >
              <option value="">--Please choose the subject--</option>
              {subjectOptions}
            </select>
          </div>

          <div className="buttons">
            <button
              className="btn success"
              type="sumbit"
              disabled={!divisionId || !subjectId}
            >
              Confirm
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetRequestPage;
