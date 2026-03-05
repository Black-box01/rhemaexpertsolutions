'use client';

import { useEffect, useRef, useState } from 'react';
import ImageWithSkeleton from './ImageWithSkeleton';

interface AutoScrollRowProps {
  images: string[];
  direction?: 'left' | 'right';
  speed?: number;
}

function AutoScrollRow({ images, direction = 'left', speed = 1 }: AutoScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Duplicate images to create seamless loop effect if needed, 
  // but for "manual scrolling" we usually just want a long list.
  // If we want true infinite scroll + manual, it's complex.
  // Let's stick to a simple auto-scrolling container that pauses on hover/touch.
  // "Manual scrolling" means the user can swipe/scroll it.
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Initialize scroll position for right direction
    if (direction === 'right' && scrollContainer.scrollLeft === 0) {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    }

    let animationId: number;
    
    const scroll = () => {
      if (!isPaused && scrollContainer) {
        if (direction === 'left') {
          scrollContainer.scrollLeft += speed;
          // Reset if reached end (for infinite loop effect, we'd need duplicated content)
          // For now, let's just bounce or restart? 
          // User asked for "three row auto and manual scrolling view".
          // Simple continuous scroll is best.
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
            scrollContainer.scrollLeft = 0;
          }
        } else {
          scrollContainer.scrollLeft -= speed;
          if (scrollContainer.scrollLeft <= 0) {
            scrollContainer.scrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          }
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused, direction, speed]);

  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto scrollbar-hide space-x-4 py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
    >
      {/* Duplicate images multiple times to ensure enough content for scrolling */}
      {[...images, ...images, ...images].map((src, idx) => (
        <div key={`${src}-${idx}`} className="flex-shrink-0 w-64 h-48 relative rounded-lg overflow-hidden shadow-md">
          <ImageWithSkeleton
            src={src}
            alt="Project Image"
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default function AutoScrollGallery({ images }: { images: string[] }) {
  // Split images into 3 chunks for 3 rows
  const chunkSize = Math.ceil(images.length / 3);
  const row1 = images.slice(0, chunkSize);
  const row2 = images.slice(chunkSize, chunkSize * 2);
  const row3 = images.slice(chunkSize * 2);

  return (
    <div className="space-y-6">
      <AutoScrollRow images={row1} direction="left" speed={0.5} />
      <AutoScrollRow images={row2} direction="right" speed={0.5} />
      <AutoScrollRow images={row3} direction="left" speed={0.5} />
    </div>
  );
}
