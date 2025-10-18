import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './StylesSlider.css';
import { danceStyles } from '../../data/mockData';

const StylesSlider = () => {
  return (
    <div className="styles-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {danceStyles.map((style) => (
          <SwiperSlide key={style.id}>
            <div className="style-card" style={{ borderColor: style.color }}>
              <div className="style-image-wrapper">
                <img src={style.image} alt={style.name} className="style-image" />
                <div className="style-overlay" style={{ background: `linear-gradient(135deg, ${style.color}dd, ${style.color}99)` }}>
                  <h3 className="style-name">{style.name}</h3>
                </div>
              </div>
              <div className="style-content">
                <p className="style-description">{style.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default StylesSlider;
