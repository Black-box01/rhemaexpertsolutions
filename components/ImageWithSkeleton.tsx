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
  alt,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse z-10 ${className?.includes('rounded') ? className : ''}`} 
          aria-hidden="true"
        />
      )}
      <Image
        alt={alt}
        className={`${className || ''} transition-opacity duration-500 ease-in-out ${
          isLoading ? 'opacity-0 scale-105 blur-lg' : 'opacity-100 scale-100 blur-0'
        }`}
        onLoad={(e) => {
          setIsLoading(false);
          if (onLoad) onLoad(e);
        }}
        {...props}
      />
    </>
  );
}
