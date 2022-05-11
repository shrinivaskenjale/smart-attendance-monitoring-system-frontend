import styles from "./OptionsMenu.module.css";
import Options from "./Options";
import { AiFillCloseCircle } from "react-icons/ai";
import { options } from "../data/options";
import { useContext } from "react";
import { AppContext } from "../context/app-context";
const OptionsMenu = (props) => {
  const { isAuth, user } = useContext(AppContext);

  return (
    <>
      <div className={styles.backdrop} onClick={props.closeMenuHandler}></div>
      <div className={styles.window}>
        <div className={styles.close}>
          <AiFillCloseCircle onClick={props.closeMenuHandler} />
        </div>
        <Options closeMenuHandler={props.closeMenuHandler} />
      </div>
    </>
  );
};

export default OptionsMenu;
