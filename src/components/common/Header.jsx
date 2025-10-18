import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-text">Dance Room</span>
          </Link>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Главная</Link>
            <Link to="/schedule" className="nav-link" onClick={() => setMenuOpen(false)}>Расписание</Link>
            <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>О нас</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>Личный кабинет</Link>
                <button className="nav-link nav-btn" onClick={handleLogout}>Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Вход</Link>
                <Link to="/registration" className="nav-link-btn" onClick={() => setMenuOpen(false)}>Регистрация</Link>
              </>
            )}
          </nav>

          {isAuthenticated && user && (
            <div className="user-info">
              {user.fullName?.split(' ')[0]} {user.fullName?.split(' ')[1]}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
