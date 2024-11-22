import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./Pages/Register.jsx";
import LogIn from "./Pages/LogIn.jsx";
import Alumno from "./Pages/Alumno.jsx";
import NavBar from "./Components/NavBar.jsx";
import Instructor from "./Pages/Instructor.jsx";
import Home from "./Pages/Home.jsx";
import Admin from "./Pages/Admin.jsx";
import "./App.css";

const App = () => {
  return (
    <div>
      <div className="app-container">
        <Routes>
          <Route path="/*" element={<Navigate replace to="/LogIn" />} />
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/Alumno" element={<Alumno />} />
          <Route path="/Instructor" element={<Instructor />} />
          <Route path="/Admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
