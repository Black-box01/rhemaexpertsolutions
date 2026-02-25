'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageWithSkeleton from './ImageWithSkeleton';

interface ImageGridProps {
  images: string[];
  title?: string;
  description?: string;
}

export default function ImageGrid({ images, title, description }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="py-8">
      {title && <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">{title}</h3>}
      {description && <p className="text-gray-700 text-center mb-8 max-w-2xl mx-auto">{description}</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <div 
            key={index} 
            className="relative aspect-video cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gray-100"
            onClick={() => setSelectedImage(src)}
          >
            <ImageWithSkeleton
              src={src}
              alt={`Project Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage}
              alt="Project Full View"
              fill
              className="object-contain"
            />
            <button 
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
