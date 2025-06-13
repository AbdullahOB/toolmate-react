'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { CheckCircle, Mail, Send } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    setError('');
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className='relative overflow-hidden md:rounded-2xl py-12 px-8 md:px-16 bg-gradient-to-br from-orange/5  via-orange/10 to-orange/20 border border-orange/20'
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}>
      <div className='relative z-10 flex flex-col items-center text-center'>
        <motion.div className='mb-2 p-3 bg-orange/20 rounded-full inline-flex' variants={itemVariants}>
          <Mail className='text-orange w-6 h-6' />
        </motion.div>

        <motion.h3 className='text-2xl md:text-3xl font-bold text-orange mb-4' variants={itemVariants}>
          Stay Updated with ToolMate
        </motion.h3>

        <motion.p className='text-gray-600 mb-6 max-w-xl' variants={itemVariants}>
          Join 1000+ ToolMates learning how to save time, dodge dodgy gear, and nail their DIY. Plus the odd cheeky tip
          that actually helps.
        </motion.p>

        <AnimatePresence mode='wait'>
          {subscribed ? (
            <motion.div
              key='success'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className='flex items-center gap-2 text-orange font-semibold bg-orange/10 py-3 px-6 rounded-full'>
              <CheckCircle className='w-6 h-6' />
              <span>Thanks for subscribing!</span>
            </motion.div>
          ) : (
            <motion.form key='form' onSubmit={handleSubmit} variants={itemVariants} className='w-full max-w-md'>
              <div className='relative group'>
                <motion.div
                  className='absolute inset-0 bg-orange/20 rounded-full blur-md'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
                <input
                  type='email'
                  placeholder='Your Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full py-3 px-6 rounded-full bg-white/90 backdrop-blur-sm border border-orange/30 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/50 transition-all duration-300 shadow-sm'
                />
                <motion.button
                  type='submit'
                  className='absolute top-0 right-0 h-full px-6 rounded-full bg-orange text-white font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-300 flex items-center gap-2'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  Subscribe
                  <Send className='w-4 h-4' />
                </motion.button>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className='mt-2 text-red-500'>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NewsletterSignup;
