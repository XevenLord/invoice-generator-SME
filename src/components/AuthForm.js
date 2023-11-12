import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";

const AuthForm = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    console.log("Email:", email, "Password:", password);

    if (isSignup) {
      // signup logic
    } else {
      // login logic
    }
  };

  return (
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

        <div className="mt-5 mb-4 text-center">
          <Button variant="primary" type="submit" style={buttonStyle}>
            {isSignup ? "Create Account" : "Login"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AuthForm;
