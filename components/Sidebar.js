import { options } from "../data/options";
import styles from "./Sidebar.module.css";
import Options from "./Options";
import { useContext } from "react";
import { AppContext } from "../context/app-context";

const Sidebar = (props) => {
  const { isAuth, user } = useContext(AppContext);

  return (
    <div className={styles.sidebar}>
      <Options />
    </div>
  );
};

export default Sidebar;
