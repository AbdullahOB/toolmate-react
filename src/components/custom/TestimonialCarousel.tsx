'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { FaStar } from 'react-icons/fa';

// Testimonial data with avatars
const testimonials = [
  {
    id: 1,
    name: 'Mike Thompson',
    location: 'Brisbane, QLD',
    avatar:
      'https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png',
    rating: 5,
    quote: 'Matey helped me pick the perfect drill for my kitchen reno. Saved me hours of research and a lot of cash!',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    location: 'Melbourne, VIC',
    avatar:
      'https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png',
    rating: 5,
    quote: 'As a first-timer, I was lost until Matey stepped in. The recommendations were spot on for my skill level.',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    location: 'Sydney, NSW',
    avatar:
      'https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png',
    rating: 5,
    quote: "Matey's advice on which sander to use for my deck project was gold. Finished in half the time I expected!",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-rotate functionality with pause on hover
  useEffect(() => {
    const startAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }

      if (isAutoPlaying) {
        autoPlayRef.current = setInterval(() => {
          setDirection(1);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000); // Change slide every 5 seconds
      }
    };

    startAutoPlay();

    // Clean up interval on component unmount
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex]);

  // Handle navigation
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    resetAutoPlay();
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    resetAutoPlay();
  };

  // Reset auto-rotation when manually changing slides
  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);

      if (isAutoPlaying) {
        autoPlayRef.current = setInterval(() => {
          setDirection(1);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000);
      }
    }
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 70) {
      setDirection(1);
      nextSlide();
    }

    if (touchStart - touchEnd < -70) {
      // Swipe right - previous slide
      setDirection(-1);
      prevSlide();
    }
  };

  // Pause auto-rotation on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className='w-full px-3 max-w-7xl mx-auto'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={carouselRef}>
      {/* Header section with title */}
      <div className='mb-6 text-center'>
        <div className='flex justify-center md:justify-start'>
          <h2 className='text-2xl md:ml-16 md:text-3xl font-bold text-gray-900'>Fair Dinkum Feedback</h2>
        </div>
        <div className='w-20 h-1 bg-orange mx-auto mt-2 rounded-full'></div>
      </div>

      <div
        className='relative'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        {/* Background decorative elements */}
        <div className='absolute -bottom-10 z-7 -right-10 w-40 h-40 bg-lighterYellow rounded-full opacity-30 hidden md:block'></div>
        {/* Star decorations */}
        <div className='absolute top-0 left-1/4 hidden md:block'>
          <Star className='h-8 w-8 text-orange opacity-10' />
        </div>
        <div className='absolute bottom-10 right-1/4 hidden md:block'>
          <Star className='h-6 w-6 text-orange opacity-10' />
        </div>
        <div className='absolute top-1/3 right-10 hidden md:block'>
          <Star className='h-5 w-5 text-orange opacity-10' />
        </div>
        {/* Navigation arrows - desktop only */}
        <div className='hidden md:block'>
          <button
            onClick={prevSlide}
            className='absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-orange-50 z-30 border border-orange-100'
            aria-label='Previous testimonial'>
            <ChevronLeft className='h-5 w-5 text-orange' />
          </button>
          <button
            onClick={nextSlide}
            className='absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-orange-50 z-30 border border-orange-100'
            aria-label='Next testimonial'>
            <ChevronRight className='h-5 w-5 text-orange' />
          </button>
        </div>

        {/* Testimonial cards */}
        <AnimatePresence initial={false} custom={direction} mode='wait'>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            className='w-full'>
            <div className='bg-whiteYellow rounded-2xl shadow-lg border border-orange-100 p-6 md:p-8 relative overflow-hidden'>
              {/* Decorative elements */}
              <div className='absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-50'></div>
              <div className='absolute bottom-0 left-0 w-24 h-24 bg-orange-50 rounded-full -ml-12 -mb-12 opacity-40'></div>

              {/* Quote marks */}
              <div className='absolute top-4 left-4 text-5xl text-orange opacity-20 font-serif'>"</div>
              <div className='absolute bottom-4 right-8 text-5xl text-orange opacity-20 font-serif rotate-180'>"</div>

              <div className='flex flex-col items-center text-center relative z-10'>
                {/* Avatar and user info */}
                <div className='mb-6'>
                  <div className='h-20 w-20 overflow-hidden rounded-full border-2 border-orange-100 shadow-md mb-3 mx-auto'>
                    <img
                      src={testimonials[currentIndex].avatar || '/placeholder.svg?height=80&width=80'}
                      alt={testimonials[currentIndex].name}
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <h3 className='font-bold text-gray-900 text-xl'>{testimonials[currentIndex].name}</h3>
                  <p className='text-sm text-gray-600 mb-2'>{testimonials[currentIndex].location}</p>
                  <div className='flex items-center justify-center gap-1'>
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <FaStar key={i} className='h-5 w-5 text-orange' />
                    ))}
                  </div>
                </div>
                {/* Quote */}
                <div className='max-w-2xl mx-auto'>
                  <p className='text-xl md:text-2xl font-medium text-gray-800 italic leading-relaxed'>
                    {testimonials[currentIndex].quote}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='mt-8 '>
        <div className='flex justify-center items-center'>
          <div className='flex gap-2'>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                  resetAutoPlay();
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-orange' : 'w-2.5 bg-orange/20 hover:bg-orange/30'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center mt-4 md:hidden'>
        <div className='flex items-center gap-2 bg-whiteYellow px-4 py-2 rounded-full shadow-sm border border-orange-100 text-gray-700'>
          <ChevronLeft className='h-4 w-4 text-orange animate-pulse' />
          <span className='text-sm font-medium'>Swipe for more testimonials</span>
          <ChevronRight className='h-4 w-4 text-orange animate-pulse' />
        </div>
      </div>
    </motion.div>
  );
}
