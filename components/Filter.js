import styles from "./Filter.module.css";
import { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../context/app-context";

const Filter = (props) => {
  const { token } = useContext(AppContext);
  const { forStudent, inputChangeHandler, filter, setMessage, fetchRecords } =
    props;
  const [optionsList, setOptionsList] = useState([]);

  // ============================
  // methods
  // ============================
  const searchHandler = (e) => {
    e.preventDefault();

    if (filter.date2 && !filter.date1) {
      setMessage(
        'Select only "Date 1" for particular day record or select both "Date 1" and "Date 2" for records between these dates.'
      );
      return;
    }

    if (forStudent) {
      if (!filter.userId) {
        setMessage("Choose a option from dropdown inside filter.");
        return;
      }
    } else {
      if (!filter.recordsFor) {
        setMessage(
          'Choose either "All Students" or "Select Student" inside filter.'
        );
        return;
      }
      if (filter.recordsFor === "single" && !filter.userId) {
        setMessage("Choose a option from dropdown inside filter.");
        return;
      }
    }
    fetchRecords();
  };

  const fetchOptionsList = useCallback(async () => {
    // setLoading(true);
    // setMessage(null);
    let endpoint;
    if (forStudent) {
      endpoint = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/get-faculty";
    } else {
      endpoint = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/get-students";
    }
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
        if (forStudent) {
          setOptionsList(data.faculty);
        } else {
          setOptionsList(data.students);
        }
      }
    } catch (error) {
      // setMessage(error.message);
    }
    // setLoading(false);
  }, [forStudent, setMessage, token]);

  // ============================
  // side effects
  // ============================
  useEffect(() => {
    fetchOptionsList();
  }, [fetchOptionsList]);

  // ============================
  // render
  // ============================

  const options = optionsList.map((user) => {
    return (
      <option key={user._id} value={user._id}>{`${user.name} ${
        forStudent ? "" : `(${user.rollNumber})`
      } `}</option>
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
            value={filter.date1}
            onChange={inputChangeHandler}
          />
        </div>
        <div className={`${styles.formControl} ${styles.dateFilters}`}>
          <label htmlFor="date2">Date 2 :</label>
          <input
            type="date"
            name="date2"
            id="date2"
            value={filter.date2}
            onChange={inputChangeHandler}
          />
        </div>

        <div className={`${styles.formControl}`}>
          <label>Find Records For :</label>
        </div>

        {!forStudent && (
          <div className={styles.formControl}>
            <div className={styles.radioControl}>
              <input
                type="radio"
                name="recordsFor"
                id="all"
                value={"all"}
                onChange={inputChangeHandler}
              />
              <label htmlFor="all">All Students</label>
            </div>
            <div className={styles.radioControl}>
              <input
                type="radio"
                name="recordsFor"
                id="single"
                value={"single"}
                onChange={inputChangeHandler}
              />
              <label htmlFor="single">Select Student</label>
            </div>
          </div>
        )}

        {(filter.recordsFor === "single" || forStudent) && (
          <div className={styles.formControl}>
            <select
              name="userId"
              value={filter.userId}
              onChange={inputChangeHandler}
            >
              <option value="">--Please choose an option--</option>
              {options}
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

export default Filter;
