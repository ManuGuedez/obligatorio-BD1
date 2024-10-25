import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Register from './Components/Register.jsx';
import LogIn from './Components/LogIn.jsx'; 
import Home from './Components/Home.jsx';  
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <div className="title-container">
                    <h1 className="app-title">Gestor UCU</h1>
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/6/63/UCU.png" 
                        alt="Logo UCU" 
                        className="ucu-logo"
                    />
                </div>
                <Routes>
                    <Route path="/" element={<Home />} />  
                    <Route path="/Register" element={<Register />} /> 
                    <Route path="/LogIn" element={<LogIn />} /> 
                </Routes>
            </div>
        </Router>
    );
};

export default App;
