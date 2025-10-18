import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { cancelBookingSchema } from '../utils/validationSchemas';
import { createReview, updateReview, deleteReview } from '../services/api';
import * as yup from 'yup';
import './Profile.css';

const reviewSchema = yup.object({
  text: yup
    .string()
    .required('Отзыв обязателен')
    .min(20, 'Отзыв должен содержать минимум 20 символов'),
  rating: yup
    .number()
    .required('Поставьте оценку')
    .min(1, 'Минимальная оценка - 1')
    .max(5, 'Максимальная оценка - 5')
}).required();

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [cancelingId, setCancelingId] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const { register: registerCancel, handleSubmit: handleCancelSubmit, formState: { errors: cancelErrors }, reset: resetCancel } = useForm({
    resolver: yupResolver(cancelBookingSchema)
  });

  const { register: registerReview, handleSubmit: handleReviewSubmit, formState: { errors: reviewErrors }, reset: resetReview, watch, setValue } = useForm({
    resolver: yupResolver(reviewSchema)
  });

  const rating = watch('rating', 0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const sortedBookings = storedBookings.sort((a, b) => 
      new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time)
    );
    setBookings(sortedBookings);

    // Загрузка отзывов пользователя из localStorage
    const storedReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
    setMyReviews(storedReviews);
  }, [isAuthenticated, navigate]);

  const groupByDate = () => {
    return bookings.reduce((groups, booking) => {
      const date = booking.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(booking);
      return groups;
    }, {});
  };

  const handleCancelClick = (bookingId) => {
    setCancelingId(bookingId);
  };

  const onCancelSubmit = (data) => {
    const updatedBookings = bookings.filter(b => b.id !== cancelingId);
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    alert(`Запись отменена. Причина: ${data.reason}`);
    setCancelingId(null);
    resetCancel();
  };

  // POST запрос - создание нового отзыва
  const onReviewSubmit = async (data) => {
    try {
      setApiLoading(true);
      setApiError(null);

      const reviewData = {
        name: user.fullName,
        text: data.text,
        rating: parseInt(data.rating),
        email: user.email
      };

      if (editingReview) {
        // PUT запрос - обновление существующего отзыва
        const updated = await updateReview(editingReview.id, reviewData);
        
        const updatedReviews = myReviews.map(r => 
          r.id === editingReview.id ? { ...updated, localId: r.localId } : r
        );
        setMyReviews(updatedReviews);
        localStorage.setItem('myReviews', JSON.stringify(updatedReviews));
        
        alert('Отзыв успешно обновлен!');
        setEditingReview(null);
      } else {
        // POST запрос - создание нового отзыва
        const newReview = await createReview(reviewData);
        
        const reviewWithLocalId = {
          ...newReview,
          localId: Date.now()
        };
        
        const updatedReviews = [...myReviews, reviewWithLocalId];
        setMyReviews(updatedReviews);
        localStorage.setItem('myReviews', JSON.stringify(updatedReviews));
        
        alert('Спасибо за ваш отзыв! Он успешно добавлен.');
      }

      resetReview();
      setShowReviewForm(false);
    } catch (err) {
      setApiError(err.message);
      alert(`Ошибка: ${err.message}`);
    } finally {
      setApiLoading(false);
    }
  };

  // DELETE запрос - удаление отзыва
  const handleDeleteReview = async (review) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }

    try {
      setApiLoading(true);
      setApiError(null);

      await deleteReview(review.id);

      const updatedReviews = myReviews.filter(r => r.localId !== review.localId);
      setMyReviews(updatedReviews);
      localStorage.setItem('myReviews', JSON.stringify(updatedReviews));

      alert('Отзыв успешно удален');
    } catch (err) {
      setApiError(err.message);
      alert(`Ошибка удаления: ${err.message}`);
    } finally {
      setApiLoading(false);
    }
  };

  // Функция для редактирования отзыва
  const handleEditReview = (review) => {
    setEditingReview(review);
    setValue('text', review.text);
    setValue('rating', review.rating);
    setShowReviewForm(true);
  };

  if (!user) return null;

  const groupedBookings = groupByDate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="page">
      <Header />
      
      <main className="profile-main">
        <div className="container">
          <h1 className="page-title-center">Личный кабинет</h1>

          <div className="profile-content">
            <div className="profile-left">
              <div className="profile-card">
                <h2 className="profile-card-title">Личная информация</h2>
                <div className="profile-info">
                  <div className="profile-info-item">
                    <span className="profile-label">ФИО:</span>
                    <span className="profile-value">{user.fullName}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-label">Дата рождения:</span>
                    <span className="profile-value">{new Date(user.birthDate).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-label">Телефон:</span>
                    <span className="profile-value">{user.phone}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-label">Почта:</span>
                    <span className="profile-value">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h2 className="profile-card-title">Абонемент</h2>
                <div className="profile-info">
                  <div className="profile-info-item">
                    <span className="profile-label">Номер абонемента:</span>
                    <span className="profile-value profile-highlight">{user.abonementNumber}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-label">Дата начала:</span>
                    <span className="profile-value">{new Date(user.abonementStart).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-label">Дата окончания:</span>
                    <span className="profile-value">{new Date(user.abonementEnd).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h2 className="profile-card-title">
                  {editingReview ? 'Редактировать отзыв' : 'Оставить отзыв'}
                </h2>
                {!showReviewForm ? (
                  <Button fullWidth onClick={() => setShowReviewForm(true)}>
                    Написать отзыв
                  </Button>
                ) : (
                  <form className="review-form" onSubmit={handleReviewSubmit(onReviewSubmit)}>
                    {apiLoading && <div className="api-loading">Отправка...</div>}
                    {apiError && <div className="api-error">Ошибка: {apiError}</div>}
                    
                    <div className="input-wrapper">
                      <label className="input-label">Ваш отзыв</label>
                      <textarea
                        className={`textarea-field ${reviewErrors.text ? 'input-error' : ''}`}
                        placeholder="Расскажите о вашем опыте в Dance Room..."
                        rows="5"
                        {...registerReview('text')}
                      />
                      {reviewErrors.text && <span className="error-message">{reviewErrors.text.message}</span>}
                    </div>

                    <div className="input-wrapper">
                      <label className="input-label">Оценка</label>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map(star => (
                          <label key={star} className="star-label">
                            <input
                              type="radio"
                              value={star}
                              {...registerReview('rating')}
                              className="star-radio"
                            />
                            <span className={`star-icon ${star <= rating ? 'star-filled' : ''}`}>★</span>
                          </label>
                        ))}
                      </div>
                      {reviewErrors.rating && <span className="error-message">{reviewErrors.rating.message}</span>}
                    </div>

                    <div className="review-actions">
                      <Button type="submit" disabled={apiLoading}>
                        {editingReview ? 'Обновить отзыв' : 'Отправить отзыв'}
                      </Button>
                      <Button variant="secondary" onClick={() => {
                        setShowReviewForm(false);
                        setEditingReview(null);
                        resetReview();
                      }}>
                        Отменить
                      </Button>
                    </div>
                  </form>
                )}

                {myReviews.length > 0 && (
                  <div className="my-reviews-list">
                    <h3 className="reviews-list-title">Мои отзывы</h3>
                    {myReviews.map(review => (
                      <div key={review.localId} className="my-review-item">
                        <div className="review-rating">
                          {[...Array(5)].map((_, index) => (
                            <span key={index} className={`star ${index < review.rating ? 'star-filled' : ''}`}>★</span>
                          ))}
                        </div>
                        <p className="review-text-preview">{review.text}</p>
                        <div className="review-item-actions">
                          <Button variant="outline" onClick={() => handleEditReview(review)}>
                            Редактировать
                          </Button>
                          <Button variant="outline" onClick={() => handleDeleteReview(review)}>
                            Удалить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-right">
              <div className="bookings-card">
                <h2 className="profile-card-title">Мои записи</h2>
                
                {bookings.length === 0 ? (
                  <div className="empty-bookings">
                    <p>У вас пока нет записей на занятия</p>
                    <Button onClick={() => navigate('/schedule')}>
                      Перейти к расписанию
                    </Button>
                  </div>
                ) : (
                  <div className="bookings-list">
                    {Object.entries(groupedBookings).map(([date, dateBookings]) => (
                      <div key={date} className="bookings-day">
                        <h3 className="bookings-date">{formatDate(date)}</h3>
                        {dateBookings.map(booking => (
                          <div key={booking.id} className="booking-item" style={{ borderLeftColor: booking.color }}>
                            <div className="booking-header">
                              <h4 className="booking-style" style={{ color: booking.color }}>
                                {booking.style}
                              </h4>
                              <span className="booking-time">{booking.time}</span>
                            </div>
                            <p className="booking-teacher">Преподаватель: {booking.teacher}</p>
                            <p className="booking-day">{booking.day}</p>
                            
                            {cancelingId === booking.id ? (
                              <form 
                                className="cancel-form" 
                                onSubmit={handleCancelSubmit(onCancelSubmit)}
                              >
                                <Input
                                  label="Причина отмены"
                                  placeholder="Укажите причину отмены записи"
                                  {...registerCancel('reason')}
                                  error={cancelErrors.reason?.message}
                                />
                                <div className="cancel-actions">
                                  <Button type="submit" variant="outline">
                                    Подтвердить отмену
                                  </Button>
                                  <Button 
                                    variant="secondary" 
                                    onClick={() => {
                                      setCancelingId(null);
                                      resetCancel();
                                    }}
                                  >
                                    Отменить
                                  </Button>
                                </div>
                              </form>
                            ) : (
                              <Button 
                                variant="outline" 
                                onClick={() => handleCancelClick(booking.id)}
                              >
                                Отменить запись
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
