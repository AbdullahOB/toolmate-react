'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wrench } from 'lucide-react';

type Product = {
  name: string;
  price: number;
  assets: string;
};

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'matey';
  timestamp: Date;
  expression?: 'hello' | 'laugh' | 'smile' | 'offer' | '1thumb' | '2thumb' | 'tool' | 'thinking';
  isToolSuggestion?: boolean;
  products?: Product[];
  isBudgetSlider?: boolean;
};

type PromptPreviewProps = {
  projectChat: Message[];
};

export default function PromptPreview({ projectChat }: PromptPreviewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiBubble, setShowEmojiBubble] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>('smile');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const animationStartedRef = useRef(false);
  const timeoutIdsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];
  };

  const addTimeout = (callback: () => void, delay: number): NodeJS.Timeout => {
    const id = setTimeout(() => {
      callback();
      timeoutIdsRef.current = timeoutIdsRef.current.filter((timeoutId) => timeoutId !== id);
    }, delay);
    timeoutIdsRef.current.push(id);
    return id;
  };
  useEffect(() => {
    setMessages([]);
    clearAllTimeouts();
    animationStartedRef.current = false;
    let messageIndex = 0;
    const processChat = () => {
      if (messageIndex >= projectChat.length) {
        setIsTyping(false);
        return;
      }
      const newMessage = projectChat[messageIndex];
      setIsTyping(newMessage.sender === 'matey');
      addTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        if (newMessage.sender === 'matey') {
          showRandomEmojiBubble(newMessage.expression);
        }
        setIsTyping(false);
        messageIndex++;
        addTimeout(() => {
          processChat();
        }, 800);
      }, 1200);
    };
    processChat();
    return () => {
      clearAllTimeouts();
    };
  }, [projectChat]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, isTyping]);

  const showRandomEmojiBubble = (expression?: string) => {
    if (!expression) {
      const expressions = ['laugh', 'hello', 'smile', 'offer', '1thumb', '2thumb'];
      expression = expressions[Math.floor(Math.random() * expressions.length)];
    }
    setCurrentEmoji(expression);
    setShowEmojiBubble(true);
    setTimeout(() => {
      setShowEmojiBubble(false);
    }, 3000);
  };

  const renderMateyExpression = (expression?: string) => {
    const emojiClass = 'animate-rotate-shake';

    switch (expression) {
      case 'laugh':
        return (
          <motion.img
            src='/assets/matey-emoji/largeSmile.svg'
            alt='excited'
            width={40}
            height={40}
            className={emojiClass}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'easeInOut' }}
          />
        );
      case 'hello':
        return (
          <motion.img
            src='/assets/matey-emoji/hello.svg'
            alt='hello'
            width={40}
            height={40}
            className={emojiClass}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'easeInOut' }}
          />
        );
      case 'smile':
        return (
          <motion.img
            src='/assets/matey-emoji/smile.svg'
            alt='happy'
            width={40}
            height={40}
            className={emojiClass}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'easeInOut' }}
          />
        );
      case 'offer':
        return (
          <motion.img
            src='/assets/matey-emoji/take.svg'
            alt='offer'
            width={40}
            height={40}
            className={emojiClass}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'easeInOut' }}
          />
        );
      case '1thumb':
        return (
          <motion.img
            src='/assets/matey-emoji/thumb1.svg'
            alt='thumb1'
            width={40}
            height={40}
            className={emojiClass}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'easeInOut' }}
          />
        );
      case '2thumb':
        return (
          <motion.img
            src='/assets/matey-emoji/thumbs2.svg'
            alt='thumb2'
            width={40}
            height={40}
            className={emojiClass}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'easeInOut' }}
          />
        );
      case 'tool':
        return (
          <motion.img
            src='/assets/matey-emoji/tool.svg'
            alt='tool'
            width={40}
            height={40}
            className={emojiClass}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'easeInOut' }}
          />
        );
      case 'thinking':
        return (
          <motion.img
            src='/assets/matey-emoji/thinking.svg'
            alt='thinking'
            width={40}
            height={40}
            className={emojiClass}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'easeInOut' }}
          />
        );
      default:
        return (
          <motion.img
            src='/assets/matey-emoji/smile.svg'
            alt='default'
            width={40}
            height={40}
            className={emojiClass}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'easeInOut' }}
          />
        );
    }
  };

  return (
    <div className='relative w-full h-full'>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='w-full h-full bg-gradient-to-br rounded-2xl md:rounded-[1.8rem] from-yellow/10 to-softYellow/20 backdrop-blur-sm border-2 border-yellow/50 overflow-hidden'>
        <div className='bg-gradient-to-r from-yellow to-softYellow p-2 md:p-4 flex items-center gap-4'>
          <div className='flex items-center gap-4'>
            <motion.div
              className='sm:w-16 sm:h-16 w-12 h-12 rounded-full bg-white p-1 overflow-hidden relative shadow-lg'
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 1.5, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}>
              <img
                src='/assets/matey-emoji/smile.svg'
                alt='Matey'
                className='w-full h-full object-cover rounded-full'
              />
              <AnimatePresence>
                {showEmojiBubble && (
                  <motion.div
                    className='absolute -top-16 -right-8 bg-white rounded-full p-3 shadow-lg border-2 border-yellow'
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 12 }}
                    style={{ borderRadius: '60% 40% 50% 45%' }}>
                    <div className='w-10 h-10'>{renderMateyExpression(currentEmoji)}</div>
                    <motion.div
                      className='absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-yellow transform rotate-45'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <div className='flex flex-col'>
              <motion.h2
                className='font-bold text-black text-xl sm:text-2xl'
                initial={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.1 }}>
                Matey
              </motion.h2>
              <p className='text-black/70 text-md'>Knows Tools Talks Straight</p>
            </div>
          </div>
        </div>
        <div ref={chatContainerRef} className='flex-1 overflow-y-auto h-[500px] md:h-[670px] px-2 py-6 bg-white/40'>
          <AnimatePresence mode='popLayout'>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='mb-4'>
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.sender === 'matey' && (
                    <div className='sm:w-12 sm:h-12 w-10 h-10 rounded-full flex-shrink-0 overflow-hidden'>
                      {renderMateyExpression(message.expression)}
                    </div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative max-w-[80%] p-3 md:p-5 ml-2 sm:ml-0 rounded-2xl border
                      ${
                        message.sender === 'user'
                          ? 'bg-lightYellow text-black border-yellow shadow-md rounded-tr-none'
                          : 'bg-white shadow-lg rounded-tl-none border-gray-300'
                      }`}>
                    {message.text && <p className='text-start sm:text-lg text-md'>{message.text}</p>}
                  </motion.div>
                </div>
                {message.isToolSuggestion && message.products && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                      borderRadius: '0px 35px 0px 25px',
                    }}
                    className='mt-3 w-[80%] ml-12 bg-gradient-to-r from-paleYellow to-white border-2 border-yellow rounded-xl p-4 shadow-lg'>
                    <div className='flex gap-3 mb-3 items-center'>
                      <div className='bg-yellow p-2 rounded-full'>
                        <Wrench className='text-white' size={20} />
                      </div>
                      <p className='font-bold sm:text-lg text-md'>Tools Recommendation</p>
                    </div>
                    <div className='flex gap-5 overflow-x-auto pb-2'>
                      {message.products.map((product, idx) => (
                        <motion.div
                          key={idx}
                          className='flex flex-col'
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 * idx }}>
                          <div
                            className='relative overflow-hidden rounded-xl border-2 border-yellow shadow-md'
                            style={{ borderRadius: '15px 25px 20px 30px' }}>
                            <motion.img
                              src={
                                idx === 0
                                  ? '/assets/images/demo/product1.png'
                                  : idx === 1
                                  ? '/assets/images/demo/product2.png'
                                  : '/assets/images/demo/product3.png'
                              }
                              alt={product.name}
                              className='w-full object-cover'
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                            />
                            <motion.div
                              className='absolute top-2 right-2 bg-yellow rounded-full p-1.5'
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + idx * 0.2 }}>
                              <Sparkles size={16} className='text-white' />
                            </motion.div>
                          </div>
                          <p className='font-semibold text-darkYellow sm:text-lg text-md text-start mt-2'>
                            {product.name}
                          </p>
                          <motion.div
                            className='flex items-center gap-2'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 + idx * 0.2 }}>
                            <span className='sm:text-lg text-md font-semibold'>${product.price}</span>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                key='typing-indicator'
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='mb-6 flex justify-start'>
                <div className='sm:w-12 sm:h-12 w-9 h-9 rounded-full mr-3 flex-shrink-0 overflow-hidden'>
                  {renderMateyExpression('thinking')}
                </div>
                <div
                  className='bg-white p-5 shadow-lg'
                  style={{
                    borderRadius: '5px 25px 25px 25px',
                    clipPath: 'polygon(0% 15%, 5% 0%, 100% 0%, 100% 85%, 95% 100%, 0% 100%)',
                  }}>
                  <div className='flex space-x-1'>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6, delay: 0 }}
                      className='w-2 h-2 bg-yellow rounded-full'
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6, delay: 0.2 }}
                      className='w-2 h-2 bg-yellow rounded-full'
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6, delay: 0.4 }}
                      className='w-2 h-2 bg-yellow rounded-full'
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
