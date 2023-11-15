import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import HomePage from "./components/HomePage";
import InvoiceForm from "./components/InvoiceForm";
import AuthForm from "./components/AuthForm";

class App extends Component {
  render() {
    return (
      <div className="App d-flex flex-column align-items-center justify-content-center w-100">
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/form" element={<InvoiceForm />} />
          </Routes>
        </Container>
      </div>
    );
  }
}

export default App;
