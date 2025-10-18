import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Dance Room</h3>
            <p className="footer-text">Студия современных танцев в Барнауле</p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Навигация</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Главная</Link>
              <Link to="/schedule" className="footer-link">Расписание</Link>
              <Link to="/about" className="footer-link">О нас</Link>
              <Link to="/registration" className="footer-link">Регистрация</Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Контакты</h4>
            <p className="footer-text">г. Барнаул, ул. Танцевальная, 15</p>
            <p className="footer-text">Тел: +7 (3852) 123-456</p>
            <p className="footer-text">Email: info@danceroom.ru</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Dance Room. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
