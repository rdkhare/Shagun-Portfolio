import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WritingPage from './pages/WritingPage';
import AboutPage from './pages/AboutPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <div>
        <Navbar toggleMenu={toggleMenu} menuOpen={menuOpen} />
        {!menuOpen && (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        )}
        <br></br>
        <br></br>
        <Footer />

      </div>
    </Router>
  );
};

export default App;
