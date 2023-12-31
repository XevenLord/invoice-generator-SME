import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const HomePage = () => {
  const navigate = useNavigate();
  const [signOutCalled, setSignOutCalled] = useState(false);

  const buttonStyle = {
    width: "200px",
    borderRadius: "8px",
    padding: "8px",
  };

  const linkButtonStyle = {
    borderRadius: 0,
    padding: 0,
    border: "none",
    background: "none",
    color: "#007BFF",
    cursor: "pointer",
    textDecoration: "underline",
    verticalAlign: "top",
    boxShadow: "none !important",
  };

  const login = () => {
    navigate("/auth", { state: { isSignup: false } });
  };

  const signUp = () => {
    navigate("/auth", { state: { isSignup: true } });
  };

  useEffect(() => {
    if (!signOutCalled) {
      userSignOut();
      setSignOutCalled(true);
    }
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.clear();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1>INVOICE GENERATOR</h1>
      <div className="mt-5 mb-4">
        <Button
          onClick={login}
          style={{ ...buttonStyle, background: "#308BDE" }}
        >
          LOGIN
        </Button>
      </div>
      <Link to="/form">
        <Button variant="secondary" style={buttonStyle}>
          CONTINUE AS GUEST
        </Button>
      </Link>
      <div className="mt-5">
        Don’t have an account?{" "}
        <Button onClick={signUp} className="" style={linkButtonStyle}>
          create a new account
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
