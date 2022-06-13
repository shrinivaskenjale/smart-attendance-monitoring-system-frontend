import { useState, useContext, useRef } from "react";
import FilteredRecords from "../../components/FilteredRecords";
import { AppContext } from "../../context/app-context";
import AccessDenied from "../../components/AccessDenied";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import StudentFilter from "../../components/StudentFilter";
import FacultyFilter from "../../components/FacultyFilter";

const RecordsPage = (props) => {
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // copyStyles: false,
  });
  const { isAuth, user, token } = useContext(AppContext);

  const [records, setRecords] = useState(null);
  const [conductedLecturesCount, setConductedLecturesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mode, setMode] = useState("table");

  // ============================
  // methods
  // ============================

  const fetchRecords = async (filter) => {
    setLoading(true);
    setMessage(null);

    let endpoint;
    let body;

    if (user.type === "faculty") {
      body = {
        date1: filter.date1,
        date2: filter.date2,
        divisionId: filter.divisionId,
        subjectId: filter.subjectId,
        studentId: filter.studentId,
      };
      if (filter.recordsFor === "single") {
        endpoint =
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/faculty/records/students/" +
          user._id;
      } else {
        endpoint =
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/faculty/records/faculty/" +
          user._id;
      }
    } else if (user.type === "student") {
      body = {
        date1: filter.date1,
        date2: filter.date2,
        subjectId: filter.subjectId,
        divisionId: filter.divisionId,
      };
      if (filter.subjectId) {
        endpoint =
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/student/records/students/" +
          user._id;
      }
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(body),
      });
      if (res.status === 500) {
        throw new Error("Something went wrong.");
      }
      const data = await res.json();
      if (res.status >= 300) {
        setMessage(data.message);
      } else {
        // setMessage(data.message);
        setRecords(data.records);
        setConductedLecturesCount(data.conductedLecturesCount);
        if (data.studentsCount) {
          setStudentsCount(data.studentsCount);
        }
        setType(data.type);
      }
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  const toggleHandler = (e) => {
    if (e.target.checked) {
      setMode("graph");
    } else {
      setMode("table");
    }
  };

  // ============================
  // side effects
  // ============================

  // ============================
  // render
  // ============================

  if (!isAuth) {
    return <AccessDenied />;
  } else if (user.type === "admin") {
    return <AccessDenied message="Admins are not allowed to view this page." />;
  }

  let content;

  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Loading...</p>;
  }

  return (
    <div className="main-content">
      <h2 className="title">Records</h2>
      {content}
      {/* <Filter
        inputChangeHandler={inputChangeHandler}
        filter={filter}
        fetchRecords={fetchRecords}
        forStudent={user.type === "student"}
        setMessage={setMessage}
      /> */}

      {user.type === "student" && (
        <StudentFilter setMessage={setMessage} fetchRecords={fetchRecords} />
      )}
      {user.type === "faculty" && (
        <FacultyFilter setMessage={setMessage} fetchRecords={fetchRecords} />
      )}

      {/* toggle  */}
      <div className="toggle">
        <span>Visualization</span>
        <label className="switch">
          <input type="checkbox" onChange={toggleHandler} />
          <span className="slider round"></span>
        </label>
      </div>

      {/* toggle ends */}

      {mode === "table" && records && (
        <div className="buttons">
          <button className="btn success" onClick={handlePrint}>
            Download
          </button>
        </div>
      )}

      {records && (
        <FilteredRecords
          ref={componentRef}
          records={records}
          conductedLecturesCount={conductedLecturesCount}
          type={type}
          forStudent={user.type === "student"}
          mode={mode}
          studentsCount={studentsCount}
        />
      )}
    </div>
  );
};

export default RecordsPage;
