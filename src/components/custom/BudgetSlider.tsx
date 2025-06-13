'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, DollarSign } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface BudgetSliderProps {
  onBudgetChange: (budget: number, tier: string) => void;
  isActive: boolean;
  onComplete: () => void;
  onCancel: () => void;
  revealPattern?: 'inline' | 'micro-quiz' | 'side-drawer' | 'popup';
  baseCost?: number;
  showBudget: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BudgetSlider({
  onBudgetChange,
  isActive,
  onComplete,
  onCancel,
  revealPattern = 'inline',
  baseCost = 100,
  showBudget,
}: BudgetSliderProps) {
  const [budget, setBudget] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTier, setCurrentTier] = useState('buildersPick');
  const [showSlider, setShowSlider] = useState(revealPattern === 'inline');
  const [showDrawer, setShowDrawer] = useState(revealPattern === 'side-drawer');
  const [showQuiz, setShowQuiz] = useState(revealPattern === 'micro-quiz');
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [mateyMessage, setMateyMessage] = useState('');
  const sliderRef = useRef<HTMLInputElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const { selectedBudget } = useAppContext();
  // Budget tiers with conversational labels
  const budgetTiers = [
    {
      id: 'matesChoice',
      range: [0, 33],
      label: "Mate's Choice",
      description: "Bare-bones kit that'll get the job done",
      factor: 0.8, // 80% of base cost
      color: 'bg-green-400',
    },
    {
      id: 'buildersPick',
      range: [34, 66],
      label: "Builder's Pick",
      description: 'Solid middle-ground with reliable tools',
      factor: 1.0, // 100% of base cost
      color: 'bg-yellow',
    },
    {
      id: 'tradiesDream',
      range: [67, 100],
      label: "Tradie's Dream",
      description: 'Bells and whistles for a proper job',
      factor: 1.3, // 130% of base cost
      color: 'bg-orange-400',
    },
  ];

  // Quiz questions
  const quizQuestions = [
    {
      id: 'tools',
      question: 'What tools do you already own?',
      options: ['None/very few', 'Basic toolkit', 'Quite a few', 'Professional set'],
    },
    {
      id: 'skill',
      question: 'How would you rate your DIY skills?',
      options: ['Complete beginner', 'Some experience', 'Confident DIYer', 'Professional/Tradie'],
    },
    {
      id: 'comfort',
      question: "What's your comfort level with spending on tools?",
      options: ['Bare minimum', 'Good value', 'Quality matters', 'Only the best'],
    },
  ];

  // Get current tier based on budget
  const getCurrentTier = () => {
    return budgetTiers.find((tier) => budget >= tier.range[0] && budget <= tier.range[1]) || budgetTiers[1];
  };

  // Calculate price based on tier and base cost
  const calculatePrice = (tier: (typeof budgetTiers)[0]) => {
    return Math.round(baseCost * tier.factor);
  };
  useEffect(() => {
    const tier = getCurrentTier();
    setCurrentTier(tier.id);
    onBudgetChange(budget, tier.id);
    if (isDragging) {
      const messages = [
        "That's the sweet spot for value!",
        "Ripper choice, that'll do the job nicely!",
        "Beauty! I'll adjust the kit for ya.",
        "Good call, I'll rejig the options.",
        'Solid pick there, mate!',
        "I'll sort the kit based on that.",
      ];
      setMateyMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
  }, [budget, isDragging, onBudgetChange, baseCost]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBudget = Number.parseInt(e.target.value);
    setBudget(newBudget);
  };

  //creative reveal
  useEffect(() => {
    setBudget(selectedBudget);
    setIsCompleted(true);
    onComplete();
    showBudget(false);
  }, [selectedBudget]);

  const handleSliderComplete = () => {
    setIsCompleted(true);
    onComplete();
    showBudget(false);
  };

  const handleSliderStart = () => {
    setIsDragging(true);
  };

  const handleSliderEnd = () => {
    setIsDragging(false);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answer,
    });

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz completed, show slider
      setShowQuiz(false);
      setShowSlider(true);

      // Set initial budget based on comfort answer
      if (answer === 'Bare minimum') setBudget(20);
      if (answer === 'Good value') setBudget(50);
      if (answer === 'Quality matters') setBudget(60);
      if (answer === 'Only the best') setBudget(85);
    }
  };

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
    if (!showDrawer) {
      setShowSlider(true);
    }
  };

  // Focus the slider when it becomes active
  useEffect(() => {
    if (isActive && sliderRef.current && showSlider) {
      setTimeout(() => {
        sliderRef.current?.focus();
      }, 500);
    }
  }, [isActive, showSlider]);

  if (!isActive) return null;

  // Micro-quiz reveal pattern
  if (showQuiz) {
    const currentQuestion = quizQuestions[quizStep];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, type: 'spring', damping: 15 }}
        className='w-full bg-gradient-to-r from-paleYellow to-white border-2 border-yellow rounded-xl p-4 shadow-lg mb-4 relative'
        style={{ borderRadius: '15px 25px 20px 30px' }}>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-bold text-lg text-darkYellow'>{currentQuestion.question}</h3>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCancel}
            className='bg-white/80 hover:bg-red-50 p-1.5 rounded-full shadow-sm border border-gray-200'
            aria-label='Cancel'>
            <X size={16} className='text-gray-500' />
          </motion.button>
        </div>

        <div className='grid grid-cols-1 gap-3 mt-4'>
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className='p-3 bg-white border-2 border-yellow/30 rounded-xl text-left font-medium hover:bg-yellow/10 transition-colors'
              onClick={() => handleQuizAnswer(currentQuestion.id, option)}>
              {option}
            </motion.button>
          ))}
        </div>

        <div className='flex justify-between mt-4 text-sm text-gray-500'>
          <span>
            Question {quizStep + 1} of {quizQuestions.length}
          </span>
          <span>{quizStep === quizQuestions.length - 1 ? 'Last question' : 'Almost there'}</span>
        </div>
      </motion.div>
    );
  }

  // Side-drawer reveal pattern
  if (revealPattern === 'side-drawer' && !showSlider) {
    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: showDrawer ? '0%' : 'calc(100% - 40px)' }}
        transition={{ type: 'spring', damping: 20 }}
        className='fixed right-0 top-1/3 z-10 flex'>
        <motion.button
          whileHover={{ x: -5 }}
          onClick={toggleDrawer}
          className='h-32 w-10 bg-yellow rounded-l-lg flex items-center justify-center shadow-lg'>
          <span className='text-white font-bold -rotate-90 whitespace-nowrap'>Budget?</span>
        </motion.button>

        {showDrawer && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '300px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className='bg-white border-2 border-yellow rounded-l-xl shadow-xl p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-bold text-lg text-darkYellow'>How hard you wanna go, mate?</h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDrawer(false)}
                className='bg-white/80 hover:bg-red-50 p-1.5 rounded-full shadow-sm border border-gray-200'
                aria-label='Close'>
                <X size={16} className='text-gray-500' />
              </motion.button>
            </div>

            <div className='space-y-4'>
              {budgetTiers.map((tier, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 w-full rounded-xl text-left font-medium transition-colors flex justify-between items-center ${
                    currentTier === tier.id
                      ? 'bg-yellow/20 border-2 border-yellow'
                      : 'bg-white border-2 border-yellow/30'
                  }`}
                  onClick={() => {
                    setBudget(tier.range[0] + Math.floor((tier.range[1] - tier.range[0]) / 2));
                    setCurrentTier(tier.id);
                  }}>
                  <div>
                    <div className='font-bold'>{tier.label}</div>
                    <div className='text-sm text-gray-600'>{tier.description}</div>
                  </div>
                  <div className='text-yellow font-bold'>${calculatePrice(tier)}</div>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSliderComplete}
              className='mt-4 w-full py-2 bg-yellow text-white font-bold rounded-full shadow-md'
              style={{ borderRadius: '20px 10px 25px 15px' }}>
              This works for me!
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  }
  return (
    <motion.div
      ref={sliderContainerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, type: 'spring', damping: 15 }}
      className='w-full bg-gradient-to-r from-paleYellow to-white border-2 border-yellow rounded-xl p-4 shadow-lg mb-4 relative'
      style={{ borderRadius: '15px 25px 20px 30px' }}>
      {!isCompleted ? (
        <>
          <div className='flex justify-between items-center mb-2'>
            <h3 className='font-bold text-lg text-darkYellow'>How hard you wanna go, mate?</h3>
            <div className='flex items-center gap-2'>
              <div className='bg-yellow p-1.5 rounded-full'>
                <Sparkles className='text-white' size={16} />
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
                className='bg-white/80 hover:bg-red-50 p-1.5 rounded-full shadow-sm border border-gray-200'
                aria-label='Cancel'>
                <X size={16} className='text-gray-500' />
              </motion.button>
            </div>
          </div>

          <p className='text-sm text-gray-600 mb-3'>
            {isDragging ? mateyMessage : "Drag it left or right and I'll rejig the kit on the fly."}
          </p>

          <div className='relative mb-6 mt-8 px-2'>
            {/* Tier markers */}
            <div className='absolute -top-6 left-0 right-0 flex justify-between'>
              {budgetTiers.map((tier, index) => (
                <div
                  key={index}
                  className='text-center'
                  style={{
                    position: 'absolute',
                    left: `${(tier.range[0] + tier.range[1]) / 2}%`,
                    transform: 'translateX(-50%)',
                  }}>
                  <motion.div
                    initial={{ opacity: 0.7 }}
                    animate={{
                      opacity: currentTier === tier.id ? 1 : 0.7,
                      scale: currentTier === tier.id ? 1.1 : 1,
                    }}
                    className={`font-bold text-sm ${currentTier === tier.id ? 'text-yellow' : 'text-gray-500'}`}>
                    {tier.label}
                  </motion.div>
                </div>
              ))}
            </div>

            <div className='h-3 bg-gray-200 rounded-full overflow-hidden flex'>
              {budgetTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`h-full ${tier.color} flex-1`}
                  style={{ maxWidth: `${tier.range[1] - tier.range[0]}%` }}
                />
              ))}

              <motion.div
                className='h-full bg-gradient-to-r from-yellow/80 to-softYellow/80 absolute top-0 left-0'
                initial={{ width: '50%' }}
                animate={{ width: `${budget}%` }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                style={{ borderRadius: '9999px' }}
              />
            </div>
            <input
              ref={sliderRef}
              type='range'
              min='0'
              max='100'
              step='1'
              value={budget}
              onChange={handleSliderChange}
              onMouseDown={handleSliderStart}
              onTouchStart={handleSliderStart}
              onMouseUp={handleSliderEnd}
              onTouchEnd={handleSliderEnd}
              onBlur={handleSliderEnd}
              className='absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer z-10'
              style={{ touchAction: 'none' }}
            />

            <motion.div
              className='absolute top-0 w-8 h-8 bg-white border-2 border-yellow rounded-full shadow-md transform -translate-y-1/2 cursor-grab'
              animate={{
                left: `${budget}%`,
                scale: isDragging ? 1.2 : 1,
                boxShadow: isDragging ? '0 0 0 3px rgba(255, 204, 0, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
              }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 300,
              }}
              style={{
                borderRadius: '60% 40% 50% 45%',
                transform: `translateX(-50%) translateY(-50%)`,
              }}>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-2 h-2 bg-yellow rounded-full' />
              </div>
            </motion.div>
          </div>

          {/* Current tier description */}
          <motion.div
            className='text-center mb-4'
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentTier}>
            <p className='text-sm text-gray-600'>{budgetTiers.find((t) => t.id === currentTier)?.description}</p>
          </motion.div>

          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-500'>Bargain</span>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{
                scale: isDragging ? [1, 1.05, 1] : 1,
                rotate: isDragging ? [-2, 2, 0] : 0,
              }}
              transition={{ duration: 0.3 }}
              className='px-4 py-1.5 bg-yellow text-white font-bold rounded-full shadow-md flex items-center gap-1'
              style={{ borderRadius: '15px 25px 10px 20px' }}>
              <DollarSign size={16} />
              {calculatePrice(budgetTiers.find((t) => t.id === currentTier) || budgetTiers[1])}
            </motion.div>
            <span className='text-sm text-gray-500'>Premium</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSliderComplete}
            className='mt-4 w-full py-2 bg-yellow text-white font-bold rounded-full shadow-md'
            style={{ borderRadius: '20px 10px 25px 15px' }}>
            This works for me!
          </motion.button>
        </>
      ) : (
        <div className='text-center py-2'>
          <p className='text-darkYellow font-bold'>
            Got it! {budgetTiers.find((t) => t.id === currentTier)?.label} it is!
          </p>
          <p className='text-sm text-gray-600'>Showing you the best tools in this bracket</p>
        </div>
      )}
    </motion.div>
  );
}
