'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimatedMatey() {
  const [showMatey, setShowMatey] = useState(false);
  const [showHand, setShowHand] = useState(false);
  const [rotateHead, setRotateHead] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      setTimeout(() => {
        setShowMatey(true);
      }, 100);
      setTimeout(() => {
        setShowHand(true);
      }, 2100);
      setTimeout(() => {
        setRotateHead(true);
      }, 2300);
      setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => {
          setShowMatey(false);
          setShowHand(false);
          setRotateHead(false);
          setIsHiding(false);
        }, 500);
      }, 3000);
    };
    sequence();
    const interval = setInterval(sequence, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='absolute right-0 top-1/2 -translate-y-1/2 z-0 overflow-visible'>
      <AnimatePresence>
        {showMatey && (
          <div className='relative'>
            <motion.div
              initial={{ x: -150 }}
              animate={{ x: isHiding ? -150 : 50 }}
              exit={{ x: -150 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                duration: 0.5,
              }}
              className='relative'>
              <motion.img
                src='/assets/matey/head.png'
                alt='Character head'
                className='w-28 h-auto'
                initial={{ rotate: 0 }}
                animate={{
                  rotate: isHiding ? 0 : rotateHead ? 15 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 15,
                }}
              />
              {showHand && (
                <motion.img
                  src='/assets/matey/hand.png'
                  alt='Thumbs up'
                  className='absolute left-9 -bottom-10 w-12 h-auto'
                  initial={{ opacity: 0, y: 20, rotate: -20 }}
                  animate={{
                    opacity: isHiding ? 0 : 1,
                    y: isHiding ? 20 : 0,
                    rotate: isHiding ? -20 : 0,
                  }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
