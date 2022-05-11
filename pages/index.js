import Options from "../components/Options";
import styles from "../styles/HomePage.module.css";
import { options } from "../data/options";

const optionsArr = options.admin;

const HomePage = (props) => {
  const isAdmin = true;

  if (isAdmin) {
    return (
      <div className={styles.optionsList}>
        <Options options={optionsArr} />
      </div>
    );
  }
};

export default HomePage;
