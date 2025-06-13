'use client';

import React from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  ImageIcon,
  Sparkles,
  XCircle,
  Wrench,
  Search,
  Settings,
  LogOut,
  User,
  PlusCircle,
  Trash2,
  X,
  Zap,
  Star,
  Menu,
  Clock,
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import BudgetSlider from '@/components/custom/BudgetSlider';
import BudgetTab from '@/components/custom/BudgetSlider/BudgetTab';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import ChatSidebar from '@/components/custom/BudgetSlider/ChatSidebar';
import { Link, useLocation } from 'react-router-dom';
interface ChatMessage {
  id?: string;
  text: string;
  sender?: string;
  timestamp?: Date;
}

interface ChatSession {
  id: string;
  name: string;
  avatar: string | React.ReactNode;
  category: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
// Budget tiers
const budgetTiers = [
  {
    id: 'matesChoice',
    range: [0, 33],
    label: "Mate's Choice",
    description: "Bare-bones kit that'll get the job done without breaking the bank",
    factor: 0.8,
    color: 'bg-green-400',
    emoji: '💰',
  },
  {
    id: 'buildersPick',
    range: [34, 66],
    label: "Builder's Pick",
    description: "Solid middle-ground with reliable tools that won't let you down",
    factor: 1.0,
    color: 'bg-yellow',
    emoji: '🔨',
  },
  {
    id: 'tradiesDream',
    range: [67, 100],
    label: "Tradie's Dream",
    description: 'Top-shelf gear for when you want the job done right first time',
    factor: 1.3,
    color: 'bg-orange',
    emoji: '⭐',
  },
];
const navItem = [
  {
    icon: '/assets/icons/communityNavIcon.svg',
    title: 'Explore Community',
    href: '/explore-community',
  },
  {
    icon: '/assets/icons/userCommunityNavIcon.svg',
    title: 'My Community',
    href: '/my-community',
  },
];

export default function PreviewChat() {
  const location = useLocation();
  const {
    messages,
    inputValue: mainInput,
    setInputValue: setMainInput,
    isTyping,
    inputValue,
    isCompletingText,
    imagePreview,
    isCompressingImage,
    showBudgetSlider,
    currentBudget,
    budgetCompleted,
    suggestedPrompts,
    showSuggestions,
    showUploadButton,
    setShowBudgetSlider,
    estimatedBaseCost,
    handleBudgetTabSelect,
    showBudgetTab,

    // Refs from context
    chatContainerRef,
    fileInputRef,
    inputRef,

    // Functions from context
    handleSendMessage: handleSubmit,
    handleKeyDown,
    handleFileChange,
    clearImagePreview,
    handlePromptClick: handleSuggestionClick,
    clearChatHistory,
    renderMateyExpression,
    handleFileUpload,
    handleBudgetChange,
    handleBudgetComplete,
    handleBudgetCancel,
  } = useAppContext();

  // Local state for UI-specific features (sidebar, mobile, etc.)
  const [chatSessions, setChatSessions] = React.useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null);
  const [currentTier, setCurrentTier] = React.useState('buildersPick');
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const { user } = useUser();
  // Check if mobile on mount
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  const mateyOutput = messages.filter((msg) => msg.sender === 'matey').slice(-1)[0];
  // Create mock chat session for UI compatibility
  useEffect(() => {
    if (messages.length > 0) {
      const mockSession = {
        id: 'main-chat',
        name: messages.length === 1 ? 'New Chat' : messages[1]?.text?.slice(0, 20) + '...' || 'Chat',
        avatar: '2',
        category: 'general',
        messages: messages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setChatSessions([mockSession]);
      setCurrentChatId('main-chat');
    }
  }, [messages]);

  // Update current tier based on budget
  useEffect(() => {
    const tier =
      budgetTiers.find((tier) => currentBudget >= tier.range[0] && currentBudget <= tier.range[1]) || budgetTiers[1];
    setCurrentTier(tier.id);
  }, [currentBudget]);

  // Create new chat (simplified for single chat)
  const createNewChat = () => {
    clearChatHistory();
  };

  // Delete chat (simplified for single chat)
  const deleteChat = () => {
    clearChatHistory();
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Format timestamp
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };
  return (
    <div className='w-full h-screen'>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='w-full h-full mx-auto'>
        {/* Main Container */}
        <div className='flex h-full bg-white rounded-none'>
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`${
                  isMobile ? 'absolute z-50 h-full' : 'relative'
                } w-80 bg-gradient-to-b from-white to-whiteYellow border-r border-yellow/20 backdrop-blur-xl`}>
                <div className='flex flex-col h-full'>
                  {/* Sidebar Header */}
                  <div className='p-6 bg-gradient-to-tr from-yellow to-lightOrange text-orange border-orange  hover:text-white'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <motion.div
                          className='w-12 h-12 rounded-2xl overflow-hidden relative'
                          animate={{ rotate: [0, -3, 3, -3, 0] }}
                          transition={{
                            duration: 2,
                            delay: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatDelay: 5,
                            ease: 'easeInOut',
                          }}>
                          <Avatar className='w-full h-full'>
                            <AvatarImage src='/assets/matey-emoji/largeSmile.svg' alt='Matey' />
                            <AvatarFallback className='bg-gradient-to-br from-orange to-yellow text-white font-bold'>
                              M
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <div>
                          <h2 className='font-bold text-xl text-white'>Matey</h2>
                          <p className='text-sm text-white/80'>Your DIY Assistant</p>
                        </div>
                      </div>
                      {isMobile && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={toggleSidebar}
                          className='text-white hover:bg-white/20'>
                          <X size={20} />
                        </Button>
                      )}
                    </div>

