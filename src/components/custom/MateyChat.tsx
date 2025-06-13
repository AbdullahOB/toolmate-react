'use client';

import type React from 'react';

import { useState, useEffect, useRef} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ImageIcon, X, Maximize2, ChevronDown, Sparkles, XCircle } from 'lucide-react';
import type { IMateyExpression } from '@/types/types';
import { useAppContext } from '@/context/AppContext';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'matey';
  timestamp: Date;
  expression?: IMateyExpression;
  isToolSuggestion?: boolean;
  isImage?: boolean;
  imageUrl?: string;
  products?: {
    name: string;
    price: number;
    assets: string;
  }[];
};
const mateyResponses = {
  greeting: [
    "G'day mate! Matey here, ready to help with your DIY adventures!",
    "Oi! Matey at your service! What're we building today?",
    "Hello there! Matey's on deck and ready to help with your project!",
    'Howdy partner! Matey here - your trusty tool sidekick!',
    'Top of the morning to ya! Matey reporting for DIY duty!',
  ],
  thinking: [
    'Hmm, let me think about that for a sec...',
    'Scratching my head on this one... just a moment!',
    'Let me dig through my toolbox of knowledge...',
    'Thinking cap is on! Give me a jiffy...',
    'Just working out the nuts and bolts of this question...',
  ],
  general: [
    "Crikey! That's a great question. Let me sort that out for ya.",
    "Fair dinkum! I've got just the answer for that.",
    'Beauty! I know exactly what you need here.',
    "Strewth! You've come to the right place with that question.",
    'Too right! I can definitely help with that one.',
    "Spot on question! Here's what you need to know...",
    "Bonza! I've got some ripper advice for that.",
    "You've stumped me for a sec, but I reckon I've got the answer now!",
    "That's a cracker of a question! Here's my two cents...",
    "Well I'll be! That's something I know a fair bit about.",
  ],
  tools: [
    "For that job, you'll want to get your hands on these beauties...",
    'A true tradie would reach for these tools first...',
    "Based on my experience, these are the tools you'll need in your corner...",
    "I wouldn't start that project without these in my toolkit...",
    'Every DIYer worth their salt would use these for that job...',
  ],
  advice: [
    "Between you and me, here's a little trick of the trade...",
    'Most folks get this wrong, but what you really want to do is...',
    "My old man taught me this technique years ago, and it's never failed me...",
    "Here's something they don't tell you in the instruction manuals...",
    "I learned this the hard way so you don't have to...",
  ],
  encouragement: [
    "You've got this, mate! That project will be a piece of cake with your skills.",
    "With a steady hand like yours, this'll be done in no time!",
    "Trust me, you're asking all the right questions. You're gonna nail this project!",
    'I can tell you know your stuff! This project is right up your alley.',
    "That's the spirit! Tackle it head-on and you'll be wrapped up before you know it.",
  ],
  imageResponse: [
    "Crikey! That's a ripper of an image! Let me have a squiz at what we're dealing with here...",
    'Beauty! Thanks for the visual, mate. Let me analyze what tools you might need for this...',
    "G'day! That's a fair dinkum challenge you've got there. Let me think about the right tools...",
    "Strewth! That's an interesting project you've got. Let me sort out what you'll need...",
    'Well would you look at that! Give me a sec to figure out the best approach here...',
    "Now that's what I call a proper DIY challenge! Let me see what we're working with...",
    "That's a beauty of a project! Let me take a gander and suggest some tools...",
    "Oh, I see what you're up against now! Let me think about the best way to tackle this...",
    'Thanks for the pic, mate! Makes it much easier for me to help you out properly.',
    'Got your image loud and clear! Let me put my thinking cap on for this one...',
  ],
};

