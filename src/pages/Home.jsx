import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import StylesSlider from '../components/sliders/StylesSlider';
import ReviewsSlider from '../components/sliders/ReviewsSlider';
import { trialLessonSchema } from '../utils/validationSchemas';
import { danceStyles } from '../data/mockData';
import { getReviews } from '../services/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(trialLessonSchema)
  });

  // GET запрос - загрузка отзывов при монтировании компонента
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка загрузки отзывов:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const onSubmit = (data) => {
    alert(`Спасибо, ${data.name}! Мы свяжемся с вами по номеру ${data.phone} для подтверждения записи на ${data.style}.`);
    reset();
  };

  return (
    <div className="page">
      <Header />
      
      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Танцуй свою историю с <span className="gradient-text">Dance Room</span>
              </h1>
              <p className="hero-subtitle">
                Профессиональная студия современных танцев в Барнауле. 
                Раскройте свой потенциал вместе с лучшими хореографами города!
              </p>
              <div className="hero-buttons">
                <Button 
                  className="hero-btn-primary"
                  onClick={() => document.getElementById('trial-form').scrollIntoView({ behavior: 'smooth' })}
                >
                  Пробное занятие
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/about')}
                >
                  Узнать подробнее о нас
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="trial-section" id="trial-form">
          <div className="container">
            <div className="section-header-center">
              <h2 className="section-title">Запишитесь на пробное занятие</h2>
              <p className="section-subtitle">Первое занятие бесплатно! Выберите стиль и приходите</p>
            </div>

            <form className="trial-form" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Ваше имя"
                placeholder="Введите ваше имя"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="Номер телефона"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                {...register('phone')}
                error={errors.phone?.message}
              />

              <div className="input-wrapper">
                <label className="input-label">Выберите стиль танца</label>
                <select 
                  className={`input-field ${errors.style ? 'input-error' : ''}`}
                  {...register('style')}
                >
                  <option value="">Выберите стиль</option>
                  {danceStyles.map(style => (
                    <option key={style.id} value={style.name}>{style.name}</option>
                  ))}
                </select>
                {errors.style && <span className="error-message">{errors.style.message}</span>}
              </div>

              <Button type="submit" fullWidth>
                Записаться на пробное занятие
              </Button>
            </form>
          </div>
        </section>

        <section className="styles-section">
          <div className="container">
            <div className="section-header-center">
              <h2 className="section-title">Наши направления</h2>
              <p className="section-subtitle">Выберите стиль, который подходит именно вам</p>
            </div>
            <StylesSlider />
          </div>
        </section>

        <section className="reviews-section">
          <div className="container">
            <div className="section-header-center">
              <h2 className="section-title">Отзывы наших учеников</h2>
              <p className="section-subtitle">Узнайте, что говорят о нас</p>
            </div>
            
            {loading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Загрузка отзывов...</p>
              </div>
            )}
            
            {error && (
              <div className="error-message-block">
                <p>⚠️ Ошибка загрузки: {error}</p>
                <Button onClick={() => window.location.reload()}>
                  Попробовать снова
                </Button>
              </div>
            )}
            
            {!loading && !error && reviews.length > 0 && (
              <ReviewsSlider reviews={reviews} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
