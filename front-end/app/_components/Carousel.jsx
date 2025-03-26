"use client"
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';

const Carousel = () => {
  const slides = [
    {
      id: 1,
      image: "/images/poster1.png",
      alt: "Poster 1",
    },
    {
      id: 2,
      image: "/images/poster2.png",
      alt: "Poster 2",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel Wrapper */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="flex-shrink-0 w-full">
            <Image
              src={slide.image}
              alt={slide.alt}
              width={800}
              height={400} 
              className="w-full aspect-[14/7] sm:aspect-[3/2] md:aspect-[14/8] lg:aspect-[20/9] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
      >
        <ChevronLeftIcon className="h-8 w-8 text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
      >
        <ChevronRightIcon className="h-8 w-8 text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-gray-400 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;