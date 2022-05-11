import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const AppContext = React.createContext({
  user: null,
  isAuth: false,
  authMessage: null,
  authLoading: false,
  loginHandler: async () => {},
  logoutHandler: async () => {},
  token: null,
});

const AppContextProvider = (props) => {
  // states
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  const router = useRouter();

  // methods
  const logoutHandler = () => {
    setIsAuth(false);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("user");
    router.push("/");
  };

  const setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  const loginHandler = async (authData) => {
    // event.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);
    let success = false;

    try {
      console.log(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: authData.email,
            password: authData.password,
          }),
        }
      );

      if (res.status === 500) {
        throw new Error("Something went wrong.");
      }
      const data = await res.json();
      if (res.status >= 300) {
        setAuthMessage(data.message);
      } else {
        setIsAuth(true);
        setToken(data.token);
        setAuthLoading(false);
        setUser(data.user);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
        success = true;
      }
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setAuthMessage(error.message);
    }
    setAuthLoading(false);
    return success;
  };

  // side effects
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user, typeof user);
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setIsAuth(true);
    setToken(token);
    setUser(user);
    setAutoLogout(remainingMilliseconds);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuth,
        authMessage,
        authLoading,
        loginHandler,
        logoutHandler,
        token,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
