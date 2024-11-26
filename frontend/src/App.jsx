import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import NavBar from "./Components/NavBar.jsx";
import Admin from "./Pages/Admin.jsx";
import Alumno from "./Pages/Alumno/Alumno.jsx";
import Home from "./Pages/Home.jsx";
import Instructor from "./Pages/Instructor.jsx";
import Lista from "./Pages/Lista";
import LogIn from "./Pages/LogIn.jsx";
import Register from "./Pages/Register.jsx";

const App = () => {
  const location = useLocation();

  // Define rutas en las que no deseas que aparezca la NavBar
  const noNavBarRoutes = ["/LogIn", "/Register", "/register", "/login"];
  return (
    <div>
      <div className="app-container">
        {!noNavBarRoutes.includes(location.pathname) && <NavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/Alumno" element={<Alumno />} />
          <Route path="/Instructor" element={<Instructor />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/class/:classId" element={<Lista />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
