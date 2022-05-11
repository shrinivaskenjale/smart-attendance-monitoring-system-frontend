import styles from "./Form.module.css";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AppContext } from "../context/app-context";

const Form = (props) => {
  const { token, user } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const router = useRouter();

  const { fetchedUser, forUser } = props;

  // =============================
  // methods
  // =============================
  const cancelOperationHandler = (e) => {
    e.preventDefault();
    router.replace(forUser === "student" ? "/students" : "/faculty");
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    // e.target.disabled = true;
    let reqBody = {
      name,
      email,
      imageUrl,
      rollNumber,
      password,
      type: forUser,
    };

    setLoading(true);
    setMessage(null);

    try {
      let path;

      if (fetchedUser) {
        path =
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/admin/update-user/" +
          fetchedUser._id;
      } else {
        path = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/admin/add-user";
      }

      const res = await fetch(path, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (res.status === 500) {
        throw new Error("Something went wrong.");
      }
      const data = await res.json();
      if (res.status >= 300) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
        router.replace(forUser === "student" ? "/students" : "/faculty");
      }
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  const deleteUserHandler = async (e) => {
    e.preventDefault();
    // e.target.disabled = true;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/admin/delete-user/" +
          fetchedUser._id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (res.status === 500) {
        throw new Error("Something went wrong.");
      }
      const data = await res.json();
      if (res.status >= 300) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
        router.replace(forUser === "student" ? "/students" : "/faculty");
      }
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  // =============================
  // side effects
  // =============================
  useEffect(() => {
    if (fetchedUser) {
      setName(fetchedUser.name);
      setEmail(fetchedUser.email);
      setImageUrl(fetchedUser.imageUrl);
      setRollNumber(fetchedUser.rollNumber);
    }
  }, []);

  // =============================
  // render
  // =============================

  let content;
  if (message) {
    content = <p className="msg">{message}</p>;
  }

  if (loading) {
    content = <p className="msg">Loading...</p>;
  }

  return (
    <>
      {content}
      <form className={styles.form} onSubmit={formSubmitHandler}>
        <div className={styles.formControl}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            required
            type="text"
            id="name"
            value={name}
            disabled={fetchedUser && user.type !== "admin"}
            className={styles.input}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            required
            type="email"
            id="email"
            value={email}
            disabled={fetchedUser && user.type !== "admin"}
            className={styles.input}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        {!fetchedUser && (
          <div className={styles.formControl}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              required
              type="password"
              id="password"
              value={password}
              disabled={fetchedUser && user.type !== "admin"}
              className={styles.input}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        )}
        <div className={styles.formControl}>
          <label htmlFor="imageUrl" className={styles.label}>
            Image URL
          </label>
          <input
            required
            type="text"
            id="imageUrl"
            value={imageUrl}
            className={styles.input}
            disabled={fetchedUser && user.type !== "admin"}
            onChange={(e) => {
              setImageUrl(e.target.value);
            }}
          />
        </div>
        {forUser === "student" && (
          <div className={styles.formControl}>
            <label htmlFor="rollNumber" className={styles.label}>
              Roll Number
            </label>
            <input
              required
              type="number"
              id="rollNumber"
              value={rollNumber}
              className={styles.input}
              disabled={fetchedUser && user.type !== "admin"}
              onChange={(e) => {
                setRollNumber(e.target.value);
              }}
            />
          </div>
        )}

        {user.type === "admin" && (
          <div className="buttons">
            <button className="btn danger" onClick={cancelOperationHandler}>
              Cancel
            </button>
            {fetchedUser && (
              <button className="btn danger" onClick={deleteUserHandler}>
                Delete
              </button>
            )}

            <button className="btn success" type="sumbit">
              Save
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default Form;
