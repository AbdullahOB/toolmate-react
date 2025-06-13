'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Shield, AlertTriangle, Zap } from 'lucide-react';
import type { Message } from '@/context/AppContext';

interface ChatSidebarProps {
  currentInput: string;
  mateyOutput?: Message;
}

export default function ChatSidebar({ currentInput, mateyOutput }: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState<'tips' | 'safety' | 'disclaimer' | null>(null);
  const [currentTip, setCurrentTip] = useState<string>('');
  const [safetyAlert, setSafetyAlert] = useState<string>('');
  const [disclaimerShown, setDisclaimerShown] = useState<boolean>(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [pulseAnimations, setPulseAnimations] = useState<Set<string>>(new Set());
  const [showSafetyButton, setShowSafetyButton] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && activeTab) {
        handleNotificationClose(activeTab);
      }
    };
    if (activeTab) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeTab]);
  const safetyKeywords = ['drill', 'power tool', 'electrical', 'wire', 'pipe', 'gas', 'heavy', 'ladder', 'height'];
  const proTips = {
    drilling: 'Always mark your spot with a pencil first, measure twice, drill once!',
    hanging: 'Use wall anchors for anything heavier than a picture frame.',
    painting: 'Prime first for the best finish, especially over dark colors.',
    measuring: 'A good level is worth its weight in gold for any project.',
    tools: "Clean your tools after each use, they'll last much longer!",
    safety: "Safety glasses aren't just for show, protect those peepers!",
    default: 'Take your time, rushing leads to mistakes and extra trips to the hardware store.',
  };
  const safetyTips = {
    drilling: '⚠️ Check for pipes and wires before drilling into walls',
    electrical: '🔌 Turn off power at the breaker before any electrical work',
    heavy: '💪 Get help lifting anything over 50 lbs, your back will thank you',
    ladder: '🪜 Maintain 3 points of contact when climbing',
    power: '⚡ Read the manual before using any new power tool',
    default: '🦺 When in doubt, wear safety gear, better safe than sorry!',
  };
  const brandNames = [
    '3M',
    'AEG',
    'Amgrow',
    'Arlec',
    'Bahco',
    'Baumr-AG',
    'Bellini',
    'Black Mulch',
    'Black+Decker',
    'Blundstone',
    'Bolle',
    'Boral',
    'Bosch',
    'Bremick',
    'Brilliant Lighting',
    'British Paints',
    'Brunnings',
    'Buildex',
    'CAT Workwear',
    'CSR Gyprock',
    'Caroma',
    'Cement Australia',
    'Cemix',
    'Clark',
    'ClickClack',
    'Clipsal',
    'Craftright',
    'Crescent',
    'Cyclone',
    'DeWalt',
    'Debco',
    'Decor',
    'Defiant',
    'Deta',
    'Dewalt ToughSystem',
    'Dingo',
    'Dorf',
    'Dremel',
    'Dulux',
    'Duracell',
    'EGO',
    'Energizer',
    'Estilo',
    'Everbilt',
    'Everhard',
    'Ezy Storage',
    'FXD',
    'Festool',
    'Fiskars',
    'Fix-a-Tap',
    'Flexi Storage',
    'Force360',
    'Fuller',
    'Gardenline',
    'GearWrench',
    'Gorilla Glue',
    'Greenworks',
    'Grid Connect',
    'Gripset',
    'Grow Better',
    'HPM',
    'Handy Storage',
    'Hard Yakka',
    'Hikoki',
    'Holman',
    'Honda Power Equipment',
    'Honeywell',
    'IXL',
    'Iccons',
    'Ionmax',
    'Irwell',
    'Irwin',
    'James Hardie',
    'Kincrome',
    'Kinetic',
    'KingGee',
    'Knauf',
    'Liquid Nails',
    'Lucci',
    'Lucerne Mulch',
    'Macsim',
    'Makita',
    'Manutec',
    'Masport',
    'Mercator',
    'Metabo',
    'Milwaukee',
    'Mirabella',
    'Mondella',
    'Munash Organics',
    'Neutrog',
    'Nylex',
    'Oliver Footwear',
    'Ozito',
    'Parkside',
    'Pea Straw Mulch',
    'Philips',
    'Pine Bark Nuggets',
    'Pinnacle',
    'Pinnacle Hardware',
    'Posh',
    'PowerFit',
    'Powers Fasteners',
    'ProChoice',
    'Quikrete',
    'Rack It',
    'Ramset',
    'Raymor',
    'Redwood Mulch',
    'Reece',
    'Richgro',
    'Rockwell',
    'Rocky Point',
    'Rover',
    'Ryobi',
    'SCA',
    'SafeStyle',
    'Scotts Osmocote',
    'Searles',
    'Seasol',
    'Selleys',
    'Sidchrome',
    'Sikaflex',
    'Skil',
    'Spear & Jackson',
    'Stanley',
    'Stanley FatMax',
    'Stanley Fatmax',
    'Steel Blue',
    'Stylus',
    'Sugar Cane Mulch',
    'Sutton Tools',
    'T-Rex',
    'Tactix',
    'Taubmans',
    'Trojan',
    'Varta',
    'Verbatim',
    'Victa',
    'WORX',
    'Wattyl',
    'White Knight',
    'Yard Force',
    'Yates',
    'Zenith',
  ];

  useEffect(() => {
    const text = currentInput.toLowerCase();
    let tipKey = 'default';
    let safetyKey = 'default';
    if (text.includes('drill') || text.includes('hole')) {
      tipKey = 'drilling';
      safetyKey = 'drilling';
    } else if (text.includes('hang') || text.includes('mount')) {
      tipKey = 'hanging';
    } else if (text.includes('paint')) {
      tipKey = 'painting';
    } else if (text.includes('measure') || text.includes('level')) {
      tipKey = 'measuring';
    } else if (text.includes('tool')) {
      tipKey = 'tools';
    }
    const hasSafetyKeyword = safetyKeywords.some((keyword) => text.includes(keyword));
    if (hasSafetyKeyword) {
      setSafetyAlert(safetyTips[safetyKey as keyof typeof safetyTips] || safetyTips.default);
      setShowSafetyButton(true);
      setPulseAnimations((prev) => new Set(prev).add('safety'));
      setTimeout(() => {
        setPulseAnimations((prev) => {
          const newSet = new Set(prev);
          newSet.delete('safety');
          return newSet;
        });
      }, 2000);
    }
    setCurrentTip(proTips[tipKey as keyof typeof proTips] || proTips.default);
  }, [currentInput]);

  useEffect(() => {
    if (currentInput.length > 10 && !activeTab) {
      setPulseAnimations((prev) => new Set(prev).add('tips'));
      setTimeout(() => {
        setPulseAnimations((prev) => {
          const newSet = new Set(prev);
          newSet.delete('tips');
          return newSet;
        });
      }, 2000);
    }
  }, [currentInput, activeTab]);

  useEffect(() => {
    if (mateyOutput && !disclaimerShown) {
      const outputLower = mateyOutput.text.toLowerCase();
      const hasBrandMention = brandNames.some((brand) => outputLower.includes(brand.toLowerCase()));
      if (hasBrandMention) {
        setShowDisclaimer(true);
        setPulseAnimations((prev) => new Set(prev).add('disclaimer'));
        setTimeout(() => {
          setPulseAnimations((prev) => {
            const newSet = new Set(prev);
            newSet.delete('disclaimer');
            return newSet;
          });
        }, 2000);
      }
    }
  }, [mateyOutput, disclaimerShown]);

  const handleNotificationClose = (notificationType: string) => {
    setActiveTab(null);
    if (notificationType === 'disclaimer') {
      setDisclaimerShown(true);
      8;
    }
  };

  return (
    <div ref={sidebarRef} className='fixed right-0 md:right-2 top-10 w-12 pointer-events-none z-10'>
      {/* Contextual Tabs */}
      <AnimatePresence mode='popLayout'>
        <div className='absolute top-20 right-1 space-y-2 pointer-events-auto'>
          {/* Pro Tip Tab */}
          {
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (activeTab === 'tips') {
                    handleNotificationClose('tips');
                  } else {
                    setActiveTab('tips');
                  }
                }}
                className={`relative w-8 h-8 rounded-full shadow-md transition-all duration-200 group ${
                  activeTab === 'tips' ? 'bg-yellow text-white' : 'bg-white text-orange hover:bg-lightYellow'
                } ${pulseAnimations.has('tips') ? 'animate-pulse' : ''}`}
                style={{
                  boxShadow: pulseAnimations.has('tips')
                    ? '0 0 20px rgba(251, 146, 60, 0.6), 0 0 40px rgba(251, 146, 60, 0.3)'
                    : undefined,
                }}>
                <Lightbulb size={16} className='mx-auto drop-shadow-sm' />

                {/* Tooltip */}
                <div
                  className={`absolute right-full ${
                    activeTab === 'tips' ? 'hidden' : 'block'
                  } mr-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none`}>
                  Pro Tip
                  <div className='absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800'></div>
                </div>
              </motion.button>
            </motion.div>
          }

          {/* Safety Tab */}
          {showSafetyButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}>
              <motion.button
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (activeTab === 'safety') {
                    handleNotificationClose('safety');
                  } else {
                    setActiveTab('safety');
                  }
                }}
                className={`relative w-8 h-8 rounded-full shadow-md transition-all duration-200 group ${
                  activeTab === 'safety' ? 'bg-red-500 text-white' : 'bg-white text-red-500 hover:bg-red-50'
                }`}>
                <Shield size={16} className='mx-auto' />

                {/* Tooltip */}
                <div
                  className={`absolute right-full ${
                    activeTab === 'safety' ? 'hidden' : 'block'
                  } mr-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none`}>
                  Safety Alert
                  <div className='absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800'></div>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Brand Disclaimer Tab */}
          {showDisclaimer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}>
              <motion.button
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (activeTab === 'disclaimer') {
                    handleNotificationClose('disclaimer');
                  } else {
                    setActiveTab('disclaimer');
                  }
                }}
                className={`relative w-8 h-8 rounded-full shadow-md transition-all duration-200 group ${
                  activeTab === 'disclaimer' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-50'
                } ${pulseAnimations.has('disclaimer') ? 'animate-pulse' : ''}`}
                style={{
                  boxShadow: pulseAnimations.has('disclaimer')
                    ? '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)'
                    : undefined,
                }}>
                <Shield size={16} className='mx-auto' />

                {/* Tooltip */}
                <div
                  className={`absolute right-full mr-2 ${
                    activeTab === 'disclaimer' ? 'hidden' : 'block'
                  } top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none`}>
                  Brand Disclaimer
                  <div className='absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800'></div>
                </div>
              </motion.button>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      {/* Expandable Content Panels */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{
              type: 'tween',
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              transformOrigin: 'right center',
              willChange: 'transform, opacity',
            }}
            className='absolute top-20 right-12 w-72 bg-white rounded-l-2xl shadow-xl border-l-4 border-orange-400 pointer-events-auto'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.15 }}
              className='p-4'>
              {activeTab === 'tips' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='space-y-3'>
                  <div className='flex items-center gap-2 text-orange-600 font-semibold'>
                    <Lightbulb size={18} />
                    <span>Pro Tip</span>
                  </div>
                  <p className='text-sm text-gray-700 text-start leading-relaxed'>{currentTip}</p>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <Zap size={12} />
                    <span>From Matey's toolbox</span>
                  </div>
                </motion.div>
              )}

              {activeTab === 'safety' && safetyAlert && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='space-y-3'>
                  <div className='flex items-center gap-2 text-red-600 font-semibold'>
                    <AlertTriangle size={18} />
                    <span>Safety First!</span>
                  </div>
                  <p className='text-sm text-start text-gray-700 leading-relaxed'>{safetyAlert}</p>
                  <div className='bg-red-50 border border-red-200 rounded-lg p-2'>
                    <p className='text-sm text-start text-red-700'>
                      Always prioritize safety over speed. Take breaks if you feel unsure.
                    </p>
                  </div>
                </motion.div>
              )}
              {activeTab === 'disclaimer' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='space-y-3'>
                  <div className='flex items-center gap-2 text-blue-600 font-semibold'>
                    <Shield size={18} />
                    <span>Brand Disclaimer</span>
                  </div>
                  <p className='text-sm text-gray-700 text-start leading-relaxed'>
                    Matey's not tied to any brand. He just gives honest advice based on what suits you best for the job.
                  </p>
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-2'>
                    <p className='text-sm text-start text-blue-700'>
                      All brand recommendations are based on general performance and user feedback.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
