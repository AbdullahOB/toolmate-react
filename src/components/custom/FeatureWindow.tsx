'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type FeatureItemProps = {
  icon: string;
  title: string;
  desc: string;
  index: number;
};

const FeatureItem = ({ icon, title, desc, index }: FeatureItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className='group flex items-start gap-4 p-3 rounded-xl hover:bg-orange/5 transition-all duration-300 border border-transparent hover:border-orange/10'>
      <motion.div
        className='bg-gradient-to-br from-orange/20 to-yellow/20 p-3 rounded-xl flex-shrink-0 relative overflow-hidden'
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
        <div className='absolute inset-0 bg-gradient-to-br from-orange/10 to-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        <img src={icon || '/placeholder.svg'} alt={title} className='w-6 h-6 relative z-10' />
      </motion.div>

      <div className='text-start'>
        <p className='text-black font-semibold text-lg mb-1 group-hover:text-orange transition-colors duration-300'>
          {title}
        </p>
        <p className='text-gray-600'>{desc}</p>
      </div>
    </motion.div>
  );
};

export default function FeatureWindow() {
  const containerRef = useRef(null);
  const features = [
    {
      tag: 'Community',
      title: 'Find Your Crew',
      desc: 'Ask questions, swap tips, and learn from other DIYers',
      windowExampleImage: 'assets/icons/yellow-bg-1.svg',
      CTA: 'Find People Like You',
      featuresList: [
        {
          icon: '/assets/icons/orageGrid.svg',
          title: 'Community Q&A',
          desc: 'Got a question? Chuck it in. Others might’ve tackled the same job already.',
        },
        {
          icon: '/assets/icons/orangeMoon.svg',
          title: 'Real-World Tips',
          desc: 'Learn what’s worked for others. It’s DIY wisdom from folks who’ve been there.',
        },
      ],
    },
  ];

  return (
    <section className='pt-24 overflow-hidden relative' ref={containerRef}>
      {/* Background decorative elements */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <motion.div
          className='absolute top-20 left-20 w-64 h-64 rounded-full bg-orange/5 blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className='absolute bottom-40 right-20 w-80 h-80 rounded-full bg-yellow/5 blur-3xl'
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

    <div className='container mx-auto md:pb-32 px-4'>
        {/* Feature tabs with animated indicator */}
        <AnimatePresence mode='wait'>
          {features.map((feature, featureIndex) => (
            <motion.div
              key={featureIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className='w-full'>
              <div className='grid md:grid-cols-2 gap-12 items-center justify-center'>
                {/* Left side - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className='flex flex-col text-start gap-8 order-2 md:order-1'>
                  <div>
                    <div className='flex justify-center md:justify-start'>
                      <motion.div
                        className='inline-block bg-gradient-to-r from-orange/20 to-yellow/20 text-orange font-semibold px-6 py-2 rounded-full mb-4 border border-orange/10'
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                        {feature.tag}
                      </motion.div>
                    </div>
                    <div className='flex justify-center mt-5 md:justify-start'>
                      <motion.h2
                        className='font-bold text-3xl md:text-4xl lg:text-5xl text-black mb-4 leading-tight'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}>
                        {feature.title}
                      </motion.h2>
                    </div>
                    <motion.p
                      className='text-gray-600 text-center md:text-start text-xl mb-4'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}>
                      {feature.desc}
                    </motion.p>
                  </div>

                  <motion.div
                    className='space-y-2 w-full'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}>
                    {feature.featuresList.map((item, idx) => (
                      <FeatureItem key={idx} icon={item.icon} title={item.title} desc={item.desc} index={idx} />
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className='flex justify-center md:justify-start'>
                    <motion.a
                      href='/preview'
                      className='group inline-flex items-center gap-2 bg-gradient-to-r from-orange to-yellow text-white font-semibold px-8 py-4 rounded-full relative overflow-hidden'
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(255, 153, 0, 0.4)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                      <span className='relative z-10'>{feature.CTA}</span>
                      <motion.div
                        className='relative z-10'
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}>
                        <ArrowRight className='w-5 h-5' />
                      </motion.div>
                      <motion.div className='absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-yellow to-orange transition-opacity duration-300' />
                    </motion.a>
                  </motion.div>
                </motion.div>

                {/* Right side - Image */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className='relative order-1 md:order-2'>
                  <motion.div
                    className='absolute -inset-4 bg-gradient-to-br from-orange/10 to-yellow/10 rounded-3xl blur-lg'
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, -1, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                  <motion.div
                    className='relative z-10 rounded-2xl overflow-hidden shadow-xl border border-white/20'
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                    <div className='absolute inset-0 bg-gradient-to-br from-orange/5 to-yellow/5 z-0'></div>
                    <img
                      src={feature.windowExampleImage || '/placeholder.svg'}
                      className='w-full md:h-[345px] object-cover relative z-10'
                      alt={feature.title}
                    />

                    {/* Decorative elements */}
                    <motion.div
                      className='absolute top-0 left-0 w-32 h-32 bg-yellow/20 rounded-full blur-xl'
                      animate={{
                        scale: [1, 1.2, 1],
                        x: [0, -10, 0],
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                    />
                    <motion.div
                      className='absolute bottom-0 right-0 w-40 h-40 bg-orange/20 rounded-full blur-xl'
                      animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 10, 0],
                        y: [0, 10, 0],
                      }}
                      transition={{
                        duration: 7,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                    />

                    {/* Animated overlay pattern */}
                    <div className='absolute inset-0 bg-gradient-to-br from-orange/5 to-yellow/5 mix-blend-overlay z-20'></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-20"></div>
                  </motion.div>

                  {/* Floating badges */}
                  <motion.div
                    className='absolute -top-6 -left-6 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border-l-4 border-orange'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}>
                    <Zap className='w-4 h-4 text-orange' />
                    <span className='text-sm font-medium'>Community</span>
                  </motion.div>

                  <motion.div
                    className='absolute -bottom-6 -right-6 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border-l-4 border-yellow'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}>
                    <Star className='w-4 h-4 text-yellow' />
                    <span className='text-sm font-medium'>Workshops</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
