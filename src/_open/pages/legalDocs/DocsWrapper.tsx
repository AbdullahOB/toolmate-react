import Logo from '@/components/custom/Logo';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DocsWrapper(content: { content: string }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/refund-policy', label: 'Refund Policy' },
    { path: '/AboutUs', label: 'About Us' },
    { path: '/community-guideline', label: 'Community Guideline' },
    { path: '/privacy-policy', label: 'Privacy Policy' },
    { path: '/terms-of-service', label: 'Terms of Service' },
    { path: '/safety-policy', label: 'Safety Policy' },
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-white to-paleYellow'>
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-lighterYellow'
        }`}>
        {/* Desktop Navigation */}
        <div className='hidden md:flex justify-between items-center px-8 lg:px-16 py-4'>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
            <Logo />
          </motion.div>

          <nav className='flex space-x-1 lg:space-x-2 bg-paleYellow/50 backdrop-blur-sm p-2 rounded-full shadow-sm'>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link to={link.path} key={link.path}>
                  <motion.div
                    className={`relative px-3 py-2 rounded-full font-medium text-sm transition-all ${
                      isActive ? 'text-black' : 'text-black/70 hover:text-black'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId='activeIndicator'
                        className='absolute inset-0 bg-yellow rounded-full -z-10'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden flex justify-between items-center px-5 py-4'>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Logo />
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className='rounded-full p-2 shadow-md z-50'>
            {isOpen ? <X size={24} className='text-yellow' /> : <Menu size={24} className='text-yellow' />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden'
            onClick={() => setIsOpen(false)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='absolute right-0 top-0 bottom-0 w-3/4 bg-white shadow-xl p-6 pt-20'
              onClick={(e) => e.stopPropagation()}>
              <div className='flex flex-col space-y-2'>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link to={link.path} key={link.path} onClick={() => setIsOpen(false)}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg ${isActive ? 'bg-yellow font-semibold' : 'hover:bg-lighterYellow'}`}>
                        {link.label}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='flex-1 flex justify-center px-1 py-10'>
        <div className='w-full max-w-screen-md bg-white rounded-2xl shadow-lg p-8 md:p-12'>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Markdown
              remarkPlugins={[remarkGfm]}
              className='text-black text-left prose prose-headings:text-yellow prose-headings:font-bold prose-a:text-yellow prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl'>
              {content.content}
            </Markdown>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