                    {/* Search */}
                    <div className='mt-4 relative'>
                      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4' />
                      <input
                        type='text'
                        placeholder='Search chats...'
                        className='pl-10 bg-white/20 text-white rounded-2xl outline-none py-2 px-4 w-full placeholder:text-white/70 focus:ring-2 focus:ring-yellow/30 transition-all duration-200'
                      />
                    </div>
                  </div>

                  {/* New Chat Button */}
                  <div className='p-4'>
                    <Button
                      onClick={createNewChat}
                      className='w-full bg-gradient-to-r from-orange to-lightOrange text-white shadow-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02] rounded-xl flex items-center'
                      size='lg'>
                      <div className='flex items-center gap-2'>
                        <PlusCircle size={20} />
                        <span>New Chat</span>
                      </div>
                      <Sparkles size={16} className='ml-auto' />
                    </Button>
                    <div className={`flex flex-col space-y-1`}>
                      {navItem.map((item, index) => (
                        <Link
                          to={item.href}
                          key={index}
                          className='flex items-center gap-2 py-2 px-4 bg-softYellow cursor-pointer rounded-lg'>
                          <img src={item.icon} alt={item.title} className='w-8 h-8' />
                          <p className='font-semibold text-md'>{item.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Chat List */}
                  <div className='flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-yellow/20 scrollbar-track-transparent'>
                    <h3 className='text-sm font-semibold text-gray-500 px-2 py-3 uppercase tracking-wider'>
                      Recent Chats
                    </h3>
                    <div className='space-y-2'>
                      {chatSessions.map((chat) => (
                        <motion.div key={chat.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Card
                            className={`cursor-pointer transition-all duration-300 hover:shadow-md group ${
                              chat.id === currentChatId
                                ? 'bg-gradient-to-r from-yellow/20 to-lightYellow border-yellow/40'
                                : 'hover:bg-yellow/10 border-transparent'
                            }`}
                            onClick={() => setCurrentChatId(chat.id)}>
                            <CardContent className='px-2 py-3'>
                              <div className='flex justify-end'>
                                <span className='text-sm text-gray-600 flex items-center gap-1'>
                                  <Clock size={14} />
                                  {formatTimestamp(chat.updatedAt)}
                                </span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <div className='flex items-center gap-3 rounded-xl p-2'>
                                  <div className='w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-orange-1 to-yellow-orange-0 text-xl flex items-center justify-center shadow-md group-hover:scale-110 duration-300 transition-all'>
                                    {chat.avatar}
                                  </div>
                                  <div className='flex flex-col items-start'>
                                    <p className='font-semibold text-gray-900 truncate text-base'>{chat.name}</p>
                                    <p className='text-sm text-gray-600 text-start'>
                                      {chat.messages[chat.messages.length - 1]?.text.slice(0, 35) || 'No messages'}...
                                    </p>
                                  </div>
                                </div>

                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat();
                                  }}
                                  className='opacity-0 group-hover:opacity-100 rounded-full text-red-500 hover:bg-red-100 transition-all duration-200 flex-shrink'>
                                  <Trash2 size={18} />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Footer */}
                  <div className='p-4 border-t border-yellow/20 bg-gradient-to-r from-whiteYellow to-paleYellow'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='w-10 h-10'>
                          <AvatarImage
                            className='rounded-full w-10 h-10 object-cover border-yellow/10'
                            src={user?.imageUrl || '/placeholder.svg?height=32&width=32'}
                            alt={user?.fullName || 'User Avatar'}
                          />
                          <AvatarFallback className='bg-gradient-to-r from-orange to-yellow text-white'>
                            <User size={18} />
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col items-start'>
                          <span className='font-semibold text-base text-gray-700'>
                            {user ? user?.fullName : 'DIY Enthusiast'}
                          </span>
                          <span className='text-sm text-gray-500'>
                            {user ? user?.emailAddresses[0]?.emailAddress : ''}
                          </span>
                        </div>
                      </div>
                      <div className='flex gap-1'>
                        <Button variant='ghost' size='sm' className='text-gray-600 hover:bg-yellow/20'>
                          <Settings size={18} />
                        </Button>
                        <Button variant='ghost' size='sm' className='text-gray-600 hover:bg-yellow/20'>
                          <LogOut size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Chat Area  */}
          <div
            style={{ backgroundImage: "url('/assets/images/dashBG.jpg')" }}
            className='flex-1 flex flex-col w-full h-full bg-center bg-cover bg-no-repeat'>
            {/* Chat Header */}
            <div className='p-4 md:p-6 border-b border-yellow/20 bg-white/90 backdrop-blur-sm flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                {!sidebarOpen && (
                  <Button variant='ghost' size='sm' onClick={toggleSidebar} className='text-orange hover:bg-yellow/20'>
                    <Menu size={20} />
                  </Button>
                )}

                <div className='flex items-center gap-3'>
                  <motion.div
                    className='w-12 h-12 rounded-full'
                    animate={{ rotate: [0, -3, 3, -3, 0] }}
                    transition={{
                      duration: 2,
                      delay: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 5,
                      ease: 'easeInOut',
                    }}>
                    <Avatar className='w-full h-full'>
                      <AvatarImage src='/assets/matey-emoji/largeSmile.svg' alt='Matey' />
                    </Avatar>
                  </motion.div>
                  <div>
                    <h2 className='font-bold text-start text-md text-gray-900'>Say Hi to Matey</h2>
                    <div className='flex items-center gap-2'>
                      <motion.div
                        className='w-2 h-2 bg-green-500 rounded-full'
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                      <span className='text-sm text-gray-500'>Online</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant='outline'
                size='sm'
                onClick={clearChatHistory}
                className='border-yellow/40 text-orange hover:bg-yellow/20 transition-all duration-200 hover:scale-105'>
                <Trash2 size={18} />
              </Button>
            </div>

            {/* Messages Area */}
            <div
              ref={chatContainerRef}
              className={`flex-1 overflow-y-auto hide-scrollbar w-full md:w-[60%] mx-auto px-3 md:px-6 py-6 space-y-2 scrollbar-thin scrollbar-thumb-yellow/20 scrollbar-track-transparent ${
                showBudgetSlider ? 'pb-32' : 'pb-6'
              }`}>
              <AnimatePresence mode='popLayout'>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex flex-col w-full ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} w-[91%] mb-2`}>
                      {message.sender === 'matey' && (
                        <div className='w-14 h-14 rounded-full p-2'>{renderMateyExpression(message.expression)}</div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={` flex gap-2 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                        <Card
                          className={`shadow-lg border-0 transition-all duration-300 ${
                            message.sender === 'user' ? 'bg-lightYellow text-white' : 'bg-white border border-yellow'
                          }`}>
                          <CardContent className='px-4 py-2 md:p-6'>
                            {message.isImage && message.imageUrl && (
                              <div className='mb-4'>
                                <img
                                  src={message.imageUrl || '/placeholder.svg?height=200&width=300'}
                                  alt='User uploaded'
                                  className='rounded-2xl max-h-64 w-auto shadow-md'
                                />
                              </div>
                            )}

