'use client';
import { motion } from 'framer-motion';

interface MateyNavIconProps {
  expression?: 'laugh' | 'hello' | 'smile' | 'offer' | '1thumb' | '2thumb' | 'tool' | 'thinking';
  className?: string;
}

export function MateyNavIcon({ expression = 'smile', className = 'w-5 h-5' }: MateyNavIconProps) {
  return (
    <motion.div
      initial={false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}>
      <img
        src={`/assets/matey-emoji/${expression}.svg`}
        alt='Matey'
        className='w-full h-full'
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </motion.div>
  );
}
