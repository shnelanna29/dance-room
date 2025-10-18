import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './TeamSlider.css';
import { teachers } from '../../data/mockData';

const TeamSlider = () => {
  return (
    <div className="team-slider">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 }
        }}
      >
        {teachers.map((teacher) => (
          <SwiperSlide key={teacher.id}>
            <div className="teacher-card">
              <div className="teacher-image-wrapper">
                <img src={teacher.image} alt={teacher.nickname} className="teacher-image" />
              </div>
              <div className="teacher-info">
                <h3 className="teacher-nickname">{teacher.nickname}</h3>
                <p className="teacher-style">{teacher.style}</p>
                <p className="teacher-experience">Стаж: {teacher.experience}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TeamSlider;
