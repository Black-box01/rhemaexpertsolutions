'use client';

import { useState, useEffect } from 'react';
import { RhemaNewsletter } from '@/types/supabase';

interface NewsTickerProps {
  newsletters: RhemaNewsletter[];
  interval?: number; // Time in ms between transitions
}

export default function NewsTicker({ newsletters, interval = 5000 }: NewsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (newsletters.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsletters.length);
    }, interval);

    return () => clearInterval(timer);
  }, [newsletters.length, interval, isHovered]);

  if (!newsletters || newsletters.length === 0) return null;

  const currentNews = newsletters[currentIndex];

  return (
    <div 
      className="mt-8 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden transition-all duration-500 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress Bar (Optional visual indicator) */}
      <div className="absolute bottom-0 left-0 h-1 bg-red-100 w-full">
         <div 
           className="h-full bg-red-500 transition-all duration-[5000ms] ease-linear"
           style={{ 
            //  width: isHovered ? '100%' : '0%', 
             transitionDuration: isHovered ? '0ms' : `${interval}ms`,
             width: isHovered ? `${((currentIndex + 1) / newsletters.length) * 100}%` : '100%',
             opacity: isHovered ? 0.5 : 1
           }}
           // A true progress bar requires a key-based reset or requestAnimationFrame. 
           // For simplicity, let's just use dots for navigation.
         ></div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full mr-2 animate-pulse">
              LATEST NEWS
            </span>
            <span className="text-gray-500 text-xs">
              {new Date(currentNews.created_at || '').toLocaleDateString()}
            </span>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex space-x-1">
            {newsletters.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  idx === currentIndex ? 'bg-red-600' : 'bg-gray-300 hover:bg-red-300'
                }`}
                aria-label={`Go to news item ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="transition-opacity duration-500 ease-in-out min-h-[80px] flex flex-col justify-center">
            {/* We use a key on the content wrapper to trigger a slight animation on change if we wanted, 
                but for smooth cross-fading we might need absolute positioning. 
                For "one after the other", a simple replace is often fine or a vertical slide.
            */}
            <h4 className="font-bold text-blue-900 text-sm mb-1 transition-all duration-300">
              {currentNews.title}
            </h4>
            <p className="text-gray-600 text-xs line-clamp-2 transition-all duration-300">
              {currentNews.content}
            </p>
        </div>
      </div>
    </div>
  );
}
