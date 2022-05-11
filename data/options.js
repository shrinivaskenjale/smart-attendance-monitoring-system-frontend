import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import { CgNotes } from "react-icons/cg";
import { BsFillPersonPlusFill } from "react-icons/bs";

export const options = {
  admin: [
    {
      text: "add faculty",
      path: "/faculty/new",
      icon: <BsFillPersonPlusFill />,
    },
    {
      text: "add student",
      path: "/students/new",
      icon: <BsFillPersonPlusFill />,
    },

    {
      text: "students",
      path: "/students",
      icon: <FaChalkboardTeacher />,
    },
    {
      text: "faculty",
      path: "/faculty",
      icon: <GiTeacher />,
    },
  ],
  faculty: [
    {
      text: "records",
      path: "/records",
      icon: <CgNotes />,
    },
    {
      text: "students",
      path: "/students",
      icon: <FaChalkboardTeacher />,
    },
    {
      text: "delete record",
      path: "/delete-record",
      icon: <AiTwotoneDelete />,
    },
  ],
  student: [
    {
      text: "records",
      path: "/records",
      icon: <CgNotes />,
    },
  ],
};