                            <p
                              className={`text-start text-base md:text-lg leading-relaxed max-w-64 sm:max-w-72 md:max-w-80 lg:max-w-[600px] ${
                                message.sender === 'user' ? 'text-black' : 'text-gray-800'
                              }`}>
                              {message.text}
                            </p>

                            <div className='flex items-center justify-end gap-2 mt-1'>
                              <span className={`text-sm ${message.sender === 'user' ? 'text-black' : 'text-gray-500'}`}>
                                {message.timestamp.getHours().toString().padStart(2, '0')}:
                                {message.timestamp.getMinutes().toString().padStart(2, '0')}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                        {message.sender === 'user' && (
                          <div className='w-8 h-8 rounded-full overflow-hidden shadow-lg flex-shrink-0'>
                            <Avatar className='w-full h-full'>
                              <AvatarImage
                                className='w-full h-full object-cover'
                                src={user?.imageUrl}
                                alt='User Avatar'
                              />
                              <AvatarFallback className='bg-white text-orange font-bold w-full h-full flex items-center justify-center'>
                                U
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Tool suggestions */}
                    {message.isToolSuggestion && message.products && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className='ml-9 md:ml-14 w-[80%] self-start lg:w-[71%]'>
                        <Card className='bg-gradient-to-br from-white to-whiteYellow border-yellow/30 shadow-xl'>
                          <CardContent className='p-6'>
                            <div className='flex gap-4 mb-6 items-center'>
                              <div className='bg-gradient-to-br from-yellow to-lightYellow p-3 rounded-2xl shadow-lg'>
                                <Wrench className='text-white' size={24} />
                              </div>
                              <div>
                                <h3 className='font-bold text-md md:text-xl text-start text-gray-900'>
                                  Tools Recommendation
                                </h3>
                              </div>
                            </div>

                            <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-yellow/30 scrollbar-track-transparent'>
                              {message.products.map((product, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 + idx * 0.1 }}
                                  className='group cursor-pointer flex-shrink-0 w-32 md:w-36'>
                                  <Card className='overflow-hidden hover:shadow-xl transition-all duration-300 aspect-square'>
                                    <CardContent className='p-0 relative'>
                                      <img
                                        src={product.assets || '/placeholder.svg?height=120&width=120'}
                                        alt={product.name}
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                                      />
                                      <motion.div
                                        className='absolute top-2 right-2 bg-yellow rounded-full p-1.5'
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + idx * 0.2 }}>
                                        <Sparkles size={16} className='text-white' />
                                      </motion.div>

                                      <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 flex items-end p-3'>
                                        <Star size={16} className='text-white' />
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <div className='mt-3 space-y-1'>
                                    <p className='font-semibold text-gray-900 text-start text-sm leading-tight line-clamp-2'>
                                      {product.name}
                                    </p>
                                    <div className='flex items-center gap-2'>
                                      <span className='text-lg font-bold text-orange'>${product.price}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    key='typing-indicator'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='flex justify-start'>
                    <div className='w-14 h-14 rounded-full p-2'>{renderMateyExpression('thinking')}</div>

                    <Card className='bg-white shadow-lg border-yellow/20'>
                      <CardContent className='p-6'>
                        <div className='flex space-x-2'>
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ y: [0, -8, 0] }}
                              transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 0.8,
                                delay: i * 0.2,
                                ease: 'easeInOut',
                              }}
                              className='w-3 h-3 bg-yellow rounded-full'
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggestion prompts for new users */}
              {showSuggestions && messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className='mt-8 max-w-4xl hidden md:block mx-auto'>
                  <div className='text-center mb-8'>
                    <div className='flex justify-center'>
                      <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                        G'day! What can I help you with today? 🛠️
                      </h3>
                    </div>
                    <p className='text-gray-600'>Choose a project or ask me anything about DIY</p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {suggestedPrompts.map((prompt, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}>
                        <Card
                          className='cursor-pointer bg-gradient-to-br from-yellow to-orange text-white border-white/20 hover:shadow-xl transition-all duration-300 group'
                          onClick={() => handleSuggestionClick(prompt)}>
                          <CardContent className='p-6'>
                            <div className='flex items-center gap-4'>
                              <span className='text-3xl group-hover:scale-110 transition-transform duration-300'>
                                💡
                              </span>
                              <div className='text-left flex-1'>
                                <span className='font-semibold text-lg block'>{prompt}</span>
                                <span className='text-white/80 text-sm'>Tap to get started</span>
                              </div>
                              <Zap
                                size={20}
                                className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            <ChatSidebar currentInput={inputValue} mateyOutput={mateyOutput} />
            {/* Budget Components */}
            {showBudgetTab && (
              <div>
                <BudgetTab
                  onSelect={handleBudgetTabSelect}
                  baseCost={estimatedBaseCost}
                  onCancel={handleBudgetCancel}
                  location={location.pathname}
                />
              </div>
            )}
            {showBudgetSlider && (
              <div className='px-4 md:px-6 pt-4'>
                <BudgetSlider
                  onBudgetChange={handleBudgetChange}
                  isActive={showBudgetSlider && !budgetCompleted}
                  onComplete={handleBudgetComplete}
                  onCancel={handleBudgetCancel}
                  showBudget={setShowBudgetSlider}
                  baseCost={estimatedBaseCost}
                />
              </div>
            )}

            {/* Image preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='p-4 md:p-6 bg-gradient-to-r from-whiteYellow to-paleYellow border-t border-yellow/20'>
                  <Card className='max-w-md mx-auto shadow-lg'>
                    <CardContent className='p-4 text-center'>
                      <p className='text-sm font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2'>
                        <Sparkles size={16} className='text-orange' />
                        Your photo is ready to send!
                      </p>
                      <div className='relative'>
                        <img
                          src={imagePreview || '/placeholder.svg?height=200&width=300'}
                          alt='Preview'
                          className='w-full h-auto max-h-48 object-contain rounded-2xl border-2 border-yellow/30 shadow-lg'
                        />
                        <Button
                          variant='destructive'
                          size='sm'
                          className='absolute -top-2 -right-2 rounded-full p-2 hover:scale-110 transition-transform'
                          onClick={clearImagePreview}>
                          <XCircle size={18} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className='p-2 md:p-2 container mx-auto'>
              <div className=' mx-auto bg-white/90 backdrop-blur-sm rounded-2xl w-full md:w-[60%] shadow-lg p-4'>
                <div className=''>
                  {/* Input Container */}
                  <div className='mx-auto relative'>
                    <div className='w-full'>
                      <Input
                        ref={inputRef}
                        value={mainInput}
                        onChange={(e) => setMainInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='What are ya tackling today, mate?'
                        className='text-md md:text-lg preview_input py-2 md:py-4 border-none outline-none ring-0 focus:outline-none focus:border-none focus:ring-0 focus:shadow-none'
                      />

                      {/* Suggestions Dropdown */}
                      <AnimatePresence>
                        {showSuggestions && suggestedPrompts.length > 0 && mainInput.trim() !== '' && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className='absolute left-0 right-0 bottom-full mb-2 z-20'>
                            <Card className='shadow-2xl border-2 border-yellow/30 backdrop-blur-xl'>
                              <CardContent className='p-0'>
                                {suggestedPrompts.map((prompt, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className='p-4 hover:bg-gradient-to-r hover:from-whiteYellow hover:to-paleYellow text-start cursor-pointer border-b border-yellow/20 last:border-b-0 transition-all group'
                                    onClick={() => handleSuggestionClick(prompt)}>
                                    <div className='flex items-center gap-3'>
                                      <Sparkles
                                        size={16}
                                        className='text-orange group-hover:text-darkYellow transition-colors'
                                      />
                                      <span className='text-gray-700 group-hover:text-gray-900 font-medium'>
                                        {prompt}
                                      </span>
                                    </div>
                                  </motion.div>
                                ))}
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Send Button */}
                      <div className='flex items-center justify-between w-full mt-2 gap-2'>
                        {/* Upload Button */}
                        {
                          <Button
                            variant='outline'
                            size='lg'
                            onClick={handleFileUpload}
                            disabled={isCompressingImage || !showUploadButton}
                            className={`px-2 bg-gradient-to-tr from-orange to-lightOrange text-white shadow-lg transition-all duration-300 hover:scale-105 rounded-xl`}>
                            {isCompressingImage ? (
                              <motion.div
                                className='h-5 w-5 border-2 border-white border-t-transparent rounded-full'
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                              />
                            ) : (
                              <ImageIcon size={20} />
                            )}

                            <input
                              type='file'
                              ref={fileInputRef}
                              className='hidden'
                              accept='image/*'
                              onChange={handleFileChange}
                            />
                          </Button>
                        }
                        <Button
                          size='lg'
                          onClick={handleSubmit}
                          disabled={
                            (mainInput.trim() === '' && !imagePreview) || isCompletingText || isCompressingImage
                          }
                          className='px-2 bg-gradient-to-tr from-orange to-lightOrange text-white shadow-lg transition-all duration-300 hover:scale-105 rounded-xl'>
                          <Send size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Text */}
                <div className='text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-2'>
                  <Zap size={14} className='text-orange' />
                  <span className='text-start'>Matey can make mistakes. Consider checking important info.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
