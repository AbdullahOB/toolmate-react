'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Hammer,
  Wrench,
  Droplet,
  PenTool,
  Star,
  Shield,
  Camera,
  DollarSign,
  Clock,
  HardHat,
} from 'lucide-react';
import PromptPreview from './PromptPreview';
import { FaTools } from 'react-icons/fa';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import MateyExpression from '@/components/custom/MateyExpression';

const projectsData = [
  {
    id: 'tv-mounting',
    title: 'Mounting a TV on Brick',
    description: "Didn't want it ripping out the wall. Matey sorted the right drill, anchors and safety tips.",
    icon: <Hammer className='w-6 h-6 text-orange' />,
    chat: [
      {
        id: '1',
        text: "G'day mate! How can I help with your project today?",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'hello',
      },
      {
        id: '2',
        text: 'I need to mount my new TV on a brick wall. Not sure what tools I need.',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: '3',
        text: "Righto! For brick walls, you'll need some special gear to get the job done proper.",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'thinking',
      },
      {
        id: '4',
        text: "You'll want to grab yourself a rotary hammer drill - a regular drill just won't cut the mustard on brick. And don't forget some masonry anchors to hold everything secure.",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'tool',
        isToolSuggestion: true,
        products: [
          {
            name: 'Rotary Hammer Drill',
            price: 120,
            assets: 'https://tryeasel.dev/placeholder.svg?width=200&height=150',
          },
          { name: 'Masonry Anchors', price: 25, assets: 'https://tryeasel.dev/placeholder.svg?width=200&height=150' },
        ],
      },
      { id: '5', text: 'Thanks! Do I need any special drill bits?', sender: 'user', timestamp: new Date() },
      {
        id: '6',
        text: 'Too right you do! Make sure you get masonry bits with carbide tips. And chuck on some safety glasses - brick dust in the eyes is no joke, mate!',
        sender: 'matey',
        timestamp: new Date(),
        expression: 'smile',
      },
      {
        id: '7',
        text: "Mark your spots with a pencil first, drill your holes a touch deeper than the anchors, and Bob's your uncle! Your telly will be up in no time.",
        sender: 'matey',
        timestamp: new Date(),
        expression: '2thumb',
      },
    ],
  },
  {
    id: 'leaky-tap',
    title: 'Fixing a Leaky Tap',
    description: 'Matey spotted the issue quick. Right washer, right tools, no more drip.',
    icon: <Droplet className='w-6 h-6 text-orange' />,
    chat: [
      {
        id: '1',
        text: "G'day! What can I help you with today?",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'hello',
      },
      {
        id: '2',
        text: "My kitchen tap's been dripping for days and it's driving me mad!",
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: '3',
        text: 'No worries, mate! A leaky tap is usually just a worn-out washer. Easy as to fix!',
        sender: 'matey',
        timestamp: new Date(),
        expression: 'smile',
      },
      {
        id: '4',
        text: "First things first, you'll need to turn off the water supply under the sink. Then you'll want to grab these tools to sort it out proper.",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'tool',
        isToolSuggestion: true,
        products: [
          {
            name: 'Adjustable Wrench',
            price: 15,
            assets: 'https://tryeasel.dev/placeholder.svg?width=200&height=150',
          },
          { name: 'Tap Washer Kit', price: 8, assets: 'https://tryeasel.dev/placeholder.svg?width=200&height=150' },
        ],
      },
      {
        id: '5',
        text: "I've got the tools, but how do I actually replace the washer?",
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: '6',
        text: "Fair dinkum question! Unscrew the tap handle (there's usually a decorative cap hiding the screw). Then use your wrench to loosen the tap bonnet and pull out the stem. The washer's right at the bottom - just pop the old one off and the new one on.",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'thinking',
      },
      {
        id: '7',
        text: "Put everything back together the way you found it, turn the water back on, and she'll be right as rain! No more drips to drive you bonkers.",
        sender: 'matey',
        timestamp: new Date(),
        expression: '2thumb',
      },
    ],
  },
  {
    id: 'deck-staining',
    title: 'Staining a Timber Deck',
    description: 'Matey talked me through the prep, the stain, and what holds up in Aussie weather.',
    icon: <Wrench className='w-6 h-6 text-orange' />,
    chat: [
      {
        id: '1',
        text: "G'day! What project are you tackling today?",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'hello',
      },
      {
        id: '2',
        text: "I want to stain my backyard deck. It's looking pretty weathered after summer.",
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: '3',
        text: "Beauty! A fresh stain will bring that deck back to life. But prep work is key, mate - can't skip that!",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'smile',
      },
      {
        id: '4',
        text: "For a ripper result, you'll need these tools to get the job done right.",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'tool',
        isToolSuggestion: true,
        products: [
          {
            name: 'Pressure Washer',
            price: 150,
            assets: 'https://tryeasel.dev/placeholder.svg?width=200&height=150',
          },
          {
            name: 'Deck Stain (UV Resistant)',
            price: 45,
            assets: 'https://tryeasel.dev/placeholder.svg?width=200&height=150',
          },
        ],
      },
      { id: '5', text: 'Should I sand the deck before staining?', sender: 'user', timestamp: new Date() },
      {
        id: '6',
        text: "Too right you should! Give it a once-over with 80-grit sandpaper to rough up the surface - helps the stain stick better. And make sure you pick a UV-resistant stain for our harsh Aussie sun, or you'll be doing this again before you know it!",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'thinking',
      },
      {
        id: '7',
        text: "Wait for a couple of dry days, apply two thin coats (not one thick one!), and you'll have the best-looking deck on the block. Perfect for those summer barbies!",
        sender: 'matey',
        timestamp: new Date(),
        expression: '2thumb',
      },
    ],
  },
  {
    id: 'wall-hole',
    title: 'Patching a Hole in the Wall',
    description: 'Matey sized up the damage, picked the right filler, and told me what to sand and paint.',
    icon: <PenTool className='w-6 h-6 text-orange' />,
    chat: [
      {
        id: '1',
        text: "G'day! What's the drama today?",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'hello',
      },
      {
        id: '2',
        text: "I've got a hole in my plasterboard wall from moving furniture. Need to fix it before the landlord inspection.",
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: '3',
        text: "No worries, mate! Patching a wall's not as hard as it looks. How big are we talking?",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'thinking',
      },
      {
        id: '4',
        text: "About the size of my fist. The plaster's cracked around it too.",
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: '5',
        text: "Right-o, for a hole that size, you'll need these tools to get it looking like new again.",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'tool',
        isToolSuggestion: true,
        products: [
          {
            name: 'Plasterboard Patch Kit',
            price: 18,
            assets: 'https://tryeasel.dev/placeholder.svg?width=200&height=150',
          },
          { name: 'Putty Knife', price: 10, assets: 'https://tryeasel.dev/placeholder.svg?width=200&height=150' },
        ],
      },
      {
        id: '6',
        text: "First, clean up any loose bits around the hole. Then apply your patch according to the kit instructions. Layer your filler, let it dry between coats, and sand it smooth. Once it's flush with the wall, prime it before painting to match.",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'smile',
      },
      {
        id: '7',
        text: "The landlord won't even know it was there, mate! Just make sure you match the paint color spot on.",
        sender: 'matey',
        timestamp: new Date(),
        expression: '2thumb',
      },
    ],
  },
  {
    id: 'toilet-seat',
    title: 'Replacing a Broken Toilet Seat',
    description:
      "Wasn't sure where to start. Matey showed me the fittings, the tools and how to get it sorted in ten minutes.",
    icon: <Wrench className='w-6 h-6 text-orange' />,
    chat: [
      {
        id: '1',
        text: "G'day! What can I help you with today?",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'hello',
      },
      {
        id: '2',
        text: 'My toilet seat is broken and I need to replace it. Never done this before.',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: '3',
        text: "No dramas! Replacing a dunny seat is one of the easiest bathroom fixes. You'll be done in 10 minutes flat.",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'smile',
      },
      {
        id: '4',
        text: "Here's what you'll need to get the job done.",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'tool',
        isToolSuggestion: true,
        products: [
          {
            name: 'Toilet Seat (Standard Size)',
            price: 35,
            assets: 'https://tryeasel.dev/placeholder.svg?width=200&height=150',
          },
          {
            name: 'Adjustable Wrench',
            price: 15,
            assets: 'https://tryeasel.dev/placeholder.svg?width=200&height=150',
          },
        ],
      },
      {
        id: '5',
        text: 'How do I know which size to get?',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: '6',
        text: "Good question! Most Aussie toilets take a standard size seat, but it's worth measuring the distance between the mounting holes just to be sure. They're usually about 15cm apart. And check if your toilet is round or elongated at the front.",
        sender: 'matey',
        timestamp: new Date(),
        expression: 'thinking',
      },
      {
        id: '7',
        text: "To remove the old one, look under the back of the bowl for plastic nuts. Unscrew those, lift off the old seat, pop the new one in place, and tighten the nuts. Bob's your uncle - job done!",
        sender: 'matey',
        timestamp: new Date(),
        expression: '2thumb',
      },
    ],
  },
];

