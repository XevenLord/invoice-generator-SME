// HistoryButton.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const HistoryButton = () => {
  const navigate = useNavigate();


  return (
    <div>
      
        <button
          onClick={() => navigate("/history")}
          className="btn btn-success rounded"
          style={{ marginRight: "10px" }}
        >
          <FaHome /> Invoice History
        </button>
    </div>
  );
};

export default HistoryButton;
