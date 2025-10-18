import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import GallerySlider from '../components/sliders/GallerySlider';
import TeamSlider from '../components/sliders/TeamSlider';
import { leadership } from '../data/mockData';
import './About.css';

const About = () => {
  return (
    <div className="page">
      <Header />
      
      <main className="about-main">
        <section className="about-hero">
          <div className="container">
            <h1 className="page-title-white">О нас</h1>
            <p className="page-subtitle-white">Узнайте больше о Dance Room</p>
          </div>
        </section>

        <section className="about-info">
          <div className="container">
            <div className="info-content">
              <h2 className="info-title-center">Студия современных танцев Dance Room</h2>
              <p className="info-text">
                Dance Room — это профессиональная студия современных танцев в Барнауле, где каждый может найти свой стиль и раскрыть танцевальный потенциал. Мы предлагаем обучение по различным направлениям: Hip-Hop, Contemporary, Jazz-Funk, Break Dance, Vogue, Dancehall и Krump.
              </p>
              <p className="info-text">
                Наша студия оборудована просторными залами с профессиональным покрытием, зеркалами во всю стену и качественной звуковой системой. Мы создали комфортную атмосферу, где каждый ученик чувствует себя частью большой танцевальной семьи.
              </p>
              <p className="info-text">
                Преподаватели Dance Room — это опытные хореографы с многолетним стажем, призеры и победители российских и международных соревнований. Они находят индивидуальный подход к каждому ученику и помогают достичь максимальных результатов.
              </p>
            </div>

            <div className="gallery-section">
              <h3 className="subsection-title-center">Наша студия</h3>
              <GallerySlider />
            </div>
          </div>
        </section>

        <section className="team-section">
          <div className="container">
            <h2 className="section-title-white">Dance Team</h2>
            <p className="section-subtitle-white">Наши преподаватели — профессионалы своего дела</p>
            <TeamSlider />
          </div>
        </section>

        <section className="contacts-section">
          <div className="container">
            <h2 className="section-title-center">Контактная информация</h2>
            
            <div className="contacts-grid">
              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <h3 className="contact-title">Адрес</h3>
                <p className="contact-text">г. Барнаул, ул. Танцевальная, 15</p>
                <p className="contact-text">ТЦ "Ритм", 3 этаж</p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h3 className="contact-title">Телефон</h3>
                <p className="contact-text">+7 (3852) 123-456</p>
                <p className="contact-text">+7 (999) 888-77-66</p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">✉️</div>
                <h3 className="contact-title">Email</h3>
                <p className="contact-text">info@danceroom.ru</p>
                <p className="contact-text">support@danceroom.ru</p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">🕒</div>
                <h3 className="contact-title">Режим работы</h3>
                <p className="contact-text">Пн-Пт: 10:00 - 22:00</p>
                <p className="contact-text">Сб-Вс: 11:00 - 21:00</p>
              </div>
            </div>

            <div className="leadership">
              <h3 className="subsection-title-center">Руководство</h3>
              <div className="leadership-grid">
                {leadership.map(leader => (
                  <div key={leader.id} className="leader-card">
                    <div className="leader-image-wrapper">
                      <img src={leader.image} alt={leader.name} className="leader-image" />
                    </div>
                    <div className="leader-info">
                      <p className="leader-role">{leader.role}</p>
                      <p className="leader-name">{leader.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
