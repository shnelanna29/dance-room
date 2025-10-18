import React from 'react';
import './ScheduleCard.css';

const ScheduleCard = ({ lesson, onBook }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="schedule-card" style={{ borderLeftColor: lesson.color }}>
      <div className="schedule-header">
        <div className="schedule-date">
          <span className="schedule-day">{lesson.day}</span>
          <span className="schedule-date-text">{formatDate(lesson.date)}</span>
        </div>
        <div className="schedule-time">{lesson.time}</div>
      </div>
      
      <div className="schedule-content">
        <h3 className="schedule-style" style={{ color: lesson.color }}>
          {lesson.style}
        </h3>
        <p className="schedule-teacher">Преподаватель: {lesson.teacher}</p>
      </div>

      <button 
        className="schedule-btn"
        style={{ background: `linear-gradient(135deg, ${lesson.color}, ${lesson.color}dd)` }}
        onClick={() => onBook(lesson)}
      >
        Записаться
      </button>
    </div>
  );
};

export default ScheduleCard;
