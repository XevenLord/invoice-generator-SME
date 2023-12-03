// AuthButton.js
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const AuthButton = () => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  const userSignOut = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      signOut(auth)
        .then(() => {
          sessionStorage.clear();
          console.log("Sign out successful");
          window.location.replace("/");
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {authUser ? (
        <button
          onClick={userSignOut}
          className="btn btn-danger rounded-pill"
          style={{ marginRight: "10px" }}
        >
          <FaSignOutAlt /> Logout
        </button>
      ) : (
        <button
          onClick={() => {
            window.location.replace("/");
          }}
          className="btn btn-primary rounded-pill"
          style={{ marginRight: "10px" }}
        >
          <FaHome /> Home
        </button>
      )}
    </div>
  );
};

export default AuthButton;
