'use client';

import type * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { buttonVariants } from '@/components/ui/button';
import { SignOutButton, useAuth } from '@clerk/clerk-react';
import Logo from './logo';
import { ActiveNavIndicator } from './active-nav-indicators';
import { MateyNavIcon } from '../ui/matey-nav-icon';
import { X, Menu, BadgeDollarSign } from 'lucide-react';

// Navigation item types
type NavItem = {
  name: string;
  href: string;
  icon?: string;
};

const navItems: NavItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: '/assets/mobileNavIcons/home.svg',
  },
  {
    name: 'Pricing',
    href: '/pricing',
    icon: '/assets/mobileNavIcons/help.svg',
  },
];

// Animation variants for mobile menu items
const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
  exit: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// Mobile navigation component for better code organization
const MobileNavigation = ({
  isOpen,
  onOpenChange,
  isSignedIn,
  isLoaded,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSignedIn: boolean | undefined;
  isLoaded: boolean;
}) => {
  const location = useLocation();

  // Function to check if a link is active
  const isLinkActive = (href: string): boolean => {
    if (href.startsWith('#')) return location.hash === href;
    if (href === '/') return location.pathname === '/';
    return href !== '/' && location.pathname.startsWith(href);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <motion.button
          className='w-10 h-10 flex justify-center items-center rounded-full bg-gray-100 relative'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label='Toggle menu'>
          <AnimatePresence mode='wait'>
            {isOpen ? (
              <motion.div
                key='close'
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='absolute inset-0 flex items-center justify-center'>
                <X className='w-5 h-5 text-orange' />
              </motion.div>
            ) : (
              <motion.div
                key='menu'
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='absolute inset-0 flex items-center justify-center'>
                <Menu className='w-5 h-5 text-gray-700' />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </SheetTrigger>

      <SheetContent
        side='left'
        className='overflow-y-auto p-0 border-r border-orange/10 bg-white/95 backdrop-blur-md'
        // Remove the default animation to use our custom one
        onOpenAutoFocus={(e) => e.preventDefault()}>
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 1,
          }}
          className='h-full flex flex-col'>
          <SheetHeader className='border-b border-gray-100 px-4 py-4'>
            <SheetTitle className='flex justify-start'>
              <Link to='/' onClick={() => onOpenChange(false)}>
                <Logo />
              </Link>
            </SheetTitle>
          </SheetHeader>

          {/* Auth buttons */}
          <div className='px-4 py-5 border-b border-gray-100'>
            {isLoaded ? (
              isSignedIn ? (
                <div className='flex flex-col gap-3'>
                  <Link
                    to='/dashboard'
                    onClick={() => onOpenChange(false)}
                    className={cn(buttonVariants({ variant: 'orangeGradient' }), 'w-full')}>
                    Go to Dashboard
                  </Link>
                  <SignOutButton>
                    <button
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'w-full border-orange text-orange hover:bg-orange/10'
                      )}>
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                <div className='flex gap-3'>
                  <Link
                    to='/signin'
                    onClick={() => onOpenChange(false)}
                    className='font-bold text-base transition-all p-2 rounded-md cursor-pointer flex-1 text-center border border-gray-200 hover:border-orange hover:text-orange'>
                    Login
                  </Link>
                  <Link
                    to='/signup'
                    onClick={() => onOpenChange(false)}
                    className={cn(buttonVariants({ variant: 'orangeGradient' }), 'flex-1')}>
                    Sign Up
                  </Link>
                </div>
              )
            ) : (
              <div className='h-10 w-full bg-gray-200 animate-pulse rounded-md'></div>
            )}
          </div>

          {/* Navigation items */}
          <div className='flex-1 py-4 px-2'>
            <h3 className='text-sm font-medium text-gray-500 px-2 mb-3'>Navigation</h3>
            <AnimatePresence>
              {navItems.map((item, index) => {
                const active = isLinkActive(item.href);
                return (
                  <motion.div
                    key={item.name}
                    custom={index}
                    variants={menuItemVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    className={cn(
                      'rounded-xl mb-2 overflow-hidden',
                      active ? 'bg-gradient-to-r from-yellow/10 to-orange/10' : 'hover:bg-gray-50'
                    )}>
                    <Link
                      to={item.href}
                      onClick={() => onOpenChange(false)}
                      className='flex items-center py-3 px-4 w-full'>
                      <div className='flex items-center gap-3'>
                        {item.icon && (
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center',
                              active ? 'bg-orange/20' : 'bg-gray-100'
                            )}>
                            <img src={item.icon || '/placeholder.svg'} alt='' className='w-4 h-4' />
                          </div>
                        )}
                        <div className='flex items-center gap-2'>
                          {active && <MateyNavIcon expression='smile' className='w-5 h-5' />}
                          <span className={cn('font-medium', active ? 'text-orange' : 'text-gray-700')}>
                            {item.name}
                          </span>
                        </div>
                      </div>

                      {active && (
                        <motion.div className='ml-auto w-1.5 h-5 bg-orange rounded-full' layoutId='activeIndicator' />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className='mt-auto border-t border-gray-100 p-4'>
            <p className='text-xs text-gray-500 text-center'>
              Â© {new Date().getFullYear()} Matey. All rights reserved.
            </p>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default function Navbar() {
  const location = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isLinkActive = (href: string): boolean => {
    if (href.startsWith('#')) return location.hash === href;
    if (href === '/') return location.pathname === '/';
    return href !== '/' && location.pathname.startsWith(href);
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = isLinkActive(href);
    return (
      <Link
        to={href}
        className={cn(
          'transition-all duration-200 relative mx-1.5',
          active ? 'text-white font-bold' : 'text-Amber-900 hover:text-orange font-medium'
        )}>
        <ActiveNavIndicator isActive={active}>
          <div className='flex items-center gap-1.5 px-4 py-3'>
            {active && <MateyNavIcon expression='smile' />}
            {children}
          </div>
        </ActiveNavIndicator>
      </Link>
    );
  };

  return (
    <motion.div
      className='w-full z-[100] bg-white/50 backdrop-blur-md shadow-sm fixed top-0'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}>
      <div className='max-w-[1450px] mx-auto w-full'>
        {/* Desktop Navigation */}
        <div className='justify-between items-center m-0 hidden md:flex px-6 lg:px-24'>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
            <Link to='/'>
              <Logo />
            </Link>
          </motion.div>

          <NavigationMenu>
            <NavigationMenuList className='m-0 p-0'>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name} className='bg-transparent text-black m-0'>
                  <NavLink href={item.href}>{item.name}</NavLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className='flex items-center gap-2'>
            {isLoaded ? (
              isSignedIn ? (
                <div className='flex items-center gap-2'>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to='/dashboard'
                      className={buttonVariants({
                        variant: 'orangeGradient',
                      })}>
                      Go to Dashboard
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <SignOutButton>
                      <button
                        className={cn(
                          buttonVariants({ variant: 'outline' }),
                          'border-orange text-orange hover:bg-orange/10'
                        )}>
                        Sign Out
                      </button>
                    </SignOutButton>
                  </motion.div>
                </div>
              ) : (
                <div className='flex items-center gap-3'>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to='/signin'
                      className='font-bold transition-all p-1 rounded-md px-3 cursor-pointer hover:text-primary'>
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to='/signup'
                      className={buttonVariants({
                        variant: 'orangeGradient',
                      })}>
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              )
            ) : (
              <div className='h-10 w-20 bg-gray-200 animate-pulse rounded-md'></div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className='flex px-4 py-2 md:hidden items-center justify-between'>
          <Link to='/'>
            <Logo />
          </Link>

          {/* Mobile menu using the extracted component */}
          <MobileNavigation
            isOpen={isMobileMenuOpen}
            onOpenChange={setIsMobileMenuOpen}
            isSignedIn={isSignedIn}
            isLoaded={isLoaded}
          />
        </div>
      </div>
    </motion.div>
  );
}
