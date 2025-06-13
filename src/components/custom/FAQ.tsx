'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlusCircle, MinusCircle, MessageCircle, ArrowRight } from 'lucide-react';

export default function FAQSection({ isVisible }: { isVisible: boolean }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoveredQuestion, setHoveredQuestion] = useState<string | null>(null);

  // Handle accordion state change
  const handleAccordionChange = (value: string) => {
    setActiveItem(value === activeItem ? null : value);
  };

  // FAQ categories with their respective questions
  const faqCategories = [
    {
      name: 'Subscription',
      questions: ['item-1', 'item-4'],
    },
    {
      name: 'Payments',
      questions: ['item-2', 'item-5', 'item-6'],
    },
    {
      name: 'Account',
      questions: ['item-3'],
    },
  ];

  return (
    <section className={`${isVisible && 'hidden'} py-16 relative overflow-hidden`}>
      {/* Background decorative elements */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <div className='absolute -top-32 -left-32 w-64 h-64 rounded-full bg-orange/5 blur-3xl'></div>
        <div className='absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-yellow/10 blur-3xl'></div>
        <div className='absolute -bottom-32 left-1/4 w-72 h-72 rounded-full bg-orange/5 blur-3xl'></div>
      </div>

      <div className='max-w-7xl mx-auto md:px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'>
          <div className='inline-block mb-4'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className='bg-gradient-to-r from-orange to-yellow p-3 rounded-full inline-block'>
              <MessageCircle className='h-8 w-8 text-white' />
            </motion.div>
          </div>
          <h2 className='text-4xl mx-auto font-bold mb-4 bg-gradient-to-r from-orange to-yellow bg-clip-text text-transparent'>
            Frequently Asked Questions
          </h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Can't find the answer you're looking for? Reach out to our{' '}
            <Link to='/contact' className='text-orange hover:underline font-medium'>
              customer support
            </Link>{' '}
            team.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className='flex flex-wrap justify-center gap-4 mb-12'>
          {faqCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}>
              <button
                className='px-6 py-2 rounded-full border border-gray-200 hover:border-orange hover:bg-orange/5 transition-all'
                onClick={() => {
                  // Set the first question of this category as active
                  handleAccordionChange(category.questions[0]);
                }}>
                {category.name}
              </button>
            </motion.div>
          ))}
        </div>

        <div className='container mx-auto bg-white rounded-2xl shadow-lg p-1'>
          <Accordion
            type='single'
            collapsible
            value={activeItem || undefined}
            onValueChange={handleAccordionChange}
            className='w-full'>
            {/* Question 1: Plan Changes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}>
              <AccordionItem
                value='item-1'
                className={`border-b border-gray-100 overflow-hidden ${
                  activeItem === 'item-1' ? 'bg-gradient-to-r from-orange/5 to-yellow/5 rounded-t-xl' : 'rounded-xl'
                } mb-4`}
                onMouseEnter={() => setHoveredQuestion('item-1')}
                onMouseLeave={() => setHoveredQuestion(null)}>
                <AccordionTrigger
                  className={`text-xl font-medium py-6 px-6 hover:no-underline group ${
                    activeItem === 'item-1' ? 'text-orange' : ''
                  }`}>
                  <div className='flex items-center'>
                    <div
                      className={`mr-4 p-2 rounded-full ${
                        activeItem === 'item-1' || hoveredQuestion === 'item-1'
                          ? 'bg-orange/10 text-orange'
                          : 'bg-gray-100 text-gray-500'
                      } transition-all duration-300`}>
                      {activeItem === 'item-1' ? (
                        <MinusCircle className='h-5 w-5' />
                      ) : (
                        <PlusCircle className='h-5 w-5' />
                      )}
                    </div>
                    <span>Can I change my subscription plan later?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-left px-16 pb-6 text-gray-600'>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='space-y-4'>
                    <p className='text-lg'>Yes, you can change your subscription plan at any time.</p>
                    <ul className='space-y-3 m-0 p-0 sm:m-[16px] sm:pl-[20px] text-base'>
                      <li className='flex items-center'>
                        <div className='bg-green-100 p-1 rounded-full mr-3 mt-1'>
                          <ArrowRight className='h-4 w-4 text-green-600' />
                        </div>
                        <div>
                          <strong className='text-gray-800'>Upgrading:</strong> Upgrades take effect immediately. The
                          unused portion of your current plan will be credited toward the new plan, and the new billing
                          cycle will begin on the upgrade date.
                        </div>
                      </li>
                      <li className='flex items-center'>
                        <div className='bg-blue-100 p-1 rounded-full mr-3 mt-1'>
                          <ArrowRight className='h-4 w-4 text-blue-600' />
                        </div>
                        <div>
                          <strong className='text-gray-800'>Downgrading:</strong> Downgrades take effect at the end of
                          your current billing cycle.
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* Question 2: Refund Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}>
              <AccordionItem
                value='item-2'
                className={`border-b border-gray-100 overflow-hidden ${
                  activeItem === 'item-2' ? 'bg-gradient-to-r from-orange/5 to-yellow/5 rounded-t-xl' : 'rounded-xl'
                } mb-4`}
                onMouseEnter={() => setHoveredQuestion('item-2')}
                onMouseLeave={() => setHoveredQuestion(null)}>
                <AccordionTrigger
                  className={`text-xl font-medium py-6 px-6 hover:no-underline group ${
                    activeItem === 'item-2' ? 'text-orange' : ''
                  }`}>
                  <div className='flex items-center'>
                    <div
                      className={`mr-4 p-2 rounded-full ${
                        activeItem === 'item-2' || hoveredQuestion === 'item-2'
                          ? 'bg-orange/10 text-orange'
                          : 'bg-gray-100 text-gray-500'
                      } transition-all duration-300`}>
                      {activeItem === 'item-2' ? (
                        <MinusCircle className='h-5 w-5' />
                      ) : (
                        <PlusCircle className='h-5 w-5' />
                      )}
                    </div>
                    <span>What is the refund policy for subscriptions?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-left px-16 pb-6 text-gray-600'>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='space-y-4'>
                    <p className='text-lg'>Refunds are available under specific conditions:</p>
                    <ul className='space-y-3 m-0 p-0 sm:m-[16px] sm:pl-[20px] text-base'>
                      <li className='flex items-center'>
                        <div className='bg-green-100 p-1 rounded-full mr-3 mt-1'>
                          <ArrowRight className='h-4 w-4 text-green-600' />
                        </div>
                        <div>You cancel your subscription within 7 days of purchase or renewal.</div>
                      </li>
                      <li className='flex items-center'>
                        <div className='bg-green-100 p-1 rounded-full mr-3 mt-1'>
                          <ArrowRight className='h-4 w-4 text-green-600' />
                        </div>
                        <div>You have not used any premium features during this period.</div>
                      </li>
                    </ul>
                    <p className='text-lg'>
                      To request a refund, email us at{' '}
                      <Link to='mailto:contact@toolmate.com.au' className='text-orange hover:underline'>
                        contact@toolmate.com.au
                      </Link>
                    </p>
                    <p className='text-lg'>
                      Refunds are reviewed on a case-by-case basis and processed within 7 business days.
                    </p>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* Question 3: Subscription Cancellation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}>
              <AccordionItem
                value='item-3'
                className={`border-b border-gray-100 overflow-hidden ${
                  activeItem === 'item-3' ? 'bg-gradient-to-r from-orange/5 to-yellow/5 rounded-t-xl' : 'rounded-xl'
                } mb-4`}
                onMouseEnter={() => setHoveredQuestion('item-3')}
                onMouseLeave={() => setHoveredQuestion(null)}>
                <AccordionTrigger
                  className={`text-xl font-medium py-6 px-6 hover:no-underline group ${
                    activeItem === 'item-3' ? 'text-orange' : ''
                  }`}>
                  <div className='flex items-center'>
                    <div
                      className={`mr-4 p-2 rounded-full ${
                        activeItem === 'item-3' || hoveredQuestion === 'item-3'
                          ? 'bg-orange/10 text-orange'
                          : 'bg-gray-100 text-gray-500'
                      } transition-all duration-300`}>
                      {activeItem === 'item-3' ? (
                        <MinusCircle className='h-5 w-5' />
                      ) : (
                        <PlusCircle className='h-5 w-5' />
                      )}
                    </div>
                    <span>How can I cancel my subscription?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-left px-16 pb-6 text-gray-600'>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='space-y-4'>
                    <p className='text-lg'>You can cancel your subscription in two ways:</p>
                    <ul className='space-y-3 m-0 p-0 sm:m-[16px] sm:pl-[20px] text-base'>
                      <li className='flex items-center'>
                        <div className='bg-blue-100 p-1 rounded-full mr-3 mt-1'>
                          <ArrowRight className='h-4 w-4 text-blue-600' />
                        </div>
                        <div>
                          <strong className='text-gray-800'>Through Your Account:</strong> Log into your ToolMate
                          account, go to the Subscription section under Account Settings, and select Cancel
                          Subscription.
                        </div>
                      </li>
                      <li className='flex items-center'>
                        <div className='bg-blue-100 p-1 rounded-full mr-3 mt-1'>
                          <ArrowRight className='h-4 w-4 text-blue-600' />
                        </div>
                        <div>
                          <strong className='text-gray-800'>Email Support:</strong> If you face issues, email us at{' '}
                          <Link to='mailto:contact@toolmate.com.au' className='text-orange hover:underline'>
                            contact@toolmate.com.au
                          </Link>{' '}
                          with your account details.
                        </div>
                      </li>
                    </ul>
                    <p className='text-lg'>
                      Cancellations take effect at the end of the current billing cycle, and no prorated refunds are
                      provided.
                    </p>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* Question 4: Recurring Renewal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}>
              <AccordionItem
                value='item-4'
                className={`border-b border-gray-100 overflow-hidden ${
                  activeItem === 'item-4' ? 'bg-gradient-to-r from-orange/5 to-yellow/5 rounded-t-xl' : 'rounded-xl'
                } mb-4`}
                onMouseEnter={() => setHoveredQuestion('item-4')}
                onMouseLeave={() => setHoveredQuestion(null)}>
                <AccordionTrigger
                  className={`text-xl font-medium py-6 px-6 hover:no-underline group ${
                    activeItem === 'item-4' ? 'text-orange' : ''
                  }`}>
                  <div className='flex items-center'>
                    <div
                      className={`mr-4 p-2 rounded-full ${
                        activeItem === 'item-4' || hoveredQuestion === 'item-4'
                          ? 'bg-orange/10 text-orange'
                          : 'bg-gray-100 text-gray-500'
                      } transition-all duration-300`}>
                      {activeItem === 'item-4' ? (
                        <MinusCircle className='h-5 w-5' />
                      ) : (
                        <PlusCircle className='h-5 w-5' />
                      )}
                    </div>
                    <span>Will my subscription renewal price remain the same?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-left px-16 pb-6 text-gray-600'>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}>
                    <p className='text-lg'>
                      Yes, your subscription renewal price will remain locked at the original rate as long as your
                      subscription remains active. If changes are made to plans or pricing, we will notify you in
                      advance.
                    </p>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* Question 5: Failed Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}>
              <AccordionItem
                value='item-5'
                className={`border-b border-gray-100 overflow-hidden ${
                  activeItem === 'item-5' ? 'bg-gradient-to-r from-orange/5 to-yellow/5 rounded-t-xl' : 'rounded-xl'
                } mb-4`}
                onMouseEnter={() => setHoveredQuestion('item-5')}
                onMouseLeave={() => setHoveredQuestion(null)}>
                <AccordionTrigger
                  className={`text-xl font-medium py-6 px-6 hover:no-underline group ${
                    activeItem === 'item-5' ? 'text-orange' : ''
                  }`}>
                  <div className='flex items-center'>
                    <div
                      className={`mr-4 p-2 rounded-full ${
                        activeItem === 'item-5' || hoveredQuestion === 'item-5'
                          ? 'bg-orange/10 text-orange'
                          : 'bg-gray-100 text-gray-500'
                      } transition-all duration-300`}>
                      {activeItem === 'item-5' ? (
                        <MinusCircle className='h-5 w-5' />
                      ) : (
                        <PlusCircle className='h-5 w-5' />
                      )}
                    </div>
                    <span>What happens if my payment fails?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-left px-16 pb-6 text-gray-600'>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}>
                    <p className='text-lg'>
                      If your payment fails, your subscription will remain active until the end of the current billing
                      cycle. Please update your payment method in your account to ensure uninterrupted access.
                    </p>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* Question 6: Payment Issues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}>
              <AccordionItem
                value='item-6'
                className={`border-b-0 overflow-hidden ${
                  activeItem === 'item-6' ? 'bg-gradient-to-r from-orange/5 to-yellow/5 rounded-t-xl' : 'rounded-xl'
                } mb-4`}
                onMouseEnter={() => setHoveredQuestion('item-6')}
                onMouseLeave={() => setHoveredQuestion(null)}>
                <AccordionTrigger
                  className={`text-xl font-medium py-6 px-6 hover:no-underline group ${
                    activeItem === 'item-6' ? 'text-orange' : ''
                  }`}>
                  <div className='flex items-center'>
                    <div
                      className={`mr-4 p-2 rounded-full ${
                        activeItem === 'item-6' || hoveredQuestion === 'item-6'
                          ? 'bg-orange/10 text-orange'
                          : 'bg-gray-100 text-gray-500'
                      } transition-all duration-300`}>
                      {activeItem === 'item-6' ? (
                        <MinusCircle className='h-5 w-5' />
                      ) : (
                        <PlusCircle className='h-5 w-5' />
                      )}
                    </div>
                    <span>I am unable to pay with my Amex card. What should I do?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-left px-16 pb-6 text-gray-600'>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}>
                    <p className='text-lg'>
                      If you're experiencing issues with Amex payments, try an alternative payment method or contact our
                      support team for assistance.
                    </p>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          </Accordion>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className='mt-16 text-center'>
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-orange/10 to-yellow/10 px-6 py-3 rounded-full'>
            <span className='text-orange font-medium'>Still have questions?</span>
            <Link
              to='/contact'
              className='inline-flex items-center gap-1 text-orange hover:underline font-medium group'>
              Contact us
              <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
