'use client';

import { Wrench, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import MateyExpression from './MateyExpression';
import { motion, useAnimationControls } from 'framer-motion';
import { useMobile } from '@/hooks/use-mobile';

const prompts = [
  'Need help patching a hole in the wall…',
  'Not sure what tool to grab?',
  'Wondering if that old drill still works…',
];

export default function QuickProjectPrompt() {
  const { setSelectedPrompt } = useAppContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputControls = useAnimationControls();
  const imageControls = useAnimationControls();
  const [displayedText, setDisplayedText] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMobile();

  // Memoize prompt data to prevent unnecessary re-renders
  const promptData = useMemo(
    () => [
      {
        title: 'Build a garden bed',
        description: "Give your backyard a glow-up, mate. We'll build a solid garden bed from scratch.",
        icon: <Sparkles className='h-5 w-5' />,
        color: 'from-yellow to-orange',
      },
      {
        title: 'Hang a mirror',
        description: "Don't just whack it up. I'll show ya how to hang it straight as a die, no dramas.",
        icon: <Wrench className='h-5 w-5' />,
        color: 'from-orange to-yellow',
      },
      {
        title: 'Mount a TV on the wall',
        description:
          "Let's get that telly on the wall so clean your mother-in-law'll be speechless. No mess. No stress.",
        icon: <Zap className='h-5 w-5' />,
        color: 'from-yellow to-orange',
      },
    ],
    []
  );

  // Optimize typing effect with useCallback
  const typeText = useCallback(async () => {
    if (typing) return;
    setTyping(true);
    setDisplayedText('');
    const prompt = prompts[currentPromptIndex];
    if (!prompt) return;

    // Batch updates for better performance
    let text = '';
    const chunkSize = 3; // Process characters in chunks for better performance
    for (let i = 0; i < prompt.length; i += chunkSize) {
      const chunk = prompt.slice(i, i + chunkSize);
      text += chunk;
      setDisplayedText(text);
      await new Promise((resolve) => setTimeout(resolve, 70));
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTyping(false);
    setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % prompts.length);
  }, [currentPromptIndex, typing]);

  useEffect(() => {
    typeText();
  }, [currentPromptIndex, typeText]);

  const handlePromptSelect = useCallback(
    (prompt = '') => {
      if (prompt === '') {
        if (inputRef.current) {
          setSelectedPrompt(inputRef.current.value);
        }
      } else {
        setSelectedPrompt(prompt);
      }
    },
    [setSelectedPrompt]
  );

  const promptVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleHoverStart = useCallback(() => {
    if (isMobile) return; // Skip animations on mobile
    setIsHovered(true);
    imageControls.start({
      y: [-5, 0, -5],
      transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
    });
  }, [imageControls, isMobile]);

  const handleHoverEnd = useCallback(() => {
    if (isMobile) return; // Skip animations on mobile
    setIsHovered(false);
    imageControls.stop();
  }, [imageControls, isMobile]);

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
    if (!isMobile) {
      // Reduce animations on mobile
      inputControls.start({
        scale: 1.02,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        transition: { duration: 0.3 },
      });
    }
  }, [inputControls, isMobile]);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
    if (!isMobile) {
      // Reduce animations on mobile
      inputControls.start({
        scale: 1,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: { duration: 0.3 },
      });
    }
  }, [inputControls, isMobile]);

  // Simplified background animations for mobile
  const backgroundAnimations = useMemo(() => {
    return {
      scale: isMobile ? [1, 1.05, 1] : [1, 1.2, 1],
      x: isMobile ? [0, 5, 0] : [0, 20, 0],
      y: isMobile ? [0, -5, 0] : [0, -20, 0],
      transition: {
        duration: isMobile ? 12 : 8,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'reverse',
      },
    };
  }, [isMobile]);

  // Render optimized prompt cards
  const renderPromptCards = useMemo(() => {
    return promptData.map((prompt, index) => (
      <motion.button
        key={index}
        variants={promptVariants}
        initial='hidden'
        animate='visible'
        whileHover={
          isMobile
            ? {}
            : {
                scale: 1.03,
                transition: { duration: 0.3 },
              }
        }
        onHoverStart={() => !isMobile && setHoveredIndex(index)}
        onHoverEnd={() => !isMobile && setHoveredIndex(null)}
        onClick={() => handlePromptSelect(prompt.title)}
        className='relative overflow-hidden group h-full'>
        {/* Decorative background elements - simplified for mobile */}
        {!isMobile && (
          <>
            <motion.div
              className='absolute -right-6 -top-6 w-24 h-24 rounded-full bg-yellow/10 z-0'
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }}
            />

            <motion.div
              className='absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-yellow/5 z-0'
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 7,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Base layer with texture */}
        <motion.div
          className='absolute inset-0 bg-white'
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 20%, rgba(255, 220, 150, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 180, 100, 0.08) 0%, transparent 50%)',
          }}
          initial={{
            borderRadius: index % 2 === 0 ? '20px 10px 25px 15px' : '15px 25px 10px 20px',
          }}
          animate={
            !isMobile
              ? {
                  borderRadius:
                    hoveredIndex === index
                      ? '25px 25px 25px 25px'
                      : index % 2 === 0
                      ? '20px 10px 25px 15px'
                      : '15px 25px 10px 20px',
                }
              : {}
          }
          transition={{ duration: 0.4 }}
        />

        {/* Animated border with depth - simplified for mobile */}
        <motion.div
          className='absolute inset-0'
          style={{
            background: `linear-gradient(135deg, rgba(255,220,150,0.5) 0%, rgba(255,180,100,0.2) 100%)`,
            padding: 2,
          }}
          initial={{
            borderRadius: index % 2 === 0 ? '20px 10px 25px 15px' : '15px 25px 10px 20px',
            boxShadow: 'inset 0 0 0 1px rgba(255, 220, 150, 0.3), 0 4px 20px rgba(255, 180, 100, 0.15)',
          }}
          animate={
            !isMobile
              ? {
                  borderRadius:
                    hoveredIndex === index
                      ? '25px 25px 25px 25px'
                      : index % 2 === 0
                      ? '20px 10px 25px 15px'
                      : '15px 25px 10px 20px',
                  boxShadow:
                    hoveredIndex === index
                      ? 'inset 0 0 0 1px rgba(255, 220, 150, 0), 0 10px 30px rgba(255, 180, 100, 0.25)'
                      : 'inset 0 0 0 1px rgba(255, 220, 150, 0.3), 0 4px 20px rgba(255, 180, 100, 0.15)',
                }
              : {}
          }
          transition={{ duration: 0.4 }}>
          <motion.div
            className='w-full h-full bg-white rounded-[inherit]'
            initial={{ opacity: 1 }}
            animate={
              !isMobile
                ? {
                    opacity: hoveredIndex === index ? 0.95 : 1,
                  }
                : {}
            }
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Animated border on hover - simplified for mobile */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${prompt.color} opacity-0 group-hover:opacity-100 rounded-xl`}
          style={{ padding: 2 }}
          initial={{
            borderRadius: index % 2 === 0 ? '20px 10px 25px 15px' : '15px 25px 10px 20px',
          }}
          animate={
            !isMobile
              ? {
                  borderRadius:
                    hoveredIndex === index
                      ? '25px 25px 25px 25px'
                      : index % 2 === 0
                      ? '20px 10px 25px 15px'
                      : '15px 25px 10px 20px',
                }
              : {}
          }
          transition={{ duration: 0.4 }}>
          <div className='w-full h-full bg-white rounded-[inherit]'></div>
        </motion.div>

        {/* Subtle accent line - only on desktop */}
        {!isMobile && (
          <motion.div
            className='absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-yellow/30 via-orange/20 to-yellow/30'
            initial={{ scaleX: 0.3, opacity: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          />
        )}

        <div className='relative z-10 p-5 flex items-center text-left'>
          <motion.div
            className='mr-4 p-2.5 bg-yellow/10 group-hover:bg-gradient-to-br from-yellow to-orange rounded-full transition-all duration-300'
            whileHover={!isMobile ? { rotate: [0, -10, 10, -5, 0] } : {}}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
            animate={
              !isMobile && hoveredIndex === index
                ? {
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            style={{
              boxShadow: '0 0 0 1px rgba(255, 220, 150, 0.2), 0 2px 8px rgba(255, 180, 100, 0.1)',
            }}>
            <div className='text-yellow group-hover:text-white transition-colors duration-300'>{prompt.icon}</div>
          </motion.div>

          <div>
            <motion.h3
              className='font-bold text-lg text-darkYellow group-hover:text-orange transition-colors duration-300 my-1'
              animate={
                !isMobile && hoveredIndex === index
                  ? {
                      y: [0, -2, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}>
              {prompt.title}
            </motion.h3>
            <p className='text-gray-800 text-base md:text-[14px]'>{prompt.description}</p>
          </div>

          <motion.div
            className='ml-auto'
            initial={{ x: 0 }}
            whileHover={!isMobile ? { x: 5 } : {}}
            animate={!isMobile && hoveredIndex === index ? { x: [0, 5, 0] } : { x: 0 }}
            transition={
              !isMobile && hoveredIndex === index
                ? {
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: 'reverse',
                  }
                : {}
            }>
            <motion.div
              className='p-2 rounded-full'
              animate={
                !isMobile && hoveredIndex === index
                  ? {
                      backgroundColor: ['rgba(255,220,150,0)', 'rgba(255,220,150,0.1)', 'rgba(255,220,150,0)'],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
              <ArrowRight className='h-5 w-5 text-yellow group-hover:text-orange transition-colors duration-300' />
            </motion.div>
          </motion.div>
        </div>
      </motion.button>
    ));
  }, [promptData, isMobile, hoveredIndex, handlePromptSelect]);

  return (
    <div className='w-full md:p-4'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className='w-full relative overflow-hidden rounded-2xl'>
        {/* Background elements - simplified for mobile */}
        <motion.div
          className='absolute inset-0 bg-gradient-to-br from-paleYellow/40 via-paleYellow/20 to-transparent backdrop-blur-md'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Animated background shapes - reduced complexity for mobile */}
        {!isMobile && (
          <>
            <motion.div
              className='absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow/10 blur-3xl'
              animate={backgroundAnimations}
            />
            <motion.div
              className='absolute bottom-0 left-0 w-72 h-72 rounded-full bg-orange/10 blur-3xl'
              animate={{
                scale: isMobile ? [1, 1.1, 1] : [1, 1.3, 1],
                x: isMobile ? [0, -5, 0] : [0, -20, 0],
                y: isMobile ? [0, 5, 0] : [0, 20, 0],
              }}
              transition={{
                duration: isMobile ? 15 : 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }}
            />
          </>
        )}

        {/* Main content container with integrated banner */}
        <div className='relative z-10 p-4 md:p-6'>
          {/* Header section with integrated message */}
          <div className='relative mb-6 md:mb-8 rounded-2xl overflow-hidden'>
            <div className='relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 p-4 md:p-6'>
              {/* Left side - Icon and title */}
              <div className='flex items-center gap-2 md:gap-6'>
                <motion.div
                  whileHover={!isMobile ? { rotate: 360, scale: 1.1 } : {}}
                  animate={!isMobile ? { rotate: [0, -5, 5, -5, 0] } : {}}
                  transition={{ duration: 1.5, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}>
                  <img src='/assets/matey-emoji/smile.svg' alt='Matey' className='w-20 object-cover rounded-full' />
                </motion.div>
                <div>
                  <h2 className='text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow to-orange bg-clip-text text-transparent mb-2'>
                    G'day, DIY Legend!
                  </h2>
                  <motion.p
                    className='text-md md:text-xl text-gray-600 text-start'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}>
                    Ready to get crackin' on your next ripper project?
                  </motion.p>
                </div>
              </div>

              {/* Quote bubble - Integrated into header */}
              <motion.div
                className='relative flex items-center md:max-w-xs'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}>
                <div className='relative bg-yellow/20 backdrop-blur-sm p-4 rounded-xl'>
                  <p className='text-base md:text-lg font-medium text-gray-800'>
                    "Reckon I can help with just about anything DIY. Give us a crack!"
                  </p>
                  <div className='absolute -bottom-4 -left-4 z-10 hidden md:block'>
                    <MateyExpression expression='2thumb' />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main content grid - Combines prompts and floating emojis */}
          <div className='relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
            {/* Project prompt cards */}
            {renderPromptCards}

            {/* Custom project card with integrated banner */}
            <motion.button
              variants={promptVariants}
              initial='hidden'
              animate='visible'
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
              onClick={() => handlePromptSelect()}
              className='relative overflow-hidden group h-full col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-white via-white to-lightOrange z-0' />

              {/* Simplified animations for mobile */}
              {!isMobile && (
                <motion.div
                  className='absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-orange to-yellow blur-3xl -mr-20 -mt-20 z-0'
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                />
              )}

              <div className='relative z-10 flex items-center md:flex-row flex-col-reverse justify-between p-6 sm:p-8 md:p-10 bg-white/80 backdrop-blur-sm rounded-3xl border border-orange/50 shadow-lg'>
                <div className='flex justify-start gap-4 flex-col items-center md:items-start max-w-full md:max-w-[60%]'>
                  <motion.p
                    className='font-bold text-3xl sm:text-4xl md:text-5xl text-center md:text-start bg-gradient-to-r from-orange to-yellow bg-clip-text text-transparent'
                    animate={
                      !isMobile
                        ? {
                            backgroundPosition: ['0% center', '100% center', '0% center'],
                          }
                        : {}
                    }
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }}>
                    Didn't see your project listed?
                  </motion.p>

                  <motion.p
                    className='text-gray-600 text-base md:text-start text-center sm:text-lg md:text-xl'
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: isHovered && !isMobile ? 1 : 0.8 }}>
                    Tell me what you're wrangling, and I'll line up what ya need. Doesn't matter how weird or wonky,
                    I've seen it all.
                  </motion.p>

                  <motion.div className='w-full relative' animate={inputControls}>
                    <motion.input
                      ref={inputRef}
                      type='text'
                      value={displayedText}
                      placeholder=' '
                      className='w-full h-12 sm:h-14 rounded-xl px-4 border-2 text-center md:text-start border-orange-200 text-gray-600 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all shadow-sm'
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      whileTap={!isMobile ? { scale: 0.98 } : {}}
                    />
                  </motion.div>
                </div>

                <div className='relative'>
                  {!isMobile && (
                    <motion.div
                      className='absolute inset-0 bg-gradient-to-br from-orange-200/40 to-yellow-200/40 rounded-full blur-md'
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                  <motion.img
                    src='/assets/matey/thinking.png'
                    alt='Thinking character'
                    className='relative z-10 w-24 h-24 sm:w-32 sm:h-32 md:w-52 md:h-52 object-contain'
                    animate={!isMobile ? imageControls : {}}
                    whileHover={
                      !isMobile
                        ? {
                            rotate: [0, -5, 5, 0],
                            transition: { duration: 0.5 },
                          }
                        : {}
                    }
                  />
                </div>
              </div>
            </motion.button>
          </div>
          {/* Footer message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className='mt-6 text-center'>
            <p className='text-md text-gray/70 italic'>
              <motion.span
                animate={
                  !isMobile
                    ? {
                        color: ['#6b7280', '#f59e0b', '#6b7280'],
                      }
                    : {}
                }
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className='font-medium'>
                Built For DIYers,
              </motion.span>{' '}
              Backed By Matey
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
