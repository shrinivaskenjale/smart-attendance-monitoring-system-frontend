import Form from "../../components/Form";
import { AppContext } from "../../context/app-context";
import AccessDenied from "../../components/AccessDenied";
import { useContext } from "react";

const AddStudentPage = (props) => {
  const { isAuth, user } = useContext(AppContext);

  if (!isAuth || user.type !== "admin") {
    return <AccessDenied />;
  }

  return (
    <div className="main-content">
      <h2 className="title">add new student</h2>
      <Form forUser="student" />
    </div>
  );
};

export default AddStudentPage;
