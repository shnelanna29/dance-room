import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ReviewsSlider.css';
import ReviewCard from '../cards/ReviewCard';

const ReviewsSlider = ({ reviews }) => {
  const displayReviews = React.useMemo(() => {
    return reviews?.slice(0, 10) || [];
  }, [reviews]);

  if (!displayReviews.length) {
    return <div>Отзывов пока нет</div>;
  }

  return (
    <div className="reviews-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {displayReviews.map((review) => (
          <SwiperSlide key={review.id}>
            <ReviewCard {...review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewsSlider;
