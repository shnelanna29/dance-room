import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ScheduleCard from '../components/cards/ScheduleCard';
import Button from '../components/common/Button';
import { useSchedule } from '../hooks/useSchedule';
import { useAddBooking } from '../hooks/useBookings';
import './Schedule.css';

const Schedule = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [expandedDays, setExpandedDays] = useState({});
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: schedule = [], isLoading, isError, error } = useSchedule(weekOffset);
  const addBookingMutation = useAddBooking();

  React.useEffect(() => {
    if (schedule.length > 0) {
      const allDays = {};
      schedule.forEach(lesson => {
        allDays[lesson.date] = true;
      });
      setExpandedDays(allDays);
    }
  }, [schedule]);

  const handleBook = (lesson) => {
    if (!isAuthenticated) {
      alert('Для записи на занятие необходимо авторизоваться');
      navigate('/login');
      return;
    }

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const alreadyBooked = bookings.some(b => b.id === lesson.id);

    if (alreadyBooked) {
      alert('Вы уже записаны на это занятие');
      return;
    }

    addBookingMutation.mutate(lesson, {
      onSuccess: () => {
        alert(`Вы успешно записались на ${lesson.style} ${formatDate(lesson.date)} в ${lesson.time}`);
      },
      onError: (err) => {
        alert(`Ошибка записи: ${err.message}`);
      },
    });
  };

  const toggleDay = (date) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const toggleAllDays = (expand) => {
    const allDays = {};
    schedule.forEach(lesson => {
      allDays[lesson.date] = expand;
    });
    setExpandedDays(allDays);
  };

  const groupByDate = () => {
    return schedule.reduce((groups, lesson) => {
      const date = lesson.date;
      if (!groups[date]) {
        groups[date] = {
          lessons: [],
          day: lesson.day
        };
      }
      groups[date].lessons.push(lesson);
      return groups;
    }, {});
  };

  const getWeekTitle = () => {
    if (weekOffset === 0) return 'Текущая неделя';
    if (weekOffset === 1) return 'Следующая неделя';
    return `Через ${weekOffset} ${weekOffset < 5 ? 'недели' : 'недель'}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  const groupedSchedule = groupByDate();
  const allExpanded = Object.values(expandedDays).every(v => v);
  const allCollapsed = Object.values(expandedDays).every(v => !v);

  return (
    <div className="page">
      <Header />
      
      <main className="schedule-main">
        <div className="container">
          <div className="schedule-header-section">
            <h1 className="page-title">Расписание занятий</h1>
            <p className="page-subtitle">Выберите удобное время и запишитесь на занятие</p>
            <div className="week-indicator">{getWeekTitle()}</div>
          </div>

          {isLoading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Загрузка расписания...</p>
            </div>
          )}

          {isError && (
            <div className="error-message-block">
              <p>⚠️ Ошибка загрузки: {error.message}</p>
              <Button onClick={() => window.location.reload()}>
                Попробовать снова
              </Button>
            </div>
          )}

          {!isLoading && !isError && schedule.length > 0 && (
            <>
              <div className="schedule-controls">
                <Button 
                  variant="secondary" 
                  onClick={() => toggleAllDays(true)}
                  disabled={allExpanded}
                >
                  Развернуть все
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => toggleAllDays(false)}
                  disabled={allCollapsed}
                >
                  Свернуть все
                </Button>
              </div>

              <div className="schedule-by-days">
                {Object.entries(groupedSchedule).map(([date, data]) => (
                  <div key={date} className="day-section">
                    <button 
                      className={`day-header ${expandedDays[date] ? 'expanded' : ''}`}
                      onClick={() => toggleDay(date)}
                    >
                      <div className="day-header-info">
                        <span className="day-name">{data.day}</span>
                        <span className="day-date">{formatShortDate(date)}</span>
                      </div>
                      <div className="day-header-meta">
                        <span className="lessons-count">
                          {data.lessons.length} {data.lessons.length === 1 ? 'занятие' : 
                           data.lessons.length < 5 ? 'занятия' : 'занятий'}
                        </span>
                        <span className={`expand-icon ${expandedDays[date] ? 'rotated' : ''}`}>
                          ▼
                        </span>
                      </div>
                    </button>

                    <div className={`day-content ${expandedDays[date] ? 'expanded' : ''}`}>
                      <div className="day-lessons-grid">
                        {data.lessons.map(lesson => (
                          <ScheduleCard 
                            key={lesson.id}
                            lesson={lesson}
                            onBook={handleBook}
                            isBooking={addBookingMutation.isPending}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="schedule-actions">
                {weekOffset > 0 && (
                  <Button variant="secondary" onClick={() => setWeekOffset(weekOffset - 1)}>
                    ← Предыдущая неделя
                  </Button>
                )}
                <Button onClick={() => setWeekOffset(weekOffset + 1)}>
                  Следующая неделя →
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}; 

export default Schedule;
