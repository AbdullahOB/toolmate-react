'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import Logo from './logo';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const linkVariants = {
  initial: { x: -5, opacity: 0.8 },
  hover: {
    x: 5,
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
};

const Footer: React.FC = () => {
  return (
    <footer className='bg-white pt-16 pb-10 border-t border-paleYellow relative'>
      <motion.div
        className='max-w-7xl mx-auto px-3 sm:px-6 lg:px-8'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-8'>
          {/* Logo and company info */}
          <motion.div className='md:col-span-4' variants={itemVariants}>
            <Logo />
            <motion.p className='mt-4 text-gray text-start max-w-md' variants={itemVariants}>
              Built for Aussie DIYers who want to do it right, not just do it cheap. Trusted by thousands to cut through
              the noise and get the job done.
            </motion.p>

            {/* Newsletter signup */}
            <motion.div className='mt-6' variants={itemVariants}>
              <h3 className='text-lg font-semibold text-orange'>Stay in the loop</h3>
              <p className='text-start -mt-3 mb-4 text-md text-gray-500'>
                Get tips, updates, and tool smarts worth reading.
              </p>
              <div className='flex'>
                <input
                  type='email'
                  placeholder='Your Email'
                  className='p-2 px-3 rounded-l-lg w-full border border-paleYellow focus:outline-none focus:ring-2 focus:ring-yellow'
                />
                <motion.button
                  className='bg-orange text-white p-2 px-4 rounded-r-lg flex items-center'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <motion.span initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    Subscribe
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className='md:col-span-3 md:ml-8' variants={itemVariants}>
            <h3 className='text-lg font-semibold text-orange mb-4 border-b border-paleYellow pb-2'>Quick Links</h3>
            <ul className='space-y-3'>
              {[
                { name: 'Home', path: '/' },
                { name: 'Pricing', path: '/pricing' },
                { name: 'Blogs', path: '/blogs' },
                { name: 'About Us', path: '/AboutUs' },
                { name: 'Community Guideline', path: '/community-guideline' },
              ].map((item) => (
                <motion.li key={item.name} variants={linkVariants} whileHover='hover' initial='initial'>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center transition-colors duration-200 ${
                        isActive ? 'text-yellow font-semibold' : 'text-gray hover:text-orange'
                      }`
                    }>
                    {item.name}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div className='md:col-span-5' variants={itemVariants}>
            <h3 className='text-lg font-semibold text-orange mb-4 border-b border-paleYellow pb-2'>Connect With Us</h3>
            <p className='text-start -mt-3 mb-4 text-md text-gray-500'>
              Get tips, updates, and tool smarts worth reading.
            </p>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
              <motion.a
                href='#'
                className='group relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 sm:hover:border-transparent transition-all duration-300 shadow-2xl shadow-blue-500/20 sm:shadow-none sm:hover:shadow-2xl sm:hover:shadow-blue-500/20 overflow-hidden'
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <div className='absolute inset-0 bg-gradient-to-br from-[#1877F2]/10 to-[#1877F2]/5 sm:from-[#1877F2]/0 sm:to-[#1877F2]/0 sm:group-hover:from-[#1877F2]/10 sm:group-hover:to-[#1877F2]/5 transition-all duration-500 rounded-2xl' />
                <div
                  className='absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1877F2]/50 via-[#1877F2] to-[#1877F2]/50 opacity-100 sm:from-transparent sm:via-gray-300 sm:to-transparent sm:group-hover:from-[#1877F2]/50 sm:group-hover:via-[#1877F2] sm:group-hover:to-[#1877F2]/50 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500'
                  style={{ padding: '1px' }}>
                  <div className='w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl' />
                </div>

                <motion.div
                  className='relative z-10 p-4 rounded-2xl bg-[#1877F2] sm:bg-gray-200 sm:group-hover:bg-[#1877F2] transition-all duration-300 shadow-lg sm:group-hover:shadow-xl'
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}>
                  <Facebook
                    size={24}
                    className='text-white sm:text-gray-400 sm:group-hover:text-white transition-colors duration-300'
                  />
                </motion.div>

                <span className='relative z-10 mt-4 text-sm font-medium text-[#1877F2] sm:text-gray-600 sm:group-hover:text-[#1877F2] transition-colors duration-300'>
                  Facebook
                </span>
              </motion.a>

              <motion.a
                href='#'
                className='group relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 sm:hover:border-transparent transition-all duration-300 shadow-2xl shadow-sky-500/20 sm:shadow-none sm:hover:shadow-2xl sm:hover:shadow-sky-500/20 overflow-hidden'
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <div className='absolute inset-0 bg-gradient-to-br from-[#1DA1F2]/10 to-[#1DA1F2]/5 sm:from-[#1DA1F2]/0 sm:to-[#1DA1F2]/0 sm:group-hover:from-[#1DA1F2]/10 sm:group-hover:to-[#1DA1F2]/5 transition-all duration-500 rounded-2xl' />

                <div
                  className='absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1DA1F2]/50 via-[#1DA1F2] to-[#1DA1F2]/50 opacity-100 sm:from-transparent sm:via-gray-300 sm:to-transparent sm:group-hover:from-[#1DA1F2]/50 sm:group-hover:via-[#1DA1F2] sm:group-hover:to-[#1DA1F2]/50 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500'
                  style={{ padding: '1px' }}>
                  <div className='w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl' />
                </div>

                <motion.div
                  className='relative z-10 p-4 rounded-2xl bg-[#1DA1F2] sm:bg-gray-200 sm:group-hover:bg-[#1DA1F2] transition-all duration-300 shadow-lg sm:group-hover:shadow-xl'
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}>
                  <Twitter
                    size={24}
                    className='text-white sm:text-gray-400 sm:group-hover:text-white transition-colors duration-300'
                  />
                </motion.div>

                <span className='relative z-10 mt-4 text-sm font-medium text-[#1DA1F2] sm:text-gray-600 sm:group-hover:text-[#1DA1F2] transition-colors duration-300'>
                  Twitter
                </span>
              </motion.a>

              <motion.a
                href='#'
                className='group relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 sm:hover:border-transparent transition-all duration-300 shadow-2xl shadow-red-500/20 sm:shadow-none sm:hover:shadow-2xl sm:hover:shadow-red-500/20 overflow-hidden'
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <div className='absolute inset-0 bg-gradient-to-br from-[#FF0000]/10 to-[#FF0000]/5 sm:from-[#FF0000]/0 sm:to-[#FF0000]/0 sm:group-hover:from-[#FF0000]/10 sm:group-hover:to-[#FF0000]/5 transition-all duration-500 rounded-2xl' />

                <div
                  className='absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF0000]/50 via-[#FF0000] to-[#FF0000]/50 opacity-100 sm:from-transparent sm:via-gray-300 sm:to-transparent sm:group-hover:from-[#FF0000]/50 sm:group-hover:via-[#FF0000] sm:group-hover:to-[#FF0000]/50 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500'
                  style={{ padding: '1px' }}>
                  <div className='w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl' />
                </div>

                <motion.div
                  className='relative z-10 p-4 rounded-2xl bg-[#FF0000] sm:bg-gray-200 sm:group-hover:bg-[#FF0000] transition-all duration-300 shadow-lg sm:group-hover:shadow-xl'
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}>
                  <Youtube
                    size={24}
                    className='text-white sm:text-gray-400 sm:group-hover:text-white transition-colors duration-300'
                  />
                </motion.div>

                <span className='relative z-10 mt-4 text-sm font-medium text-[#FF0000] sm:text-gray-600 sm:group-hover:text-[#FF0000] transition-colors duration-300'>
                  YouTube
                </span>
              </motion.a>

              <motion.a
                href='#'
                className='group relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 sm:hover:border-transparent transition-all duration-300 shadow-2xl shadow-pink-500/20 sm:shadow-none sm:hover:shadow-2xl sm:hover:shadow-pink-500/20 overflow-hidden'
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <div className='absolute inset-0 bg-gradient-to-br from-[#E4405F]/10 to-[#E4405F]/5 sm:from-[#E4405F]/0 sm:to-[#E4405F]/0 sm:group-hover:from-[#E4405F]/10 sm:group-hover:to-[#E4405F]/5 transition-all duration-500 rounded-2xl' />

                <div
                  className='absolute inset-0 rounded-2xl bg-gradient-to-r from-[#E4405F]/50 via-[#E4405F] to-[#E4405F]/50 opacity-100 sm:from-transparent sm:via-gray-300 sm:to-transparent sm:group-hover:from-[#E4405F]/50 sm:group-hover:via-[#E4405F] sm:group-hover:to-[#E4405F]/50 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500'
                  style={{ padding: '1px' }}>
                  <div className='w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl' />
                </div>

                <motion.div
                  className='relative z-10 p-4 rounded-2xl bg-[#E4405F] sm:bg-gray-200 sm:group-hover:bg-[#E4405F] transition-all duration-300 shadow-lg sm:group-hover:shadow-xl'
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}>
                  <Instagram
                    size={24}
                    className='text-white sm:text-gray-400 sm:group-hover:text-white transition-colors duration-300'
                  />
                </motion.div>

                <span className='relative z-10 mt-4 text-sm font-medium text-[#E4405F] sm:text-gray-600 sm:group-hover:text-[#E4405F] transition-colors duration-300'>
                  Instagram
                </span>
              </motion.a>
            </div>

            <motion.div className='mt-6' variants={itemVariants}>
              <h3 className='text-lg font-semibold text-orange mb-3'>Contact Us</h3>
              <p className='text-start -mt-3 mb-2 text-md text-gray-500'>
                Proudly built in Australia. Real people, real tools.
              </p>
              <div className='text-start text-md'>
                <p className='text-gray flex items-start'>
                  <span>Got a question, issue, or just wanna yarn?</span>
                </p>
                <p className='text-gray flex items-start'>
                  <span>
                    Flick us an email at <span className='font-bold'>contact@toolmate.com</span>
                  </span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className='h-px bg-paleYellow my-8'
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
          className='flex flex-col md:flex-row justify-between pb-4 items-center'>
          <p className='text-sm sm:text-md text-gray'>
            &copy; {new Date().getFullYear()} Toolmate. All rights reserved.
          </p>
          <div className='flex space-x-3 mt-4 md:mt-0'>
            <Link to='/terms-of-service' className='text-sm text-gray hover:text-orange transition-colors'>
              Terms of Service
            </Link>
            <Link to='/privacy-policy' className='text-sm text-gray hover:text-orange transition-colors'>
              Privacy Policy
            </Link>
            <Link to='/safety-policy' className='text-sm text-gray hover:text-orange transition-colors'>
              Safety Policy
            </Link>
            <Link to='/refund-policy' className='text-sm text-gray hover:text-orange transition-colors'>
              Refund Policy
            </Link>
          </div>
        </motion.div>
      </motion.div>
      <div className='text-center py-3 text-orange text-sm md:text-md font-medium bg-white bg-opacity-90 border-t border-paleYellow'>
        Matey gives advice only. Always follow safety rules and check local regulations.
      </div>
      <div className='absolute bottom-0 left-0 w-full'>
        <div className='py-4 text-center text-gray-500 text-sm bg-gradient-to-t from-paleYellow to-transparent'>
          You've hit the bottom!
        </div>
      </div>
    </footer>
  );
};

export default Footer;
