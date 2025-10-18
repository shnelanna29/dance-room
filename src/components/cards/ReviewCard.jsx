import React from 'react';
import './ReviewCard.css';

const ReviewCard = ({ name, text, rating }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <h4 className="review-name">{name}</h4>
        <div className="review-rating">
          {[...Array(5)].map((_, index) => (
            <span key={index} className={`star ${index < rating ? 'star-filled' : ''}`}>
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="review-text">{text}</p>
    </div>
  );
};

export default ReviewCard;