const HowItWorks = () => {
  const [selectedProject, setSelectedProject] = useState(projectsData[0]);
  const [isHovering, setIsHovering] = useState(null);
  const scrollToChat = () => {
    const section = document.getElementById('chat');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: FaTools,
      title: 'Tool Picks That Stick',
      description: "Gear you'll grab often. No fluff, just what works",
    },
    {
      icon: Wrench,
      title: 'Step-by-Step Help',
      description: 'Plain tips, no guessing. Sorted from start to finish',
    },
    {
      icon: HardHat,
      title: "Don't Skip Safety",
      description: "Gloves on, goggles ready. Let's keep all ten fingers",
    },
    {
      icon: Clock,
      title: 'Save Cash, Skip Clutter',
      description: "No more dusty tools. Only buy what you'll use.",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  const cardVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
    hover: {
      scale: 1.03,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 400, damping: 15 },
    },
    tap: { scale: 0.98 },
  };

  const previewVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 15, delay: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='relative overflow-hidden'>
      {/* How It Works Introduction */}
      <motion.section
        className='py-16 bg-gradient-to-br from-paleYellow/40 via-paleYellow/20 to-transparent'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <motion.div
              className='inline-flex items-center justify-center gap-2 bg-orange/10 px-5 py-2.5 rounded-full mb-6'
              variants={titleVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <PenTool className='w-5 h-5 text-orange' />
              <span className='text-orange font-medium'>How Matey Works</span>
            </motion.div>

            <div className='h-16 flex justify-center mb-0 sm:mb-3'>
              <TypewriterEffectSmooth
                words={[
                  {
                    text: "Getting Started's Easy, Mate",
                    className: 'text-xl sm:text-5xl font-bold text-gray-800',
                  },
                ]}
                cursorClassName='bg-orange h-8 sm:h-12'
              />
            </div>

            <motion.p className='text-gray-700 text-lg max-w-3xl mx-auto' variants={titleVariants}>
              Matey lines you up with the right gear and shows you how to use it. No waffle, no jargon. Just real help
              from your local DIY legend.
            </motion.p>
          </div>

          {/* Feature cards */}
          <motion.div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' variants={containerVariants}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='bg-white p-6 rounded-xl shadow-sm border border-orange/20 hover:border-orange/40 hover:shadow-md transition-all duration-300 group'
                whileHover={{ scale: 1.03 }}>
                <div className='flex flex-col items-center text-center gap-3'>
                  <div className='bg-orange/10 p-3 rounded-lg group-hover:bg-orange/20 transition-colors'>
                    <feature.icon className='h-6 w-6 text-orange' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-gray-800 text-lg mb-2'>{feature.title}</h4>
                    <p className='text-gray-600 text-sm leading-relaxed'>{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Real Projects Section */}
      <motion.section
        className='py-16 relative overflow-hidden'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}>
        <div className='absolute inset-0 bg-gradient-to-br from-white via-paleYellow/10 to-transparent -z-10' />
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header section */}
          <div className='text-center mb-16'>
            <motion.div
              className='inline-flex items-center justify-center gap-2 bg-orange/10 px-5 py-2.5 rounded-full mb-6'
              variants={titleVariants}
              whileHover={{ scale: 1.05 }}>
              <Star className='w-5 h-5 text-orange fill-orange' />
              <span className='text-orange font-medium'>See Matey in Action</span>
            </motion.div>

            <div className='flex justify-center'>
              <motion.h2
                className='text-4xl md:text-5xl font-bold text-black leading-tight mb-6'
                variants={titleVariants}>
                <span className='text-orange'>DIY Dramas?</span> Matey's Fixed Worse
              </motion.h2>
            </div>

            <motion.p className='text-gray-700 text-lg max-w-3xl mx-auto' variants={titleVariants}>
              Real jobs, real tools, all sorted in minutes. From wonky taps to telly mounts, here's how Matey's helped
              everyday Aussies get it done without the drama.
            </motion.p>
          </div>

          <div className='lg:flex items-end justify-between gap-12'>
            {/* Left side - Project cards */}
            <motion.div className='lg:w-1/2 space-y-5' variants={containerVariants}>
              {projectsData.map((project, index) => (
                <motion.div
                  key={project.id}
                  className={`relative p-6 rounded-2xl backdrop-blur-sm border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                    selectedProject.id === project.id
                      ? 'bg-gradient-to-r from-orange/10 to-lightOrange/20 border-orange shadow-lg'
                      : 'bg-white/60 border-orange/10 hover:border-orange/30'
                  }`}
                  variants={cardVariants}
                  initial='hidden'
                  animate='visible'
                  whileHover='hover'
                  whileTap='tap'
                  custom={index * 0.1}
                  onClick={() => {
                    setSelectedProject(project);
                    if (window.innerWidth < 1024) {
                      scrollToChat();
                    }
                  }}
                  onMouseEnter={() => setIsHovering(project.id)}
                  onMouseLeave={() => setIsHovering(null)}>
                  {selectedProject.id === project.id && (
                    <motion.div
                      className='absolute inset-0 -z-10 opacity-20'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      transition={{ duration: 0.5 }}>
                      <div className='absolute -right-8 -top-8 w-32 h-32 bg-orange/30 rounded-full blur-xl' />
                      <div className='absolute -left-4 -bottom-4 w-24 h-24 bg-lightOrange/30 rounded-full blur-xl' />
                    </motion.div>
                  )}

                  <div className='flex items-start gap-5'>
                    <motion.div
                      className={`p-4 rounded-xl ${
                        selectedProject.id === project.id ? 'bg-orange text-white' : 'bg-orange/10 text-orange'
                      }`}
                      whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}>
                      {React.cloneElement(project.icon, {
                        className: `w-6 h-6 ${selectedProject.id === project.id ? 'text-white' : 'text-orange'}`,
                      })}
                    </motion.div>

                    <div className='flex-1'>
                      <h3 className='font-bold text-start text-xl mb-2'>{project.title}</h3>
                      <p className='text-gray-600 hidden text-md sm:block text-start'>{project.description}</p>

                      {selectedProject.id === project.id && (
                        <motion.div
                          className='mt-4 flex items-center gap-2 text-orange'
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}>
                          <span className='text-sm font-medium'>View conversation</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                            <ArrowRight className='w-4 h-4' />
                          </motion.div>
                        </motion.div>
                      )}
                    </div>

                    <motion.div
                      animate={{
                        x: selectedProject.id === project.id ? [0, 5, 0] : 0,
                        opacity: isHovering === project.id || selectedProject.id === project.id ? 1 : 0.4,
                      }}
                      transition={{
                        repeat: selectedProject.id === project.id ? Number.POSITIVE_INFINITY : 0,
                        repeatType: 'reverse',
                        duration: 0.8,
                      }}>
                      <div
                        className={`p-2 rounded-full ${
                          selectedProject.id === project.id ? 'bg-orange/10' : 'bg-transparent'
                        }`}>
                        <ArrowRight
                          className={`w-5 h-5 ${selectedProject.id === project.id ? 'text-orange' : 'text-gray-400'}`}
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right side - Preview */}
            <motion.div className='lg:w-[43%] mt-12 lg:mt-0 relative' variants={previewVariants}>
              <motion.div
                className='absolute -top-10 right-1 transform -translate-x-1/2 bg-orange text-white px-6 py-3 rounded-full font-bold shadow-lg z-10 whitespace-nowrap'
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}>
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
                  {selectedProject.title}
                </motion.span>
              </motion.div>

              <motion.div
                className='relative'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}>
                {/* Decorative elements around the preview */}
                <motion.div
                  className='absolute -top-5 -left-5 w-20 h-20 bg-orange/10 rounded-full blur-xl -z-10'
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div
                  className='absolute -bottom-5 -right-5 w-20 h-20 bg-lightOrange/10 rounded-full blur-xl -z-10'
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                />

                {/* Animated border effect */}
                <div className='absolute inset-0 p-1 rounded-2xl bg-gradient-to-br from-orange via-lightOrange to-orange animate-spin-slow'>
                  <div className='absolute inset-0 bg-white/90 rounded-xl' />
                </div>

                <div id='chat' className='relative p-1 rounded-2xl overflow-hidden'>
                  <PromptPreview projectChat={selectedProject.chat} />
                </div>
              </motion.div>

              <motion.div
                className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-orange text-white px-4 py-2 rounded-full text-sm font-medium'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}>
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
                  See how Matey helped solve this drama!
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Built for Aussies section */}
      <section className='py-16 relative overflow-hidden bg-gradient-to-br from-white to-paleYellow/30'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div className='text-center mb-12' variants={containerVariants}>
            <div className='flex justify-center'>
              <motion.h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6' variants={titleVariants}>
                Built For Aussies Who'd Rather Just Get It Done
              </motion.h2>
            </div>
            <motion.p className='text-gray-700 text-lg max-w-3xl mx-auto' variants={titleVariants}>
              ToolMate was made after yarning with real people. Renters sick of dodgy taps. First-home buyers hanging
              their first shelves. Weekend warriors just trying not to stuff it. No fluff, no hard sell. Just a
              tool-smart mate who keeps it simple and helps you crack on.
            </motion.p>
          </motion.div>

          <motion.div className='mt-10 flex justify-center' variants={titleVariants}>
            <h3 className='text-2xl font-bold text-orange mb-8'>Matey's Got Your Back With:</h3>
          </motion.div>

          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'
            variants={containerVariants}>
            <motion.div
              className='bg-white p-6 rounded-xl shadow-sm border border-orange/20'
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              variants={itemVariants}>
              <div className='flex items-center justify-center mb-4'>
                <div className='p-3 bg-orange/10 rounded-full'>
                  <FaTools className='w-6 h-6 text-orange' />
                </div>
              </div>
              <h4 className='font-bold text-lg text-gray-800 mb-3'>Tool Advice That's Actually Useful</h4>
              <p className='text-gray-600'>
                Skip the guesswork. Matey tells you what you need and what you don't, so you're not lost in the aisles
                at Bunnings.
              </p>
            </motion.div>

            <motion.div
              className='bg-white p-6 rounded-xl shadow-sm border border-orange/20'
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              variants={itemVariants}>
              <div className='flex items-center justify-center mb-4'>
                <div className='p-3 bg-orange/10 rounded-full'>
                  <Shield className='w-6 h-6 text-orange' />
                </div>
              </div>
              <h4 className='font-bold text-lg text-gray-800 mb-3'>Safety That Makes Sense</h4>
              <p className='text-gray-600'>
                He'll warn you when it matters. No ladders in thongs, no sketchy shortcuts. Just solid DIY habits that
                won't get you hurt.
              </p>
            </motion.div>

            <motion.div
              className='bg-white p-6 rounded-xl shadow-sm border border-orange/20'
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              variants={itemVariants}>
              <div className='flex items-center justify-center mb-4'>
                <div className='p-3 bg-orange/10 rounded-full'>
                  <Camera className='w-6 h-6 text-orange' />
                </div>
              </div>
              <h4 className='font-bold text-lg text-gray-800 mb-3'>Photo Help If You're Stuck</h4>
              <p className='text-gray-600'>
                Not sure what you're looking at? Snap a pic and Matey will take a squiz to steer you right.
              </p>
            </motion.div>

            <motion.div
              className='bg-white p-6 rounded-xl shadow-sm border border-orange/20'
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              variants={itemVariants}>
              <div className='flex items-center justify-center mb-4'>
                <div className='p-3 bg-orange/10 rounded-full'>
                  <DollarSign className='w-6 h-6 text-orange' />
                </div>
              </div>
              <h4 className='font-bold text-lg text-gray-800 mb-3'>Tips That Match Your Skill And Shed</h4>
              <p className='text-gray-600'>
                Matey works out what gear you've already got and gives advice that fits your budget and confidence, not
                some pro tradie's toolbox.
              </p>
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className='text-center hidden lg:block bg-gradient-to-r from-orange/10 via-lightOrange/10 to-orange/10 p-8 rounded-2xl border border-orange/20'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <motion.div
              className='mb-6 flex justify-center'
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}>
              <MateyExpression expression='2thumb' />
            </motion.div>

            <div className='flex justify-center'>
              <h3 className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>Ready to Get Started?</h3>
            </div>
            <p className='text-gray-600 text-lg mb-8 max-w-2xl mx-auto'>
              Join thousands of Aussies who've already discovered the easiest way to tackle DIY projects. No more
              guessing, no more wasted trips to Bunnings.
            </p>

            <div className='flex flex-col gap-4 justify-center items-center'>
              <motion.button
                className='px-8 py-4 bg-orange text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3'
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(245, 158, 11, 0.3)' }}
                whileTap={{ scale: 0.95 }}>
                Start Chatting with Matey
                <ArrowRight className='w-5 h-5' />
              </motion.button>

              <motion.p
                className='text-sm text-gray-500 italic'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}>
                Free to try • No credit card required
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className='mt-8 text-center'>
            <p className='text-md text-gray-500 italic'>
              <motion.span
                animate={{
                  color: ['#6b7280', '#f59e0b', '#6b7280'],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className='font-medium'>
                He's not guessing.
              </motion.span>{' '}
              He actually speaks your language.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
