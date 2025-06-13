'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActiveNavIndicatorProps {
  isActive: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ActiveNavIndicator({ isActive, className, children }: ActiveNavIndicatorProps) {
  return (
    <div className={cn('relative rounded-3xl overflow-hidden', className)}>
      {/* Active state background */}
      {isActive && (
        <motion.div
          layoutId='activeNavIndicator'
          className='absolute inset-0 bg-gradient-to-r from-orange to-yellow shadow-md -z-10'
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      {children}
    </div>
  );
}
