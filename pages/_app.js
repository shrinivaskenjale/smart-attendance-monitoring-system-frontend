import "../styles/globals.css";
import AppContextProvider from "../context/app-context";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Meta from "../components/Meta";

function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <Meta title="SAMS" />
      <Header />
      <div className="mid">
        <Sidebar />
        <Component {...pageProps} />
      </div>
    </AppContextProvider>
  );
}

export default MyApp;
