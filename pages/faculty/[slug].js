import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Form from "../../components/Form";
import { AppContext } from "../../context/app-context";
import AccessDenied from "../../components/AccessDenied";

const DetailsPage = (props) => {
  const { isAuth, user, token } = useContext(AppContext);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  // ============================
  // methods
  // ============================

  const fetchFaculty = async () => {
    setLoading(true);
    setMessage(null);
    console.log(router.query.slug);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/get-details/" +
          router.query.slug,
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
        setFaculty(data.user);
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
    fetchFaculty();
  }, [router.isReady]);

  // ============================
  // render
  // ============================

  if (!isAuth || user.type === "student") {
    return <AccessDenied />;
  }

  let content = "No record found.";

  if (faculty) {
    content = <Form fetchedUser={faculty} forUser="faculty" />;
  }

  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Loading...</p>;
  }

  return (
    <div className="main-content">
      <h2 className="title">faculty info</h2>
      {content}
    </div>
  );
};

export default DetailsPage;
