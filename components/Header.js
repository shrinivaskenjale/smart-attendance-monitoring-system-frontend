import styles from "./Header.module.css";
import { BiMenuAltLeft } from "react-icons/bi";
import OptionsMenu from "./OptionsMenu";
import { useState } from "react";
const Header = (props) => {
  const [showMenu, setShowMenu] = useState(false);

  const showMenuHandler = () => {
    setShowMenu(true);
  };

  const closeMenuHandler = () => {
    setShowMenu(false);
  };

  return (
    <>
      {showMenu && <OptionsMenu closeMenuHandler={closeMenuHandler} />}
      <div className={styles.headerContainer}>
        <div className={styles.header + " mid"}>
          <div className={styles.menu} onClick={showMenuHandler}>
            <BiMenuAltLeft />
          </div>
          <div className={`${styles.logo} ${styles.logoLarge}`}>
            Smart Attendance Monitoring System
          </div>
          <div className={`${styles.logo} ${styles.logoSmall}`}>SAMS</div>
        </div>
      </div>
    </>
  );
};

export default Header;
