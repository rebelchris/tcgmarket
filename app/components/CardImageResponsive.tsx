"use client";

import { useMediaQuery } from '@kickass-coderz/react';
import Image from 'next/image';

interface CardImageResponsiveProps {
  src: string;
  alt: string;
  className?: string;
  hideMobile?: boolean;
  hideDesktop?: boolean;
}

export default function CardImageResponsive({ src, alt, className = '', hideMobile = false, hideDesktop = false }: CardImageResponsiveProps) {
  const { matches: isMobile } = useMediaQuery('(max-width: 1024px)', { initialValue: false });

  console.log(isMobile, hideMobile, hideDesktop)
  if (isMobile && hideMobile) return null;
  if (!isMobile && hideDesktop) return null;

  return (
    <>
      {/* Left: Card Image */}
      <div className="flex-shrink-0 p-6 border-r border-gray-100 flex flex-col items-center">
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={200}
            height={280}
            className="rounded-md shadow-sm"
          />
        ) : (
          <div className="w-[200px] h-[280px] bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div></>
  );
} 