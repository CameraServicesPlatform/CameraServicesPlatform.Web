// components/ImageSlider.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

const ImageSlider = ({ images }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Swiper spaceBetween={30} pagination={{ clickable: true }} navigation>
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
