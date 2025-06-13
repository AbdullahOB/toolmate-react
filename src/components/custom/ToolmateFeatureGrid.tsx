'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, HammerIcon, ArrowRight, PenToolIcon as Tool, Lightbulb, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MateyExpression from './MateyExpression';
import { useMediaQuery } from '@/hooks/use-media-query';

/**
 * Collection of Aussie DIY tips from Matey
 */

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  action?: string;
  delay?: number;
  className?: string;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
};

/**
 * FeatureCard - Displays tool information with animations and hover effects
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  action,
  delay = 0,
  className = '',
  mobileOnly = false,
  desktopOnly = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const isMobile = useMediaQuery('(max-width: 768px)');

  // We'll handle visibility with CSS classes instead of not rendering at all
  const shouldHide = (mobileOnly && !isMobile) || (desktopOnly && isMobile);
  if (shouldHide) {
    className += ' hidden';
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden h-full rounded-3xl bg-card shadow-lg border border-border group transition-all duration-500 hover:shadow-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}>
      {/* Animated gradient border */}
      <motion.div
        className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
        style={{
          background: `linear-gradient(to right, transparent, ${color}40, transparent)`,
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: isHovered ? ['0% 0%', '100% 0%'] : '0% 0%',
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' }}
      />

      <div className={`p-6 ${isMobile ? 'py-5' : 'p-6'} h-full flex flex-col text-start gap-4`}>
        <div className={`flex items-center justify-between mb-2 ${isMobile ? 'mb-1' : 'mb-4'}`}>
          <div
            className={`p-4 rounded-2xl flex items-center justify-center group-hover:shadow-md transition-all duration-300 ${
              isMobile ? 'h-12 w-12' : 'h-16 w-16'
            }`}
            style={{ backgroundColor: `${color}15`, color: color }}>
            <Icon size={isMobile ? 24 : 32} />
          </div>
        </div>

        <h3
          className={`font-semibold text-foreground ${
            isMobile ? 'text-xl' : 'text-2xl'
          } leading-7 tracking-wide`}>
          {title}
        </h3>
        <p className={`text-muted-foreground ${isMobile ? 'text-base' : 'text-lg'}`}>{description}</p>

        {action && (
          <motion.div
            className='mt-auto'
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}>
            <button className='group flex items-center font-medium' style={{ color }}>
              {action}
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}>
                <ArrowRight size={18} className='ml-2' />
              </motion.span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Decorative elements */}
      <motion.div
        className='absolute bottom-0 right-0 w-32 h-32 rounded-full'
        style={{
          background: `radial-gradient(circle, ${color}20, ${color}05)`,
        }}
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          x: isHovered ? -10 : 0,
          y: isHovered ? -10 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </motion.div>
  );
};

/**
 * ImageCard - Displays project images with hover effects
 */
