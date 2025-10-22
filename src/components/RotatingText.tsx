"use client";

import { useState, useEffect } from "react";

const slogans = [
  "Cep telefonu ve aksesuarlarında güvenilir adres",
  "En uygun fiyatlarla, en kaliteli hizmet",
  "Teknoloji tutkunlarının tercihi",
];

export default function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // Change text and fade in after a short delay
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slogans.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1
      className={`text-4xl md:text-6xl font-bold text-white drop-shadow-2xl max-w-4xl mx-auto transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {slogans[currentIndex]}
    </h1>
  );
}
