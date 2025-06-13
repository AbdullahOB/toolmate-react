import React from 'react';
import { motion } from 'framer-motion';
import MateyExpression from './MateyExpression';

type FAQItem = {
  question: string;
  answer: string;
  mateyExpression: 'laugh' | 'hello' | 'smile' | 'offer' | '1thumb' | '2thumb' | 'tool' | 'thinking';
};

const faqData: FAQItem[] = [
  {
    question: 'Do I have to pay?',
    answer:
      "Nah mate, it's free to get stuck in. You can chat, check tools, and run the budget slider without spending a cent. If you're keen on extras, the Pro plan’s there when you're ready.",
    mateyExpression: 'laugh',
  },
  {
    question: 'What tools are included?',
    answer:
      "Pretty much the whole bloody shed. Drills, sanders, levels, grinders, socket sets. If you'd find it at Bunnings, I've got something to say about it.",
    mateyExpression: '1thumb',
  },
  {
    question: 'What can Matey actually help with?',
    answer:
      'I’ll help you pick the right gear, stick to your budget, and stay safe. Got a dodgy shelf, leaky tap, or big reno in mind? I’ll line up what you need and keep it simple.',
    mateyExpression: '2thumb',
  },
  {
    question: 'Can Matey help if I’ve got no clue?',
    answer:
      "That’s what I’m here for. No judgement, no jargon. Just tell me what you're trying to do, even if it's something like 'that wobbly thing near the wall' and I’ll sort you out.",
    mateyExpression: 'tool',
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const mateyIdleAnimation = {
    y: [0, -10, 0],
    rotate: [0, 3, -3, 0],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: 'easeInOut',
    },
  };

  const mateyHoverAnimation = {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  };

  return (
    <section className='py-16 px-3 md:px-8 lg:px-16 overflow-hidden'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          className='flex flex-col lg:flex-row items-center justify-between gap-12'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}>
          <motion.div className='w-full lg:w-3/5' variants={itemVariants}>
            <motion.div className='space-y-6' variants={containerVariants}>
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  className='bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange/20 hover:border-orange/50 transition-all duration-300'
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}>
                  <button
                    className='w-full px-6 py-5 flex items-center justify-between text-left'
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}>
                    <div className='flex items-center gap-3'>
                      <div className='bg-orange/10 p-2 rounded-full'>
                        <MateyExpression expression='thinking' />
                      </div>
                      <h3 className='text-xl font-semibold text-gray-800'>{faq.question}</h3>
                    </div>
                    <span className='text-orange text-2xl'>{activeIndex === index ? '−' : '+'}</span>
                  </button>

                  <motion.div
                    className='overflow-hidden'
                    initial={false}
                    animate={{
                      height: activeIndex === index ? 'auto' : 0,
                      opacity: activeIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}>
                    <div className='px-6 pb-5 pt-2 flex items-start gap-3'>
                      <div className='bg-orange/10 p-2 rounded-full mt-1'>
                        <MateyExpression expression={faq.mateyExpression} />
                      </div>
                      <p className='text-lg text-start text-gray-700'>{faq.answer}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className='w-full lg:w-2/5 flex justify-center'
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}>
            <motion.div
              className='relative'
              variants={{
                initial: { y: 0 },
                hover: mateyHoverAnimation,
              }}
              animate='initial'
              whileHover='hover'
              style={{ originX: 0.5, originY: 0.5 }}>
              <motion.img
                src='/assets/matey/presenting.svg'
                alt='Matey character giving answers'
                className='rounded-2xl lg:block hidden max-w-full h-auto'
                width={400}
                height={500}
                variants={{ initial: mateyIdleAnimation }}
                animate='initial'
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
