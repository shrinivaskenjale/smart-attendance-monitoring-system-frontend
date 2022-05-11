import Form from "../../components/Form";
import { useContext } from "react";
import { AppContext } from "../../context/app-context";
import AccessDenied from "../../components/AccessDenied";

const AddFacultyPage = (props) => {
  const { isAuth, user } = useContext(AppContext);

  if (!isAuth || user.type !== "admin") {
    return <AccessDenied />;
  }

  return (
    <div className="main-content">
      <h2 className="title">add new faculty</h2>
      <Form forUser="faculty" />
    </div>
  );
};

export default AddFacultyPage;
