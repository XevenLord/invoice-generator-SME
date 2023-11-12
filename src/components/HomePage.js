import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
// login functions
class HomePage extends React.Component {
  render() {
    const buttonStyle = { width: "200px" }; 

    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1>INVOICE GENERATOR</h1>
        <div className="mt-5 mb-4">
          <Button style={buttonStyle}> LOGIN</Button>
        </div>
        <Link to="/form">
          <Button variant="secondary" style={buttonStyle}>
            CONTINUE AS GUEST
          </Button>
        </Link>
      </div>
    );
  }
}

export default HomePage;
