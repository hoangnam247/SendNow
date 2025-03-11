"use client"
import React, { useState, useEffect } from "react";

const useScrollMagic = (selector, animationClass) => {
    useEffect(() => {
      if (typeof window === "undefined") return; // Kiểm tra môi trường SSR
      
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;
  
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(animationClass);
            } else {
              entry.target.classList.remove(animationClass);
            }
          });
        },
        { threshold: 0.15 }
      );
  
      elements.forEach((el) => observer.observe(el));
      
      return () => elements.forEach((el) => observer.unobserve(el));
    }, [selector, animationClass]);
  };
  
  export default useScrollMagic;