const ImageCard = ({
  image,
  index,
  desktopOnly = false,
}: {
  image: { src: string; alt: string };
  index: number;
  desktopOnly?: boolean;
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // We'll use CSS to hide instead of not rendering
  const shouldHide = desktopOnly && isMobile;

  return (
    <motion.div
      ref={cardRef}
      className='relative overflow-hidden h-full rounded-3xl group shadow-lg'
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}>
      <img
        src={image.src || '/placeholder.svg'}
        alt={image.alt}
        className='w-full h-full transition-transform duration-500 group-hover:scale-105'
      />
      <motion.div
        className='absolute bottom-0 left-0 right-0 p-6 text-white'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

/**
 * ToolmateFeatureGrid - Main component that displays a bento grid of DIY tools and tips
 */
const ToolmateFeatureGrid = () => {
  const bentoGridRef = useRef(null);
  const isGridInView = useInView(bentoGridRef, { once: true, margin: '-100px' });
  const isMobile = useMediaQuery('(max-width: 768px)');

  const projectImages = [
    {
      src: '/assets/images/matey_f3.png',
      alt: 'Workshop with tools',
      title: 'The Right Tools Make All the Difference',
      description:
        "Matey helps you find exactly what you need for your project, whether you're a weekend warrior or a seasoned DIYer. No more buying tools you'll never use again!",
    },
    {
      src: '/assets/images/matey_f1.png',
      alt: 'DIY project in progress',
      title: 'Step-by-Step Guidance That Actually Makes Sense',
      description:
        "Follow along with clear instructions that don't assume you're a professional tradie. Matey explains everything in plain English, no fancy jargon.",
    },
    {
      src: '/assets/images/matey_f2.png',
      alt: 'Tool collection',
      title: 'Build Your Tool Collection Smartly',
      description:
        "Stop wasting money on tools you don't need. Matey helps you invest in quality where it matters and save where it doesn't.",
    },
  ];

  return (
    <div className='w-full max-w-7xl mx-auto px-4 overflow-hidden'>
      {/* Heading Section */}
      <motion.div
        className='mb-8 md:mb-12 text-center'>
        <div className='flex justify-center'>
          <h2 className='text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6'>
            I'll <span className='text-orange'>Match</span> the Tools to Your Tasks
          </h2>
        </div>
        <p className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto'>
          No more wandering the hardware store guessing what you need. Matey's got your back with spot-on tool picks for
          any DIY task.
        </p>
      </motion.div>

      {/* Bento Grid - Responsive for both desktop and mobile */}
      <div
        ref={bentoGridRef}
        className={isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-1 md:grid-cols-12 gap-6 relative'}>
        {/* Desktop-specific content */}
        <div className={isMobile ? 'hidden' : 'md:col-span-8'}>
          <FeatureCard
            title='The Right Tools Make All the Difference'
            description="Matey helps you find exactly what you need for your project, whether you're a weekend warrior or a seasoned DIYer. No more buying tools you'll never use again!"
            icon={HammerIcon}
            color='#eab308' // yellow-500
            action='See examples'
            delay={0.1}
          />
        </div>

        <div className={isMobile ? 'hidden' : 'md:col-span-4'}>
          <ImageCard image={projectImages[0]} index={0} />
        </div>

        <div className={isMobile ? 'hidden' : 'md:col-span-6'}>
          <ImageCard image={projectImages[1]} index={1} />
        </div>

        <div className={isMobile ? 'hidden' : 'md:col-span-6 flex flex-col gap-6'}>
          <FeatureCard
            title='Chat with Matey'
            description='Have a yarn with Matey, your Aussie DIY sidekick who knows his way around tools and projects.'
            icon={MessageSquare}
            color='#f97316' // orange-500
            action='Start a chat'
          />
          <FeatureCard
            title='Step-by-Step Guidance That Actually Makes Sense'
            description="Follow along with clear instructions that don't assume you're a professional tradie. Matey explains everything in plain English, no fancy jargon."
            icon={Tool}
            color='#6366f1' // indigo-500
            action='Learn more'
          />
        </div>

        <div className={isMobile ? 'hidden' : 'md:col-span-8 flex flex-col gap-4'}>
          <FeatureCard
            title="Don't Just Build It, Build It Safe"
            description="Matey flags risky tools, dodgy methods, and gear you'll need to keep your fingers. Less guesswork, more confidence, and projects that don't end in bandages."
            icon={Shield}
            color='#15803d' // green-700
            action='Get recommendations'
          />
          <FeatureCard
            title='Advice That Matches Your Skills'
            description="Whether you're a first-timer or a weekend warrior, Matey tailors advice to your experience level. No more feeling out of your depth or bored with the basics."
            icon={Lightbulb}
            color='#00296b' // blue-900
            action='Learn more'
          />
        </div>

        <div className={isMobile ? 'hidden' : 'md:col-span-4'}>
          <ImageCard image={projectImages[2]} index={2} />
        </div>

        {/* Mobile-specific content */}
        {isMobile && (
          <>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <FeatureCard
                title='The Right Tools Make All the Difference'
                description="Matey helps you find exactly what you need for your project, whether you're a weekend warrior or a seasoned DIYer. No more buying tools you'll never use again!"
                icon={HammerIcon}
                color='#eab308' // yellow-500
                delay={0.1}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}>
              <FeatureCard
                title="Don't Just Build It, Build It Safe"
                description="Matey flags risky tools, dodgy methods, and gear you'll need to keep your fingers. Less guesswork, more confidence, and projects that don't end in bandages."
                icon={Shield}
                color='#15803d' // green-700
                delay={0.2}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}>
              <FeatureCard
                title='Advice That Matches Your Skills'
                description="Whether you're a first-timer or a weekend warrior, Matey tailors advice to your experience level. No more feeling out of your depth or bored with the basics."
                icon={Lightbulb}
                color='#00296b' // blue-900
                delay={0.3}
              />
            </motion.div>

            {/* CTA Button directly under the last card */}
            <motion.div
              className='mt-2'
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}>
              <Button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className='w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-xl shadow-lg hover:shadow-orange-200/50 transition-all duration-300'>
                <span className='text-base'>Chat with Matey</span>
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </motion.div>
          </>
        )}
      </div>

      {/* CTA Section - Shown on desktop only */}
      <motion.div
        className={`mt-12 rounded-3xl overflow-hidden relative ${isMobile ? 'hidden' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <div className='absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10' />
        <div className='relative p-8 border border-orange-100 rounded-3xl'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            <div className='flex items-center gap-4'>
              <MateyExpression expression='2thumb' />
              <div>
                <h3 className='text-2xl font-bold text-start text-foreground mb-2'>Sick of wasting time and cash?</h3>
                <p className='text-muted-foreground text-start'>
                  Tell Matey what you're tackling and he'll line you up right.
                </p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className='bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-6 rounded-xl shadow-lg hover:shadow-orange-200/50 transition-all duration-300'>
                <span className='text-lg'>Sort it with Matey</span>
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ToolmateFeatureGrid;
