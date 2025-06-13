'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, PenToolIcon as Tool, Wrench, HardHat, Clock, ArrowRight } from 'lucide-react';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import MateyExpression from '@/components/custom/MateyExpression';

export default function DemoPlaceholder() {
  const [isClicked, setIsClicked] = useState(false);

  const handlePlayClick = () => {
    setIsClicked(true);
  };

  const features = [
    {
      icon: Tool,
      title: 'Tool Picks That Stick',
      description: "Gear you'll grab often. No Fluff, just what works",
    },
    {
      icon: Wrench,
      title: 'Step-by-Step Help',
      description: 'Plain tips, no guessing. Sorted from start to finish',
    },
    {
      icon: HardHat,
      title: 'Don’t Skip Safety',
      description: "Gloves on, goggles ready. Let's keep all ten fingers",
    },
    {
      icon: Clock,
      title: 'Save Cash, Skip Clutter',
      description: "No more dusty tools. Only buy what you'll use.",
    },
  ];

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='grid md:grid-cols-2 gap-3 lg:gap-5 p-4 sm:p-6 md:p-8 rounded-3xl'>
        {/* Left side - Content */}
        <div className='flex flex-col justify-center space-y-6'>
          <div>
            <div className='h-16 flex justify-center sm:h-20'>
              <TypewriterEffectSmooth
                words={[
                  {
                    text: 'Getting Started’s Easy, Mate',
                    className: 'text-lg sm:text-3xl font-bold text-gray-800',
                  },
                ]}
                cursorClassName='bg-orange h-8 sm:h-10'
              />
            </div>

            <p className='text-gray-600 text-base sm:text-lg leading-relaxed'>
              Matey lines you up with the right gear and shows you how to use it. No waffle, no jargon. Just real help
              from your local DIY legend. Hit play and see how easy it is to get started.
            </p>
          </div>

          {/* Feature cards - Visible on all devices with responsive layout */}
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-3 mt-2'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-lighterYellow p-3 sm:p-4 rounded-xl shadow-sm border border-orange/20 hover:border-orange/40 hover:shadow-md transition-all duration-300 group'>
                <div className='flex gap-3 items-start'>
                  <div className='bg-orange/10 p-2 rounded-lg group-hover:bg-orange/20 transition-colors'>
                    <feature.icon className='h-5 w-5 sm:h-6 sm:w-6 text-orange' />
                  </div>
                  <div className='flex flex-col items-start text-start'>
                    <span className='font-semibold text-gray-800 text-lg'>{feature.title}</span>
                    <p className='text-base sm:text-md text-gray-600 leading-snug'>{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Video */}
        <div className='relative rounded-2xl overflow-hidden shadow-lg border-orange/20 border bg-gray-100 h-full w-full'>
          <div className='aspect-video w-full h-full'>
            {!isClicked ? (
              <motion.div
                className='absolute inset-0 flex items-center justify-center cursor-pointer group'
                onClick={handlePlayClick}
                whileHover={{ scale: 1.01 }}>
                {/* Thumbnail image */}
                <div className='absolute inset-0 bg-gray flex items-center justify-center'></div>

                {/* Play button */}
                <motion.div
                  className='relative z-20 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange text-white shadow-xl group-hover:scale-110 transition-transform'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}>
                  <Play size={30} fill='white' className='ml-1' />
                </motion.div>

                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

                {/* Text overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='absolute bottom-6 left-0 right-0 text-center px-4'>
                  <p className='text-white text-lg sm:text-xl font-medium mb-1 sm:mb-2 drop-shadow-md'>
                    See Matey in Action
                  </p>
                  <p className='text-white/90 text-sm sm:text-base drop-shadow-md'>
                    Watch how easy it is to get started
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <AnimatePresence>
                <motion.div
                  className='absolute inset-0 flex flex-col items-center justify-center bg-white'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}>
                  {/* Matey expression */}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                    className='relative'>
                    <MateyExpression expression='2thumb' />
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    className='text-center mt-4 sm:mt-6 space-y-2 px-4'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}>
                    <p className='text-xl sm:text-2xl font-bold text-gray-800'>No worries, mate!</p>
                    <p className='text-base sm:text-lg text-gray-600 max-w-md mx-auto'>
                      While we're putting the final touches on the video, why not have a yarn with Matey below?
                    </p>

                    {/* CTA Button - Visible on all devices */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className='mt-4 sm:mt-6 px-5 py-2 sm:px-6 sm:py-3 bg-orange text-white rounded-full font-medium shadow-md hover:shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2 mx-auto'>
                      Chat with Matey
                      <ArrowRight className='w-4 h-4' />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
