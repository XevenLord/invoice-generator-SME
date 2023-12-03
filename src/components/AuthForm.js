import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const AuthForm = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSignup, setIsSignup] = useState(false);

  const buttonStyle = {
    width: isSignup ? "200px" : "150px",
    borderRadius: "8px",
    padding: "8px",
    background: "#308BDE",
  };

  const formStyle = {
    width: "300px",
    borderRadius: "8px",
    padding: "10px",
  };

  useEffect(() => {
    setIsSignup(location.state?.isSignup || false);
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      if (password !== confirmPassword) {
        setPasswordsMatch(false);
        return;
      }
      setPasswordsMatch(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const db = getFirestore();

          // Create a user document in Firestore
          setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            uid: userCredential.user.uid,
            favouriteContacts: [], // Assuming this is an array
            pdfReferences: [], // Assuming this is an array
          })
            .then(() => {
              console.log("User document created in Firestore");
            })
            .catch((error) => {
              console.error("Error writing document to Firestore: ", error);
            });
          setIsSignup(false);
        })
        .catch((error) => console.log(error));

      // signup logic
    } else {
      // login logic
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigate("/form");
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <div className="mb-2">
        <Link to="/" style={{ color: "black" }}>
          <FiChevronLeft size={38} />
        </Link>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h3>INVOICE GENERATOR</h3>
        <h1 style={{ color: "#215F99" }}>{isSignup ? "Sign Up" : "Login"}</h1>
        <Form onSubmit={handleSubmit} className="mt-5 mb-4">
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              style={formStyle}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              style={formStyle}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {isSignup && (
            <>
              <Form.Group controlId="formConfirmPassword" className="mt-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  style={formStyle}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              {!passwordsMatch && (
                <Form.Text style={{ color: "red" }}>
                  Passwords do not match.
                </Form.Text>
              )}
            </>
          )}

          <div className="mt-5 mb-4 text-center">
            <Button variant="primary" type="submit" style={buttonStyle}>
              {isSignup ? "Create Account" : "Login"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
