import styles from "./Filter.module.css";
import { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../context/app-context";

const FacultyFilter = (props) => {
  const { token } = useContext(AppContext);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [recordsFor, setRecordsFor] = useState("");
  const { setMessage, fetchRecords } = props;
  const [optionsList, setOptionsList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);

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
    if (!divisionId || !subjectId) {
      setMessage("Select the class and the subject.");
      return;
    }

    if (!recordsFor) {
      setMessage(
        'Choose either "All Students" or "Select Student" inside filter.'
      );
      return;
    }
    if (recordsFor === "single" && !studentId) {
      setMessage("Choose a student from dropdown.");
      return;
    }

    fetchRecords({
      date1,
      date2,
      subjectId,
      divisionId,
      studentId,
      recordsFor,
    });
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
  }, [setMessage]);

  const fetchStudentsList = useCallback(
    async (id) => {
      // setLoading(true);
      // setMessage(null);
      let endpoint =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/get-students/" + id;

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
          setStudentsList(data.students);
        }
      } catch (error) {
        // setMessage(error.message);
      }
      // setLoading(false);
    },
    [setMessage, token]
  );

  // ============================
  // side effects
  // ============================
  useEffect(() => {
    fetchOptionsList();
  }, [fetchOptionsList]);

  useEffect(() => {
    if (!divisionId || recordsFor !== "single") {
      setStudentId("");
      return;
    }
    fetchStudentsList(divisionId);
  }, [fetchStudentsList, divisionId, recordsFor]);

  // ============================
  // render
  // ============================
  console.log(date1, recordsFor);

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

  const studentOptions = studentsList.map((student) => {
    return (
      <option key={student._id} value={student._id}>
        {student.name} ({student.rollNumber})
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

        {/* ========================================== */}
        <div className={`${styles.formControl} ${styles.classFilters}`}>
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

        <div className={`${styles.formControl} ${styles.classFilters}`}>
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
        {/* ========================================== */}

        <div className={styles.formControl}>
          <div className={styles.radioControl}>
            <input
              type="radio"
              name="recordsFor"
              id="all"
              value={"all"}
              onChange={(e) => {
                setRecordsFor(e.target.value);
              }}
            />
            <label htmlFor="all">All Students</label>
          </div>
          <div className={styles.radioControl}>
            <input
              type="radio"
              name="recordsFor"
              id="single"
              value={"single"}
              onChange={(e) => {
                setRecordsFor(e.target.value);
              }}
            />
            <label htmlFor="single">Select Student</label>
          </div>
        </div>

        {recordsFor === "single" && (
          <div className={styles.formControl}>
            <select
              id="studentId"
              name="studentId"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
              }}
            >
              <option value="">--Please choose the student--</option>
              {studentOptions}
            </select>
          </div>
        )}
        <div className="buttons">
          <button type="submit" className="btn success">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacultyFilter;
