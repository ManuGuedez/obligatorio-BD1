import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Admin from "./Pages/Admin.jsx";
import Alumno from "./Pages/Alumno/Alumno.jsx";
import Home from "./Pages/Home.jsx";
import Instructor from "./Pages/Instructor.jsx";
import Lista from "./Pages/Lista";
import LogIn from "./Pages/LogIn.jsx";
import Register from "./Pages/Register.jsx";
import ClassDetails from "./Pages/ClassDetails.jsx";

const App = () => {
  return (
    <div>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/Alumno" element={<Alumno />} />
          <Route path="/Instructor" element={<Instructor />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/class/:classId" element={<ClassDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
