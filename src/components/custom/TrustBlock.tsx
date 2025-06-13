import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Rocket, MessageSquare, Sliders, Image, DollarSign } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

const glowVariants = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.2, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const TrustBlock = () => {
  return (
    <section className='py-16 bg-gradient-to-br from-paleYellow/30 via-paleYellow/20 to-paleYellow/10 relative overflow-hidden'>
      <div className='max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-12'>
          {/* Image Content */}
          <motion.div className='lg:w-1/2 flex justify-center lg:justify-start relative' variants={itemVariants}>
            <div className='absolute inset-0 bg-gradient-to-l from-paleYellow/20 to-transparent rounded-3xl' />
            <motion.img
              src='/assets/matey/helloing.svg'
              alt='Matey presenting ToolMate'
              className='max-w-md h-[300px] lg:h-[550px] relative z-10'
              whileHover={{
                scale: 1.05,
                rotate: [0, -1, 1, -1, 0],
                transition: { duration: 0.5 },
              }}
            />
          </motion.div>

          {/* Text Content */}
          <motion.div className='lg:w-1/2 mb-8 lg:mb-0 text-left' variants={itemVariants}>
            <div className='flex justify-center lg:justify-start'>
              <motion.div
                className='inline-flex items-center gap-2 bg-orange/10 px-4 py-2 rounded-full mb-6'
                whileHover={{ scale: 1.05 }}>
                <Sparkles className='w-5 h-5 text-orange' />
                <span className='text-orange font-medium'>Say G’day to Your New Favourite Mate</span>
              </motion.div>
            </div>

            <h2 className='text-4xl text-center lg:text-start font-bold text-orange mb-6 leading-tight'>
              Meet Matey, Your No-Bull DIY Sidekick
            </h2>

            <p className='text-gray-700 text-center lg:text-start text-lg mb-6 leading-relaxed'>
              Built right here in Australia, Matey’s the tool-smart mate who cuts the waffle, sorts your gear, and helps
              you build without stuffing it up. Whether you’re sealing a draught or decking out a shed, he’ll line up
              the right tools and keep things safe, cheap, and simple.
            </p>

            <div className='mb-8'>
              <motion.div
                className='flex items-center gap-4 bg-white/50 p-3 rounded-xl backdrop-blur-sm'
                whileHover={{ scale: 1.02 }}>
                <div className='bg-orange/10 p-2 rounded-lg'>
                  <MessageSquare className='w-6 h-6 text-orange' />
                </div>
                <p className='text-gray-700'>Chat straight from the homepage, no signup</p>
              </motion.div>

              <motion.div
                className='flex items-center gap-4 bg-white/50 p-3 rounded-xl backdrop-blur-sm'
                whileHover={{ scale: 1.02 }}>
                <div className='bg-orange/10 p-2 rounded-lg'>
                  <Shield className='w-6 h-6 text-orange' />
                </div>
                <p className='text-gray-700'>Aussie advice for real projects, not fluff</p>
              </motion.div>

              <motion.div
                className='flex items-center gap-4 bg-white/50 p-3 rounded-xl backdrop-blur-sm'
                whileHover={{ scale: 1.02 }}>
                <div className='bg-orange/10 p-2 rounded-lg'>
                  <Sliders className='w-6 h-6 text-orange' />
                </div>
                <p className='text-gray-700'>Budget slider that keeps it realistic</p>
              </motion.div>
              <motion.div
                className='flex items-center gap-4 bg-white/50 p-3 rounded-xl backdrop-blur-sm'
                whileHover={{ scale: 1.02 }}>
                <div className='bg-orange/10 p-2 rounded-lg'>
                  <Image className='w-6 h-6 text-orange' />
                </div>
                <p className='text-gray-700'>Send a pic and Matey’ll sort your gear</p>
              </motion.div>
              <motion.div
                className='flex items-center gap-4 bg-white/50 p-3 rounded-xl backdrop-blur-sm'
                whileHover={{ scale: 1.02 }}>
                <div className='bg-orange/10 p-2 rounded-lg'>
                  <DollarSign className='w-6 h-6 text-orange' />
                </div>
                <p className='text-gray-700'>Fair pricing for fixers and weekend legends</p>
              </motion.div>
            </div>

            <div className='flex justify-center lg:justify-start'>
              <motion.button
                className='bg-orange hover:bg-lightOrange text-white font-bold py-4 px-8 rounded-2xl transition-colors duration-300 shadow-lg shadow-orange/20 flex items-center gap-2 capitalize'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                Give it a Burl
                <Rocket className='w-5 h-5' />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustBlock;
