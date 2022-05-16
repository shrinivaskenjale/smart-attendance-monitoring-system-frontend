import styles from "../styles/HomePage.module.css";
// import Image from "next/image";
// import landingImage from "../public/phone.svg";

const HomePage = (props) => {
  return (
    <div className="main-content">
      <div className={styles.banner}>
        <div className={styles.text}>
          <h2>
            Attendance tracking made <span>simple</span>.
          </h2>
          <p>
            Smart Attendance Monitoring System changes and speeds up the
            attendance management process in educational institutions.
          </p>
        </div>
        <img className={styles.image} src="/phone.svg" alt="phone" />
        {/* <Image src={landingImage} className={styles.image} /> */}
      </div>
    </div>
  );
};

export default HomePage;
