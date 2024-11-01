import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Register from './Pages/Register.jsx';
import LogIn from './Pages/LogIn.jsx';
import Alumno from './Pages/Alumno.jsx';
import NavBar from './Components/NavBar'; 
import Home from './Pages/Home.jsx';
import './App.css';

const App = () => {
    return (
        <Router>
            <NavBar />
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/LogIn" element={<LogIn />} />
                    <Route path="/Alumno" element={<Alumno />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
