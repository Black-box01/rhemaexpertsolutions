'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithSkeletonProps extends ImageProps {
  containerClassName?: string;
}

export default function ImageWithSkeleton({
  className,
  containerClassName,
  onLoad,
  onError,
  alt,
  width,
  height,
  fill,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Determine wrapper style based on fill vs width/height
  const wrapperStyle = fill 
    ? { position: 'relative', width: '100%', height: '100%' } as const
    : { position: 'relative', display: 'inline-block', width, height } as const;

  const [isFullScreen, setIsFullScreen] = useState(false);

  const openFullScreen = () => {
    if (!hasError && !isLoading) {
      setIsFullScreen(true);
    }
  };

  const closeFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullScreen(false);
  };

  return (
    <>
      <div 
        className={`${containerClassName} cursor-pointer`} 
        style={wrapperStyle}
        onClick={openFullScreen}
      >
        {isLoading && !hasError && (
          <div 
            className={`absolute inset-0 bg-gray-200 animate-pulse z-10 flex items-center justify-center ${className?.includes('rounded') ? className : ''}`} 
            aria-hidden="true"
          >
            <svg className="w-8 h-8 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {hasError ? (
          <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 ${className || ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <Image
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            className={`${className || ''} transition-opacity duration-500 ease-in-out ${
              isLoading ? 'opacity-0 scale-105 blur-lg' : 'opacity-100 scale-100 blur-0'
            }`}
            onLoad={(e) => {
              setIsLoading(false);
              if (onLoad) onLoad(e);
            }}
            onError={(e) => {
              setIsLoading(false);
              setHasError(true);
              if (onError) onError(e);
            }}
            {...props}
          />
        )}
      </div>

      {/* Full Screen Lightbox */}
      {isFullScreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={closeFullScreen}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
            onClick={closeFullScreen}
            aria-label="Close full screen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center">
             <Image
              src={props.src} // Use original src
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
