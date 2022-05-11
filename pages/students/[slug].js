import Form from "../../components/Form";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import AccessDenied from "../../components/AccessDenied";
import { AppContext } from "../../context/app-context";

const DetailsPage = (props) => {
  const { isAuth, token } = useContext(AppContext);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  // ============================
  // methods
  // ============================

  const fetchStudent = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/get-details/" +
          router.query.slug,
        {
          headers: {
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
        // setMessage(data.message);
        setStudent(data.user);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };
  // ============================
  // side effects
  // ============================
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    fetchStudent();
  }, [router.isReady]);

  // ============================
  // render
  // ============================

  if (!isAuth) {
    return <AccessDenied />;
  }

  let content = "No record found.";

  if (student) {
    content = <Form forUser="student" fetchedUser={student} />;
  }

  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Loading...</p>;
  }

  return (
    <div className="main-content">
      <h2 className="title">student info</h2>
      {content}
    </div>
  );
};

export default DetailsPage;
