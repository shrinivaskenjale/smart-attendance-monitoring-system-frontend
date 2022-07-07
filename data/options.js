import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import { CgNotes } from "react-icons/cg";
import { BsFillPersonPlusFill, BsPlusCircle } from "react-icons/bs";
import { SiGoogleclassroom } from "react-icons/si";
import { MdOutlineClass } from "react-icons/md";

export const options = {
  admin: [
    {
      text: "faculty",
      path: "/faculty",
      icon: <GiTeacher />,
    },
    {
      text: "students",
      path: "/students",
      icon: <FaChalkboardTeacher />,
    },
    {
      text: "classes",
      path: "/classes",
      icon: <SiGoogleclassroom />,
    },
    {
      text: "subjects",
      path: "/subjects",
      icon: <MdOutlineClass />,
    },
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
      text: "add class",
      path: "/classes/new",
      icon: <BsPlusCircle />,
    },
    {
      text: "add subject",
      path: "/subjects/new",
      icon: <BsPlusCircle />,
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
