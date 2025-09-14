'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiteYouTubeEmbedProps {
  id: string;
  title: string;
  params?: string;
  noCookie?: boolean;
  className?: string;
}

export const LiteYouTubeEmbed: React.FC<LiteYouTubeEmbedProps> = ({
  id,
  title,
  params = '',
  noCookie = false,
  className,
}) => {
  const [iframe, setIframe] = useState(false);

  const videoId = encodeURIComponent(id);
  const posterUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const ytUrl = noCookie ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
  const iframeSrc = `${ytUrl}/embed/${videoId}?${params}`;

  const handlePlay = () => {
    setIframe(true);
  };

  return (
    <div
      className={cn(
        'relative w-full h-full bg-black overflow-hidden',
        !iframe && 'cursor-pointer',
        className
      )}
      onClick={handlePlay}
    >
      {!iframe && (
        <>
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <PlayCircle className="w-20 h-20 text-white/80 transition-all duration-300 hover:text-white hover:scale-110" />
          </div>
        </>
      )}
      {iframe && (
        <iframe
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-0"
        ></iframe>
      )}
    </div>
  );
};