const parseStoredMessages = (storedMessages: string | null): Message[] => {
  if (!storedMessages) return [];
  try {
    const parsedMessages = JSON.parse(storedMessages);
    return parsedMessages.map((message: any) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
  } catch (error) {
    console.error('Error parsing stored messages:', error);
    return [];
  }
};

export default function MateyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showEmojiBubble, setShowEmojiBubble] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState<IMateyExpression>('smile');
  const [isCompletingText, setIsCompletingText] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const STORAGE_KEY = 'matey-chat-messages';
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedMessages = localStorage.getItem(STORAGE_KEY);
        const parsedMessages = parseStoredMessages(storedMessages);

        if (parsedMessages.length > 0) {
          setMessages(parsedMessages);
          setIsInitialized(true);
        } else {
          setIsInitialized(false);
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        setIsInitialized(false);
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [messages]);
  useEffect(() => {
    if (isInitialized) {
      setIsOpen(true);
      return;
    }
    const timer = setTimeout(() => {
      setIsOpen(true);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setTimeout(() => {
          setMessages([
            {
              id: '1',
              text: mateyResponses.greeting[Math.floor(Math.random() * mateyResponses.greeting.length)],
              sender: 'matey',
              timestamp: new Date(),
              expression: 'hello',
            },
          ]);
          setIsInitialized(true);
          showRandomEmojiBubble();
        }, 300);
      }, 1000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isInitialized]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const showRandomEmojiBubble = () => {
    const expressions: IMateyExpression[] = ['laugh', 'hello', 'smile', 'offer', '1thumb', '2thumb'];
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    setCurrentEmoji(randomExpression);
    setShowEmojiBubble(true);

    setTimeout(() => {
      setShowEmojiBubble(false);
    }, 3000);
  };
  const handleSendMessage = () => {
    if (inputValue.trim() === '' && !imagePreview) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      isImage: !!imagePreview,
      imageUrl: imagePreview || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setCurrentSuggestion('');
    setImagePreview(null);
    setIsTyping(true);

    setTimeout(() => {
      const isImageMessage = !!userMessage.isImage;
      let randomResponse;

      if (isImageMessage) {
        const randomIndex = Math.floor(Math.random() * mateyResponses.imageResponse.length);
        randomResponse = {
          text: mateyResponses.imageResponse[randomIndex],
          expression: ['smile', 'tool', 'thinking', 'offer'][Math.floor(Math.random() * 4)] as IMateyExpression,
        };
      } else {
        randomResponse = getContextualResponse(userMessage.text);
      }

      setIsTyping(false);

      setTimeout(() => {
        const mateyResponse: Message = {
          id: Date.now().toString(),
          text: randomResponse.text,
          sender: 'matey',
          timestamp: new Date(),
          expression: randomResponse.expression,
        };

        setMessages((prev) => [...prev, mateyResponse]);
        showRandomEmojiBubble();

        if (Math.random() > 0.5) {
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);

              setTimeout(() => {
                const toolSuggestion: Message = {
                  id: Date.now().toString(),
                  text: isImageMessage
                    ? 'Based on that image, here are some tools that might help:'
                    : 'Here are some tools that might help with that job:',
                  sender: 'matey',
                  timestamp: new Date(),
                  expression: 'offer',
                  isToolSuggestion: true,
                  products: [
                    {
                      name: 'Cordless Drill',
                      price: 50,
                      assets: '/assets/images/demo/product2.png',
                    },
                    {
                      name: 'Self-Drill Wall Anchors',
                      price: 15,
                      assets: '/assets/images/demo/product3.png',
                    },
                  ],
                };
                setMessages((prev) => [...prev, toolSuggestion]);
              }, 300);
            }, 1500);
          }, 1000);
        }
      }, 300);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentSuggestion && !isCompletingText) {
        e.preventDefault();
        completeText();
        return;
      }
      handleSendMessage();
      return;
    }
    if (e.key === 'Tab' && currentSuggestion) {
      e.preventDefault();
      completeText();
    }
  };

  const completeText = () => {
    if (!currentSuggestion) return;
    setIsCompletingText(true);
    const remainingText = currentSuggestion.slice(inputValue.length);
    let currentIndex = 0;

    const animateNextChar = () => {
      if (currentIndex < remainingText.length) {
        setInputValue((prev) => prev + remainingText[currentIndex]);
        currentIndex++;
        setTimeout(animateNextChar, 15);
      } else {
        setIsCompletingText(false);
        setCurrentSuggestion('');
      }
    };
    animateNextChar();
  };
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  const clearImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    setCurrentSuggestion('');
    inputRef.current?.focus();
  };
  const clearChatHistory = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
        setMessages([]);
        setIsInitialized(false);
        setTimeout(() => {
          setIsTyping(true);

          setTimeout(() => {
            setIsTyping(false);

            setTimeout(() => {
              setMessages([
                {
                  id: '1',
                  text: mateyResponses.greeting[Math.floor(Math.random() * mateyResponses.greeting.length)],
                  sender: 'matey',
                  timestamp: new Date(),
                  expression: 'hello',
                },
              ]);
              setIsInitialized(true);
              showRandomEmojiBubble();
            }, 300);
          }, 1000);
        }, 500);
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  };

  const getContextualResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    if (
      lowerInput.includes('?') ||
      lowerInput.startsWith('how') ||
      lowerInput.startsWith('what') ||
      lowerInput.startsWith('which') ||
      lowerInput.startsWith('can') ||
      lowerInput.startsWith('where')
    ) {
      return {
        text: 'Great question! ' + mateyResponses.general[Math.floor(Math.random() * mateyResponses.general.length)],
        expression: 'thinking' as IMateyExpression,
      };
    }
    if (
      lowerInput.includes('tool') ||
      lowerInput.includes('drill') ||
      lowerInput.includes('hammer') ||
      lowerInput.includes('saw') ||
      lowerInput.includes('screwdriver')
    ) {
      return {
        text: mateyResponses.tools[Math.floor(Math.random() * mateyResponses.tools.length)],
        expression: 'tool' as IMateyExpression,
      };
    }

    // Check for project mentions
    if (
      lowerInput.includes('project') ||
      lowerInput.includes('build') ||
      lowerInput.includes('make') ||
      lowerInput.includes('create') ||
      lowerInput.includes('construct')
    ) {
      return {
        text:
          mateyResponses.encouragement[Math.floor(Math.random() * mateyResponses.encouragement.length)] +
          ' ' +
          mateyResponses.advice[Math.floor(Math.random() * mateyResponses.advice.length)],
        expression: 'offer' as IMateyExpression,
      };
    }

    // Default response
    return {
      text: mateyResponses.general[Math.floor(Math.random() * mateyResponses.general.length)],
      expression: 'smile' as IMateyExpression,
    };
  };

  // Function to render Matey's expression
  const renderMateyExpression = (expression?: IMateyExpression) => {
    switch (expression) {
      case 'laugh':
        return (
          <motion.img
            src='/assets/matey-emoji/largeSmile.svg'
            alt='excited'
            width={40}
            height={40}
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
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'easeInOut' }}
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 300,
            duration: 0.5,
          }}
          className={`fixed bottom-0 sm:right-2 z-50 flex flex-col 
            ${isExpanded ? 'w-full md:w-[500px] h-full' : 'w-full md:w-[380px] h-[480px] sm:h-[600px]'} 
            bg-white rounded-lg shadow-2xl border-2 border-yellow overflow-hidden `}>
          {/* Chat Header */}
          <div className='bg-gradient-to-r from-yellow to-softYellow p-2 flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <motion.div
                className='w-12 h-12 rounded-full bg-white p-1 overflow-hidden relative'
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 1.5, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}>
                <img
                  src='/assets/matey-emoji/smile.svg'
                  alt='Matey'
                  className='w-full h-full object-cover rounded-full'
                />

                {/* Emoji bubble */}
                <AnimatePresence>
                  {showEmojiBubble && (
                    <motion.div
                      className='absolute -top-12 -right-8 bg-white rounded-full p-2 shadow-lg border-2 border-yellow'
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', damping: 12 }}>
                      <div className='w-8 h-8'>{renderMateyExpression(currentEmoji)}</div>
                      <motion.div
                        className='absolute -bottom-1 right-4 w-3 h-3 bg-white border-r-2 border-b-2 border-yellow transform rotate-45'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <div>
                <motion.h3
                  className='font-bold text-black text-xl'
                  initial={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{
                    duration: 0.1,
                  }}>
                  Matey
                </motion.h3>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='p-3 text-black hover:bg-yellow rounded-full'
                onClick={clearChatHistory}
                title='Clear chat history'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <path d='M3 6h18'></path>
                  <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'></path>
                  <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'></path>
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='p-2 text-black w-10 h-10 flex justify-center hover:bg-yellow rounded-full'
                onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronDown width={18} /> : <Maximize2 width={18} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='p-2 text-black w-10 h-10 flex justify-center  hover:bg-yellow rounded-full'
                onClick={() => setIsOpen(false)}>
                <X width={20} />
              </motion.button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className='flex-1 overflow-y-auto p-4 bg-paleYellow'>
            <AnimatePresence mode='popLayout'>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className='mb-4'>
                  {/* Regular message */}
                  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.sender === 'matey' && (
                      <div className='w-10 h-10 rounded-full mr-2 flex-shrink-0 overflow-hidden'>
                        {renderMateyExpression(message.expression)}
                      </div>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-lightYellow text-black rounded-tr-none border-2 border-yellow'
                          : 'bg-white shadow-md rounded-tl-none'
                      }`}>
                      {message.isImage && message.imageUrl ? (
                        <div className='mb-2'>
                          <img
                            src={message.imageUrl || '/placeholder.svg'}
                            alt='User uploaded'
                            className='rounded-lg max-h-48 w-auto'
                          />
                        </div>
                      ) : null}

                      {message.text && <p className='text-start'>{message.text}</p>}

                      <p className='md:text-md text-start opacity-70 mt-1'>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </motion.div>
                  </div>

                  {/* Tool suggestion card */}
                  {message.isToolSuggestion && message.products && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className='mt-2 w-[80%] ml-12 bg-paleYellow border-2 border-yellow rounded-lg p-2'>
                      <div className='flex gap-2 mb-2'>
                        <img src='/assets/icons/Tick.svg' alt='tick' className='w-5 h-5' />
                        <p className='font-semibold'>Material Suggestions</p>
                      </div>
                      <div className='flex gap-3 overflow-x-auto pb-2'>
                        {message.products.map((product, idx) => (
                          <div className='flex flex-col min-w-[100px]'>
                            <div className='relative overflow-hidden rounded-lg border-2 border-yellow'>
                              <motion.img
                                src={product.assets || '/placeholder.svg'}
                                alt={product.name}
                                className='w-full object-cover'
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                              />
                              <motion.div
                                className='absolute top-1 right-1 bg-yellow rounded-full p-1'
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + idx * 0.2 }}>
                                <Sparkles size={14} />
                              </motion.div>
                            </div>
                            <p className='font-semibold text-darkYellow text-md mt-1'>{product.name}</p>
                            <motion.p
                              className='text-md font-bold'
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 + idx * 0.2 }}>
                              ${product.price}
                            </motion.p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/*typing indicator */}
              {isTyping && (
                <motion.div
                  key='typing-indicator'
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='mb-4 flex justify-start'>
                  <div className='w-10 h-10 rounded-full mr-2 flex-shrink-0 overflow-hidden'>
                    {renderMateyExpression('thinking')}
                  </div>
                  <div className='bg-white p-4 rounded-2xl rounded-tl-none shadow-md'>
                    <div className='flex space-x-2'>
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
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>
          <div className='p-2 bg-white border-t border-gray-180'>
            <div className='flex gap-2 overflow-x-auto hide-scrollbar'>
              <button
                className='px-3 py-1.5 bg-paleYellow text-black rounded-full text-md whitespace-nowrap flex-shrink-0 border border-yellow hover:bg-lightYellow transition-colors'
                onClick={() => handlePromptClick('I need a drill for concrete')}>
                Need a drill for concrete
              </button>
              <button
                className='px-3 py-1.5 bg-paleYellow text-black rounded-full text-md whitespace-nowrap flex-shrink-0 border border-yellow hover:bg-lightYellow transition-colors'
                onClick={() => handlePromptClick('Help with kitchen renovation')}>
                Kitchen renovation
              </button>
              <button
                className='px-3 py-1.5 bg-paleYellow text-black rounded-full text-md whitespace-nowrap flex-shrink-0 border border-yellow hover:bg-lightYellow transition-colors'
                onClick={() => handlePromptClick('What tools for deck building?')}>
                Deck building tools
              </button>
            </div>
          </div>

          {/* Image Preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='p-3 bg-white border-t border-gray-200'>
                <div className='relative'>
                  <img
                    src={imagePreview || '/placeholder.svg'}
                    alt='Preview'
                    className='w-full h-auto max-h-32 object-contain rounded-lg border border-yellow'
                  />
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className='absolute top-1 right-1 bg-white rounded-full p-1 shadow-md'
                    onClick={clearImagePreview}>
                    <XCircle size={18} className='text-red-500' />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Input */}
          <div className='p-3 bg-white border-t border-gray-200'>
            <div className='flex items-center gap-2'>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className='p-2 text-yellow hover:bg-paleYellow rounded-full'
                onClick={handleFileUpload}>
                <ImageIcon size={20} />
                <input type='file' ref={fileInputRef} className='hidden' accept='image/*' onChange={handleFileChange} />
              </motion.button>
              <div className='flex-1 relative'>
                <div className='relative w-full'>
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Ask Matey about your DIY project...'
                    className='w-full p-2 text-md rounded-xl border border-gray-300 focus:border-yellow focus:ring-1 focus:ring-yellow outline-none bg-transparent relative z-10'
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: -15 }}
                whileTap={{ scale: 0.9, rotate: 15 }}
                className='p-3 bg-yellow text-black rounded-full hover:bg-softYellow'
                onClick={handleSendMessage}
                disabled={(inputValue.trim() === '' && !imagePreview) || isCompletingText}>
                <Send size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat Bubble */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          onClick={() => setIsOpen(true)}
          className='fixed bottom-4 right-4 md:right-8 z-50 w-16 h-16 bg-yellow rounded-full shadow-lg flex items-center justify-center'>
          <motion.div
            className='w-12 h-12 rounded-full bg-white p-1 overflow-hidden'
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}>
            <img src='/assets/matey-emoji/hello.svg' alt='Matey' className='w-full h-full object-cover rounded-full' />
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center'>
            {messages.length > 0 ? Math.min(messages.length, 9) : 1}
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
