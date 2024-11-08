import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; 
import Register from './Pages/Register.jsx';
import LogIn from './Pages/LogIn.jsx';
import Alumno from './Pages/Alumno.jsx';
import NavBar from './Components/NavBar'; 
import Instructor from './Pages/Instructor.jsx';
import Home from './Pages/Home.jsx';
import Admin from './Pages/Admin.jsx';
import './App.css';

const App = () => {
    const location = useLocation();

    // Define rutas en las que no deseas que aparezca la NavBar
    const noNavBarRoutes = ['/Login', '/Register'];
    return (
        <div>
            {!noNavBarRoutes.includes(location.pathname) && <NavBar />}
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/LogIn" element={<LogIn />} />
                    <Route path="/Alumno" element={<Alumno />} />
                    <Route path="/Instructor" element={<Instructor />} />
                    <Route path="/Admin" element={<Admin/>} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
