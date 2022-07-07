import styles from "../../components/Form.module.css";
import { AppContext } from "../../context/app-context";
import AccessDenied from "../../components/AccessDenied";
import { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";

const AddDivisionPage = (props) => {
  const { token, isAuth, user } = useContext(AppContext);
  const [subjectIds, setSubjectIds] = useState(new Set());
  const [divisionName, setDivisionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [optionsList, setOptionsList] = useState([]);

  const router = useRouter();
  // methods
  const cancelOperationHandler = (e) => {
    e.preventDefault();
    router.replace("/classes");
  };
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    let reqBody = {
      subjectIds: [...subjectIds],
      divisionName: divisionName,
    };
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/admin/add-class",
        {
          method: "POST",
          body: JSON.stringify(reqBody),
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
        router.replace("/classes");
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  const addSubjectHandler = (e) => {
    if (e.target.checked) {
      subjectIds.add(e.target.value);
    } else {
      subjectIds.delete(e.target.value);
    }
    // console.log(subjectIds);
  };

  const fetchOptionsList = useCallback(async () => {
    // setLoading(true);
    // setMessage(null);
    let endpoint = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/get-subjects";

    try {
      const res = await fetch(endpoint);

      if (res.status === 500) {
        throw new Error("Something went wrong.");
      }
      const data = await res.json();
      console.log(data);
      if (res.status >= 300) {
        setMessage(data.message);
      } else {
        // setMessage(data.message);
        setOptionsList(data.subjects);
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
  }, [router.isReady]);
  useEffect(() => {
    fetchOptionsList();
  }, [fetchOptionsList]);

  //   render
  if (!isAuth || user.type !== "admin") {
    return <AccessDenied />;
  }

  let content;
  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Wait...</p>;
  }

  const subjectOptions = optionsList.map((subject) => {
    return (
      <div key={subject._id} className={styles.checkbox}>
        <input
          type="checkbox"
          name="subjects"
          id={subject._id}
          value={subject._id}
          onChange={addSubjectHandler}
        />
        <label htmlFor={subject._id}>{subject.subjectName}</label>
      </div>
    );
  });

  return (
    <div className="main-content">
      <h2 className="title">Add New Class</h2>
      {content}
      {
        <form className={styles.form} onSubmit={formSubmitHandler}>
          <div className={styles.formControl}>
            <label htmlFor="division" className={styles.label}>
              Class:
            </label>
            <input
              required
              type="text"
              id="division"
              value={divisionName}
              className={styles.input}
              onChange={(e) => {
                setDivisionName(e.target.value);
              }}
            />
          </div>

          <div className={styles.formControl}>
            <label className={styles.label}>Subjects:</label>

            {subjectOptions}
          </div>

          {user.type === "admin" && (
            <div className="buttons">
              <button className="btn danger" onClick={cancelOperationHandler}>
                Cancel
              </button>
              <button className="btn success" type="sumbit">
                Save
              </button>
            </div>
          )}
        </form>
      }
    </div>
  );
};

export default AddDivisionPage;
