import styles from "./Filter.module.css";
import { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../context/app-context";

const StudentFilter = (props) => {
  const { token, user } = useContext(AppContext);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const { setMessage, fetchRecords } = props;
  const [optionsList, setOptionsList] = useState([]);

  // ============================
  // methods
  // ============================
  const searchHandler = (e) => {
    e.preventDefault();

    if (date2 && !date1) {
      setMessage(
        'Select only "Date 1" for particular day record or select both "Date 1" and "Date 2" for records between these dates.'
      );
      return;
    }

    if (!subjectId) {
      setMessage("Choose a option from dropdown inside filter.");
      return;
    }

    fetchRecords({ date1, date2, subjectId });
  };

  const fetchOptionsList = useCallback(async () => {
    // setLoading(true);
    // setMessage(null);
    let endpoint =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
      "/get-classes/" +
      user.divisionId;

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
        setOptionsList(data.division.subjects);
      }
    } catch (error) {
      // setMessage(error.message);
    }
    // setLoading(false);
  }, [setMessage]);

  // ============================
  // side effects
  // ============================
  useEffect(() => {
    fetchOptionsList();
  }, [fetchOptionsList]);

  // ============================
  // render
  // ============================
  console.log(date1, date2, subjectId);

  const subjectOptions = optionsList.map((subject) => {
    return (
      <option key={subject._id} value={subject._id}>
        {subject.subjectName}
      </option>
    );
  });

  return (
    <div className={styles.filter}>
      <h4 className={styles.title}>Filter</h4>
      <form onSubmit={searchHandler}>
        <div className={`${styles.formControl} ${styles.dateFilters}`}>
          <label htmlFor="date1">Date 1 :</label>
          <input
            type="date"
            name="date1"
            id="date1"
            value={date1}
            onChange={(e) => {
              setDate1(e.target.value);
            }}
          />
        </div>
        <div className={`${styles.formControl} ${styles.dateFilters}`}>
          <label htmlFor="date2">Date 2 :</label>
          <input
            type="date"
            name="date2"
            id="date2"
            value={date2}
            onChange={(e) => {
              setDate2(e.target.value);
            }}
          />
        </div>

        <div className={`${styles.formControl}`}>
          <label>Find Records For :</label>
        </div>

        <div className={styles.formControl}>
          <label htmlFor="subjectId" className={styles.label}>
            Subject
          </label>

          <select
            id="subjectId"
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
          <button type="submit" className="btn success">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentFilter;
