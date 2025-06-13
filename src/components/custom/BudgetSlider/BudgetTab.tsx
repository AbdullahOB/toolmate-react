'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, X, Info, Briefcase, Wrench, Settings } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface BudgetTabProps {
  onSelect: (tier: string) => void;
  baseCost: number;
  onCancel: () => void;
  location: string;
}

export default function BudgetTab({ onSelect, onCancel, location }: BudgetTabProps) {
  const { isOpen, setIsOpen } = useAppContext();
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTierExplanation, setSelectedTierExplanation] = useState<{
    label: string;
    explanation: string;
  } | null>(null);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const budgetTiers = [
    {
      id: 'matesChoice',
      label: "Mate's Choice",
      description: 'Just the basics to get it done.',
      factor: 0.8,
      explanation:
        "This one's your no-fuss setup — no fancy extras, just solid tools that'll handle the job. Good if you've already got a few bits at home.",
      bgColor: 'bg-stone-50',
      borderColor: 'border-stone-200',
      icon: 'briefcase',
    },
    {
      id: 'buildersPick',
      label: "Builder's Pick",
      description: 'Balanced gear with no fuss.',
      factor: 1.0,
      explanation:
        "A solid middle-ground setup with reliable tools that'll make the job smoother. Perfect if you want quality without going overboard.",
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      icon: 'toolbox',
    },
    {
      id: 'tradiesDream',
      label: "Tradie's Dream",
      description: 'Top tools for a smooth ride.',
      factor: 1.3,
      explanation:
        'Premium gear that the pros would choose. Makes the job easier with better features and durability. Worth it if you want the best experience.',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: 'wrench-toolbox',
    },
  ];

  const handleSelect = (tierId: string) => {
    setStep(3);
    setTimeout(() => {
      setIsOpen(false);
      onSelect(tierId);
      setStep(0);
    }, 1500);
  };

  const handleWhyThisClick = (tier: { label: string; explanation: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTierExplanation(tier);
  };

  const containerVariants = {
    closed: {
      x: 'calc(100% - 40px)',
      transition: isMobile ? { type: 'tween', duration: 0.3, ease: 'easeOut' } : { type: 'spring', damping: 20 },
    },
    open: {
      x: '0%',
      transition: isMobile ? { type: 'tween', duration: 0.3, ease: 'easeOut' } : { type: 'spring', damping: 20 },
    },
  };

  const contentVariants = {
    closed: {
      opacity: 0,
      scaleX: 0,
      transition: { duration: isMobile ? 0.2 : 0.3 },
    },
    open: {
      opacity: 1,
      scaleX: 1,
      transition: { duration: isMobile ? 0.2 : 0.3, delay: isMobile ? 0.1 : 0 },
    },
  };

  const buttonHoverProps = isMobile
    ? {}
    : {
        whileHover: { x: -5 },
        whileTap: { scale: 0.95 },
      };

  const tierButtonProps = isMobile
    ? {
        whileTap: { scale: 0.98 },
      }
    : {
        whileTap: { scale: 0.98 },
      };

  const closeButtonProps = isMobile
    ? {
        whileTap: { scale: 0.9 },
      }
    : {
        whileHover: { scale: 1.1, rotate: 5 },
        whileTap: { scale: 0.9 },
      };

  const renderTierIcon = (iconType: string) => {
    switch (iconType) {
      case 'briefcase':
        return <Briefcase size={20} className='text-stone-600' />;
      case 'toolbox':
        return <Briefcase size={20} className='text-slate-600' />;
      case 'wrench-toolbox':
        return (
          <div className='relative'>
            <Settings size={20} className='text-amber-600' />
            <Wrench size={12} className='absolute -top-1 -right-1 text-amber-700' />
          </div>
        );
      default:
        return <Briefcase size={20} className='text-gray-600' />;
    }
  };

  return (
    <motion.div
      initial='closed'
      animate={isOpen ? 'open' : 'closed'}
      variants={containerVariants}
      className={`fixed right-0 ${location === '/' ? 'bottom-[70px]' : 'bottom-[180px]'} sm:bottom-24 z-10 flex`}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        perspective: 1000,
      }}>
      <motion.button
        {...buttonHoverProps}
        onClick={() => setIsOpen(!isOpen)}
        title='Adjust your project spend.'
        className='h-32 w-10 bg-yellow rounded-l-lg flex items-center justify-center shadow-lg'
        style={{ willChange: 'transform' }}>
        <span className='text-white font-bold -rotate-90 whitespace-nowrap'>Budget?</span>
      </motion.button>

      <motion.div
        variants={contentVariants}
        className='bg-white border-2 border-yellow rounded-bl-xl shadow-xl p-3 w-[300px] origin-left'
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}>
        {isOpen === true && step === 0 && (
          <div key='step0'>
            <div className='flex justify-between items-center mb-2'>
              <h3 className='font-bold text-md text-darkYellow'>How hard you wanna go, mate?</h3>
              <motion.button
                {...closeButtonProps}
                onClick={() => {
                  setIsOpen(false);
                  onCancel();
                }}
                className='bg-white/80 hover:bg-red-50 p-1.5 rounded-full shadow-sm border border-gray-200'
                aria-label='Close'
                style={{ willChange: 'transform' }}>
                <X size={16} className='text-gray-500' />
              </motion.button>
            </div>

            <div className='space-y-4'>
              {budgetTiers.map((tier, index) => (
                <motion.button
                  key={index}
                  {...tierButtonProps}
                  className={`p-4 w-full relative rounded-xl text-left font-medium transition-all duration-200 flex flex-col justify-between ${tier.bgColor} border-2 ${tier.borderColor} hover:shadow-md hover:border-opacity-100 hover:border-yellow/80 hover:bg-opacity-90`}
                  onClick={() => handleSelect(tier.id)}
                  style={{ willChange: 'transform' }}>
                  <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-3'>
                      {renderTierIcon(tier.icon)}
                      <div>
                        <div className='font-bold text-gray-800'>{tier.label}</div>
                        <div className='text-sm text-gray-600'>{tier.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-3 flex justify-between items-center'>
                    <div className='flex space-x-1'>
                      {[...Array(3)].map((_, dotIndex) => (
                        <span
                          key={dotIndex}
                          className={`inline-block w-2 h-2 rounded-full ${
                            dotIndex < index + 1 ? 'bg-gray-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={(e) => handleWhyThisClick({ label: tier.label, explanation: tier.explanation }, e)}
                      className='px-3 absolute right-0 -bottom-3 py-1 bg-white/70 hover:bg-white border border-gray-300 hover:border-yellow hover:border-2 rounded-full text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md'>
                      <Info size={10} />
                      Why this?
                    </button>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <motion.div
            key='step3'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: isMobile ? 0.3 : 0.6 }}
            className='text-center py-10'
            style={{ willChange: 'transform, opacity' }}>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: isMobile ? 0.4 : 0.6 }}
              className='mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4'
              style={{ willChange: 'transform' }}>
              <ThumbsUp size={40} className='text-white' />
            </motion.div>
            <h4 className='text-xl font-bold mb-2'>Ripper choice!</h4>
            <p className='text-gray-600'>I'll tailor the tools to that</p>
          </motion.div>
        )}
        {/* Explanation Modal */}
        <AnimatePresence>
          {selectedTierExplanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
              onClick={() => setSelectedTierExplanation(null)}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className='bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-yellow/20'
                onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 bg-yellow/20 rounded-full flex items-center justify-center'>
                      <Info size={16} className='text-yellow' />
                    </div>
                    <h3 className='font-bold text-lg text-darkYellow'>{selectedTierExplanation.label}</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedTierExplanation(null)}
                    className='bg-gray-100 hover:bg-red-50 p-2 rounded-full transition-colors'
                    aria-label='Close'>
                    <X size={16} className='text-gray-500' />
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className='space-y-4'>
                  <p className='text-gray-700 leading-relaxed'>{selectedTierExplanation.explanation}</p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className='bg-yellow/10 border border-yellow/20 rounded-lg p-3'>
                    <p className='text-sm text-gray-600 italic'>
                      💡 Matey's tip: Choose what feels right for your project and experience level.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
