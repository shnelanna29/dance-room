import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { cancelBookingSchema } from '../utils/validationSchemas';
import { useBookings, useRemoveBooking } from '../hooks/useBookings';
import { useCreateReview, useUpdateReview, useDeleteReview } from '../hooks/useReviews';
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
  const [cancelingId, setCancelingId] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const navigate = useNavigate();

  const { data: bookings = [] } = useBookings();
  const removeBookingMutation = useRemoveBooking();
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const { register: registerCancel, handleSubmit: handleCancelSubmit, formState: { errors: cancelErrors }, reset: resetCancel } = useForm({
    resolver: yupResolver(cancelBookingSchema)
  });

  const { register: registerReview, handleSubmit: handleReviewSubmit, formState: { errors: reviewErrors }, reset: resetReview, watch, setValue } = useForm({
    resolver: yupResolver(reviewSchema)
  });

  const rating = watch('rating', 0);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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
    removeBookingMutation.mutate(cancelingId, {
      onSuccess: () => {
        alert(`Запись отменена. Причина: ${data.reason}`);
        setCancelingId(null);
        resetCancel();
      },
    });
  };

  const onReviewSubmit = (data) => {
    const reviewData = {
      name: user.fullName,
      text: data.text,
      rating: parseInt(data.rating),
      email: user.email
    };

    if (editingReview) {
      updateReviewMutation.mutate(
        { id: editingReview.id, data: reviewData },
        {
          onSuccess: (updated) => {
            const updatedReviews = myReviews.map(r => 
              r.id === editingReview.id ? { ...updated, localId: r.localId } : r
            );
            setMyReviews(updatedReviews);
            localStorage.setItem('myReviews', JSON.stringify(updatedReviews));
            
            alert('Отзыв успешно обновлен!');
            setEditingReview(null);
            resetReview();
            setShowReviewForm(false);
          },
          onError: (err) => {
            alert(`Ошибка: ${err.message}`);
          },
        }
      );
    } else {
      createReviewMutation.mutate(reviewData, {
        onSuccess: (newReview) => {
          const reviewWithLocalId = {
            ...newReview,
            localId: Date.now()
          };
          
          const updatedReviews = [...myReviews, reviewWithLocalId];
          setMyReviews(updatedReviews);
          localStorage.setItem('myReviews', JSON.stringify(updatedReviews));
          
          alert('Спасибо за ваш отзыв! Он успешно добавлен.');
          resetReview();
          setShowReviewForm(false);
        },
        onError: (err) => {
          alert(`Ошибка: ${err.message}`);
        },
      });
    }
  };

  const handleDeleteReview = (review) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }

    deleteReviewMutation.mutate(review.id, {
      onSuccess: () => {
        const updatedReviews = myReviews.filter(r => r.localId !== review.localId);
        setMyReviews(updatedReviews);
        localStorage.setItem('myReviews', JSON.stringify(updatedReviews));
        alert('Отзыв успешно удален');
      },
      onError: (err) => {
        alert(`Ошибка удаления: ${err.message}`);
      },
    });
  };

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

  const isLoading = createReviewMutation.isPending || 
                     updateReviewMutation.isPending || 
                     deleteReviewMutation.isPending ||
                     removeBookingMutation.isPending;

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
                    {isLoading && <div className="api-loading">Отправка...</div>}
                    
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
                      <Button type="submit" disabled={isLoading}>
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
                          <Button variant="outline" onClick={() => handleDeleteReview(review)} disabled={isLoading}>
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
                                  <Button type="submit" variant="outline" disabled={isLoading}>
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
