import Link from "next/link";
import { options } from "../data/options";
import { useContext } from "react";
import { AppContext } from "../context/app-context";
import styles from "./Options.module.css";
import { CgProfile } from "react-icons/cg";
import { FiLogIn, FiLogOut } from "react-icons/fi";

const Options = (props) => {
  const { isAuth, logoutHandler, user } = useContext(AppContext);

  // ============================
  // methods
  // ============================
  const clickHandler = () => {
    if (props.closeMenuHandler) {
      props.closeMenuHandler();
    }
  };

  // ============================
  // render
  // ============================
  if (!isAuth || !user) {
    return (
      <ul className={styles.optionsList}>
        <Link href="/login">
          <a onClick={clickHandler}>
            <li className={styles.optionsItem}>
              <span className={styles.icon}>
                <FiLogIn />
              </span>
              <span className={styles.text}>Log In</span>
            </li>
          </a>
        </Link>
      </ul>
    );
  }

  let optionsArr;
  if (user.type === "admin") {
    optionsArr = options.admin;
  } else if (user.type === "faculty") {
    optionsArr = options.faculty;
  } else {
    optionsArr = options.student;
  }

  let profileUrl;
  if (user.type === "faculty") {
    profileUrl = "/faculty/" + user._id;
  } else if (user.type !== "admin") {
    profileUrl = "/students/" + user._id;
  }

  return (
    <ul className={styles.optionsList}>
      {optionsArr.map((option) => {
        return (
          <Link key={option.text} href={option.path}>
            <a onClick={clickHandler}>
              <li className={styles.optionsItem}>
                <span className={styles.icon}>{option.icon}</span>
                <span className={styles.text}>{option.text}</span>
              </li>
            </a>
          </Link>
        );
      })}
      {user.type !== "admin" && (
        <Link href={profileUrl}>
          <a onClick={clickHandler}>
            <li className={styles.optionsItem}>
              <span className={styles.icon}>
                <CgProfile />
              </span>
              <span className={styles.text}>Profile</span>
            </li>
          </a>
        </Link>
      )}

      <button onClick={logoutHandler}>
        <li className={styles.optionsItem}>
          <span className={styles.icon}>
            <FiLogOut />
          </span>
          <span className={styles.text}>Log Out</span>
        </li>
      </button>
    </ul>
  );
};

export default Options;
