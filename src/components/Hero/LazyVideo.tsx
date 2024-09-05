'use client';
import React, { useEffect, useRef, useState } from 'react';

const LazyVideo = ({
  src,
  poster,
  props,
  className,
}: {
  src: string;
  poster?: string;
  props: React.VideoHTMLAttributes<HTMLVideoElement> | undefined;
  className?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const currentRef = videoRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect(); // Stop observing after the video starts loading
        }
      });
    });

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={videoRef}
      poster={poster}
      controls
      playsInline
      preload="metadata" // Load only video metadata initially
      className={className}
      {...props}
    >
      {isLoaded && <source src={src} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
};

export default LazyVideo;
