"use client";
import React, { useMemo, useCallback, useRef } from "react";
import { useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import {
  Send,
  ImageIcon,
  Sparkles,
  XCircle,
  Wrench,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal,
  Zap,
  Star,
  Shield,
  Hammer,
} from "lucide-react";
import { useSubscription } from "@/context/SubscriptionDetailsContext";
import CursorEffect from "../CursorEffect/CursorEffect";
import BudgetSlider from "./BudgetSlider";
import BudgetTab from "./BudgetSlider/BudgetTab";
import ChatSidebar from "./BudgetSlider/ChatSidebar";
import { useLocation } from "react-router-dom";
import { ReportModal } from "./flag features/ReportModal";
import { useAppContext } from "@/context/AppContext";
import ExplanationModal from "./flag features/ExplanationModal";

const MAX_FREE_UPLOADS = 2;

export default function HeroChat() {
  const inputRef = useRef<HTMLInputElement>(null);
  const didOpenScroll = useRef(false);
  const lastScrollPosition = useRef(0);
  const resizeDebounce = useRef<number>();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    showEmojiBubble,
    currentEmoji,
    isCompletingText,
    imagePreview,
    isCompressingImage,
    suggestedPrompts,
    showSuggestions,
    uploadCount,
    showUploadButton,
    showPrompt,
    showBudgetSlider,
    budgetCompleted,
    showBudgetTab,
    estimatedBaseCost,
    activeMessageId,
    copiedMessageId,

    // Refs from context
    chatContainerRef,
    fileInputRef,
    scrollContainerRef,

    // Functions from context
    handleSendMessage,
    handleKeyDown,
    getSuggestionsForInput,
    handleFileChange,
    clearImagePreview,
    handlePromptClick,
    clearChatHistory,
    renderMateyExpression,
    handleFileUpload,
    handleBudgetChange,
    handleBudgetTabSelect,
    handleBudgetComplete,
    handleBudgetCancel,
    handleTouchStart,
    handleTouchEnd,
    setIsMobileChatOpened,
    isMobileChatOpened,

    // App-specific state
    selectedPrompt,
    setIsMobileFullHeight,
    isMobileFullHeight,
    setActiveMessageId,
    setCopiedMessageId,
    showExplanationModal,
    setShowExplanationModal,
    setCurrentExplanation,
    setCurrentToolName,
    setHoveredMessageId,
    setShowReportModal,
    hoveredMessageId,
    setShowDropdown,
    showDropdown,
    handleDropdownAction,
    feedbackAnimations,
    showReportModal,
    onClose,
    currentToolName,
    currentExplanation,
  } = useAppContext();

  const { subscriptionData } = useSubscription();
  const mobileAnimationVariants = useMemo(
    () => ({
      initial:
        isMobile || shouldReduceMotion ? { opacity: 0 } : { y: 20, opacity: 0 },
      animate:
        isMobile || shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 },
      exit:
        isMobile || shouldReduceMotion
          ? { opacity: 0 }
          : { y: -10, opacity: 0 },
      transition:
        isMobile || shouldReduceMotion ? { duration: 0.2 } : { duration: 0.5 },
    }),
    [isMobile, shouldReduceMotion]
  );

  const messageAnimationVariants = useMemo(
    () => ({
      initial:
        isMobile || shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
      animate:
        isMobile || shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
      transition:
        isMobile || shouldReduceMotion ? { duration: 0.15 } : { duration: 0.3 },
    }),
    [isMobile, shouldReduceMotion]
  );

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobileFullHeight(true);
      setIsMobileChatOpened(true);
    }
  }, [setIsMobileFullHeight, setIsMobileChatOpened]);

  const resetMobileState = useCallback(() => {
    if (window.innerWidth <= 768) {
      setIsMobileFullHeight(false);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    }
  }, [setIsMobileFullHeight]);

  const focusAndAlignInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    if (window.innerWidth <= 768) {
      setIsMobileChatOpened(true);
      didOpenScroll.current = false;

      // Focus the input first without scrolling
      el.focus({ preventScroll: true });

      // Simple, gentle scroll with a short delay
      setTimeout(() => {
        // For Chrome, use a more direct approach with less animation
        if (navigator.userAgent.indexOf("Chrome") > -1) {
          // Position the input near the middle of the screen
          const inputRect = el.getBoundingClientRect();
          const targetScroll =
            window.scrollY + inputRect.top - window.innerHeight / 2;

          window.scrollTo({
            top: targetScroll,
            behavior: "auto", // Use auto instead of smooth to avoid bouncing
          });
        } else {
          // For other browsers like Safari, use the default scrollIntoView
          el.scrollIntoView({
            block: "start",
            behavior: "smooth", // Use auto for a more immediate response
          });
        }
        didOpenScroll.current = true;
      }, 150); // Shorter delay for more immediate response
    }
  }, [setIsMobileChatOpened]);

  const unFocusAndRestore = useCallback(() => {
    if (window.innerWidth <= 768) {
      inputRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, []);

  // Always ensure the tagline is visible regardless of keyboard state or device
  useLayoutEffect(() => {
    const ensureTaglineVisibility = () => {
      const header = document.querySelector(".matey-header") as HTMLElement;
      if (header) {
        header.style.display = "flex";

        const tagline = header.querySelector(".tagline") as HTMLElement;
        if (tagline) {
          tagline.style.display = "block";
        }
      }
    };

    // Run immediately and set up an interval to continuously check
    ensureTaglineVisibility();
    const intervalId = setInterval(ensureTaglineVisibility, 500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    if (window.innerWidth <= 768) {
      setIsMobileFullHeight(true);
      focusAndAlignInput();
    }
    const onViewportResize = () => {
      // Ensure header is always visible by adjusting its position when keyboard appears/disappears
      const header = document.querySelector(".matey-header") as HTMLElement;
      if (header) {
        header.classList.add("sticky", "top-0", "z-40");

        // Force the header to be shown
        header.style.display = "flex";

        // Ensure the tagline is visible
        const tagline = header.querySelector(".tagline") as HTMLElement;
        if (tagline) {
          tagline.style.display = "block";
        }
      }
    };

    visualViewport.addEventListener("resize", onViewportResize);
    // Initial call to ensure header is visible
    onViewportResize();

    return () => {
      visualViewport.removeEventListener("resize", onViewportResize);
      window.clearTimeout(resizeDebounce.current);
    };
  }, [setIsMobileFullHeight, focusAndAlignInput]);

  //  when user aggersviley scroll down close the chat
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      // Handle scroll detection for mobile
      const handleScroll = () => {
        const currentScrollPosition = window.scrollY;

        // If user is scrolling down and chat is open, close it
        if (
          currentScrollPosition > lastScrollPosition.current + 50 &&
          isMobileChatOpened
        ) {
          console.log("scrolling down", currentScrollPosition);
          // setIsMobileChatOpened(false);
        }

        lastScrollPosition.current = currentScrollPosition;
      };

      window.addEventListener("scroll", handleScroll);

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => {});
        return () => {
          window.removeEventListener("scroll", handleScroll);
          window.visualViewport?.removeEventListener("resize", () => {});
        };
      } else {
        window.addEventListener("resize", () => {});
        return () => {
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("resize", () => {});
        };
      }
    }
  }, [inputRef, isMobileChatOpened, setIsMobileChatOpened]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && !isMobile) {
      setIsMobileChatOpened(false);
      setTimeout(() => {
        scrollContainer.scrollLeft = 40;
        setTimeout(() => {
          scrollContainer.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        }, 700);
      }, 500);
    }
  }, [scrollContainerRef, isMobile, setIsMobileChatOpened]);

  const mateyOutput = useMemo(
    () => messages.filter((msg) => msg.sender === "matey").slice(-1)[0],
    [messages]
  );

  const validPrompts = useMemo(
    () => [
      "Build a garden bed",
      "Hang a mirror",
      "Mount a TV on the wall",
      "Don't own a level? No worries.",
      "Need to hang something heavy?",
      "Not sure what tool you need?",
      "Just moved into a rental?",
      "Want to paint over old walls?",
      "Want to fix a squeaky door?",
      "Planning to drill into tiles?",
      "Worried about hitting a pipe?",
      "First time using a power tool?",
      "Worried about cracking the wall?",
      "Gave up halfway? Let's sort it.",
      "Don't know where to start?",
      "Never touched a drill?",
      "No idea where to start?",
      "Mounting a mirror on brick?",
      "Need help patching a hole in the wall",
      "Not sure what tool to grab?",
      "Wondering if that old drill still works…",
    ],
    []
  );

  useEffect(() => {
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (selectedPrompt) {
      setInputValue(selectedPrompt);
    }
  }, [selectedPrompt, setInputValue, isMobile]);

  useEffect(() => {
    if (validPrompts.includes(inputValue)) {
      handleSendMessage();
    }
  }, [inputValue, validPrompts, handleSendMessage]);

  const prompts = useMemo(
    () => [
      "Don't own a level? No worries.",
      "Need to hang something heavy?",
      "Not sure what tool you need?",
      "Just moved into a rental?",
      "Want to paint over old walls?",
      "Want to fix a squeaky door?",
      "Planning to drill into tiles?",
      "Worried about hitting a pipe?",
      "First time using a power tool?",
      "Worried about cracking the wall?",
      "Gave up halfway? Let's sort it.",
      "Don't know where to start?",
      "Never touched a drill?",
      "No idea where to start?",
      "Mounting a mirror on brick?",
    ],
    []
  );

  const randomPrompts = useMemo(() => {
    const shuffled = [...prompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [prompts]);

  const ProductCard = React.memo(
    ({ product, idx }: { product: any; idx: number }) => {
      let bgGradient = "";
      const iconColor = "text-gray-700";
      let decorativeIcon = Wrench;
      const productName = product.name.toLowerCase();

      if (
        productName.includes("drill") ||
        productName.includes("driver") ||
        productName.includes("rotary hammer") ||
        productName.includes("impact") ||
        productName.includes("contractor") ||
        productName.includes("industrial") ||
        productName.includes("oscillating") ||
        productName.includes("tool system") ||
        productName.includes("multi-tool")
      ) {
        bgGradient = "from-slate-100 to-slate-200";
        decorativeIcon = Zap;
      } else if (
        productName.includes("anchor") ||
        productName.includes("mounting") ||
        productName.includes("hardware") ||
        productName.includes("screw") ||
        productName.includes("fastener")
      ) {
        bgGradient = "from-blue-50 to-blue-100";
        decorativeIcon = Star;
      } else if (
        productName.includes("level") ||
        productName.includes("stud") ||
        productName.includes("measuring") ||
        productName.includes("tape")
      ) {
        bgGradient = "from-emerald-50 to-emerald-100";
        decorativeIcon = Sparkles;
      } else if (
        productName.includes("safety") ||
        productName.includes("glasses") ||
        productName.includes("gloves") ||
        productName.includes("kit") ||
        productName.includes("protection")
      ) {
        bgGradient = "from-red-50 to-red-100";
        decorativeIcon = Shield;
      } else if (productName.includes("hammer")) {
        bgGradient = "from-yellow-50 to-yellow-100";
        decorativeIcon = Hammer;
      } else if (
        productName.includes("screwdriver") ||
        productName.includes("tool") ||
        productName.includes("set") ||
        productName.includes("collection") ||
        productName.includes("kit")
      ) {
        bgGradient = "from-indigo-50 to-indigo-100";
        decorativeIcon = Wrench;
      } else {
        bgGradient = "from-slate-100 to-slate-200";
        decorativeIcon = Wrench;
      }

      const DecorativeIcon = decorativeIcon;

      // if mobile chat opened, make it full screen
      if (isMobileChatOpened) {
        return (
          <motion.div
            ref={chatContainerRef}
            key={idx}
            className={`relative flex flex-col justify-between rounded-2xl p-0 flex-shrink-0 bg-gradient-to-br ${bgGradient} shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 backdrop-blur-sm min-w-[140px]`}
          >
            {!isMobile && (
              <motion.div
                className="absolute top-3 right-3 opacity-20"
                animate={{ rotate: 360 }}
              >
                <DecorativeIcon size={16} className={iconColor} />
              </motion.div>
            )}
            <div className="relative z-10">
              <motion.div
                className="relative overflow-hidden rounded-xl w-32 h-32 flex items-center justify-center bg-white/30 backdrop-blur-sm border border-white/40"
                style={{ borderRadius: "15px 25px 20px 30px" }}
                whileHover={
                  isMobile
                    ? {}
                    : {
                        scale: 1.05,
                        borderRadius: "20px",
                        transition: { duration: 0.3 },
                      }
                }
              >
                <motion.div className="text-center p-3 flex flex-col items-center relative z-10">
                  <div className="w-24 h-24 mb-1 flex items-center justify-center">
                    <motion.img
                      src={
                        product.assets || "/placeholder.svg?height=64&width=64"
                      }
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-md"
                      whileHover={isMobile ? {} : { scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
              <motion.div className="mt-3">
                <p
                  className="font-bold text-gray-700 text-md w-32 text-center leading-tight"
                  title={product.name}
                >
                  {product.name}
                </p>
              </motion.div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative mt-4 px-4 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-yellow-100 shadow-md backdrop-blur-sm transition-all duration-300 overflow-hidden group"
              onClick={() => {
                setCurrentToolName(product.name);
                setCurrentExplanation(
                  "Picked this one 'cause it's reliable, easy to use, and works well for most basic jobs. Good match if you're not going too heavy."
                );
                setShowExplanationModal(true);
              }}
            >
              <span className="relative z-10 flex items-center gap-1 justify-center">
                <Sparkles
                  size={14}
                  className={isMobile ? "" : "group-hover:animate-pulse"}
                />
                Tell me why
              </span>
            </motion.button>
          </motion.div>
        );
      } else {
        // Return the normal view when not in mobile chat mode
        return (
          <motion.div
            ref={chatContainerRef}
            key={idx}
            className={`relative flex flex-col justify-between rounded-2xl p-8 flex-shrink-0 bg-gradient-to-br ${bgGradient} shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 backdrop-blur-sm min-w-[140px]`}
          >
            {!isMobile && (
              <motion.div
                className="absolute top-3 right-3 opacity-20"
                animate={{ rotate: 360 }}
              >
                <DecorativeIcon size={16} className={iconColor} />
              </motion.div>
            )}
            <div className="relative z-10">
              <motion.div
                className="relative overflow-hidden rounded-xl w-32 h-32 flex items-center justify-center bg-white/30 backdrop-blur-sm border border-white/40"
                style={{ borderRadius: "15px 25px 20px 30px" }}
                whileHover={
                  isMobile
                    ? {}
                    : {
                        scale: 1.05,
                        borderRadius: "20px",
                        transition: { duration: 0.3 },
                      }
                }
              >
                <motion.div className="text-center p-3 flex flex-col items-center relative z-10">
                  <div className="w-24 h-24 mb-1 flex items-center justify-center">
                    <motion.img
                      src={
                        product.assets || "/placeholder.svg?height=64&width=64"
                      }
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-md"
                      whileHover={isMobile ? {} : { scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
              <motion.div className="mt-3">
                <p
                  className="font-bold text-gray-700 text-md w-32 text-center leading-tight"
                  title={product.name}
                >
                  {product.name}
                </p>
              </motion.div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative mt-4 px-4 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-yellow-100 shadow-md backdrop-blur-sm transition-all duration-300 overflow-hidden group"
              onClick={() => {
                setCurrentToolName(product.name);
                setCurrentExplanation(
                  "Picked this one 'cause it's reliable, easy to use, and works well for most basic jobs. Good match if you're not going too heavy."
                );
                setShowExplanationModal(true);
              }}
            >
              <span className="relative z-10 flex items-center gap-1 justify-center">
                <Sparkles
                  size={14}
                  className={isMobile ? "" : "group-hover:animate-pulse"}
                />
                Tell me why
              </span>
            </motion.button>
          </motion.div>
        );
      }
    }
  );

  // resetMobileState function moved above to fix lint errors

  const clearChatHistoryWithReset = useCallback(() => {
    clearChatHistory();
    setIsMobileChatOpened(false);
  }, [clearChatHistory, setIsMobileChatOpened]);

  const exitMobileChat = useCallback(() => {
    setIsMobileChatOpened(false);
  }, [setIsMobileChatOpened]);

  return (
    <div className="relative w-full h-full hero-chat-container p-2 md:p-1">
      <motion.div
        initial={mobileAnimationVariants.initial}
        animate={mobileAnimationVariants.animate}
        transition={mobileAnimationVariants.transition}
        className={`w-full h-full bg-gradient-to-br ${
          isMobileFullHeight ? "rounded-2xl" : "rounded-2xl"
        } md:rounded-[1.8rem] from-yellow/10 to-softYellow/20 backdrop-blur-sm shadow-xl border-2 border-yellow/50 overflow-hidden`}
      >
        <div className="bg-gradient-to-r from-yellow to-softYellow p-2 md:p-4 flex items-center gap-4 sticky top-0 z-40 w-full matey-header">
          <div className="flex items-center gap-4">
            <motion.div className="sm:w-16 sm:h-16 w-12 h-12 rounded-full bg-white p-1 overflow-hidden relative shadow-lg">
              <img
                src="/assets/matey-emoji/smile.svg"
                alt="Matey"
                className="w-full h-full object-cover rounded-full"
              />
              <AnimatePresence>
                {showEmojiBubble && !isMobile && (
                  <motion.div
                    className="absolute -top-16 -right-8 bg-white rounded-full p-3 shadow-lg border-2 border-yellow"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    style={{ borderRadius: "60% 40% 50% 45%" }}
                  >
                    <div className="w-10 h-10">
                      {renderMateyExpression(currentEmoji)}
                    </div>
                    <motion.div
                      className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-yellow transform rotate-45"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex flex-col">
              <motion.h2
                className="font-bold text-black text-xl sm:text-2xl"
                initial={{ opacity: 1 }}
                whileHover={isMobile ? {} : { scale: 1.05 }}
                transition={{ duration: 0.1 }}
              >
                Matey
              </motion.h2>
              <p className="text-black/70 text-start text-sm sm:text-md font-medium tagline !block">
                Knows Tools Talks Straight
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <motion.button
              whileHover={isMobile ? {} : { scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/80 text-black hover:bg-yellow/80 rounded-full shadow-md"
              onClick={clearChatHistoryWithReset}
              style={{ borderRadius: "60% 40% 50% 45%" }}
              title="Clear chat history"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </motion.button>
            {/* X button to exit */}

            {isMobileChatOpened && (
              <motion.button
                whileHover={isMobile ? {} : { scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/80 text-black hover:bg-yellow/80 rounded-full shadow-md"
                onClick={exitMobileChat}
                style={{ borderRadius: "60% 40% 50% 45%" }}
                title="Clear chat history"
              >
                <XCircle size={20} />
              </motion.button>
            )}
          </div>
        </div>
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto relative px-2 pr-12 py-6 bg-white/40 ${
            isMobileFullHeight
              ? showBudgetSlider
                ? "h-[465px] md:h-[650px]"
                : showPrompt
                ? "h-[407px] md:h-[477px]"
                : "h-[473px] md:h-[658px]"
              : showBudgetSlider
              ? "h-[388px] md:h-[573px]"
              : showPrompt
              ? "h-[330px] md:h-[400px]"
              : "h-[396px] md:h-[581px]"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={messageAnimationVariants.initial}
                animate={messageAnimationVariants.animate}
                transition={messageAnimationVariants.transition}
                className="mb-4"
                onMouseEnter={() =>
                  !isMobile && setHoveredMessageId(message.id)
                }
                onMouseLeave={() => {
                  if (!isMobile) {
                    setHoveredMessageId(null);
                    setShowDropdown(null);
                  }
                }}
              >
                <div
                  className={`flex z-5 relative ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "matey" && (
                    <div
                      className={`sm:w-12 sm:h-12 w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ${
                        message.id === "1" ? "hidden" : "block"
                      }`}
                    >
                      {renderMateyExpression(message.expression)}
                    </div>
                  )}

                  <motion.div
                    whileHover={isMobile ? {} : { scale: 1.02 }}
                    onClick={() => {
                      if (window.innerWidth <= 768) {
                        handleTouchStart(message.id);
                      }
                    }}
                    onTouchStart={() => {
                      if (message.text.length <= 35) {
                        navigator.clipboard.writeText(message.text || "");
                      }
                    }}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    className={`relative max-w-[80%] p-3 md:p-5 ml-2 sm:ml-0 rounded-2xl border ${
                      message.sender === "user"
                        ? "bg-lightYellow text-black border-yellow shadow-md rounded-tr-none"
                        : message.id === "1" && message.sender === "matey"
                        ? "bg-white shadow-lg rounded-3xl border-gray-300 relative"
                        : "bg-white shadow-lg rounded-tl-none border-gray-300 bot-bubble"
                    }`}
                  >
                    {message.id === "1" && message.sender === "matey" && (
                      <div
                        className={`absolute -bottom-2 left-6 transform -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-gray-300 rotate-45 ${
                          messages.length === 1 ? "hidden" : "block"
                        }`}
                      ></div>
                    )}

                    {message.isImage && message.imageUrl ? (
                      <div className="mb-3">
                        <img
                          src={message.imageUrl || "/placeholder.svg"}
                          alt="User uploaded"
                          className="rounded-lg max-h-60 w-auto"
                          style={{ borderRadius: "15px 25px 5px 20px" }}
                        />
                      </div>
                    ) : null}

                    {message.text && (
                      <p className="text-start sm:text-lg text-md">
                        {message.text}
                      </p>
                    )}

                    <AnimatePresence>
                      {activeMessageId === message.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: isMobile ? 0.2 : 0.3,
                            ease: "easeInOut",
                          }}
                          className={`border-t border-gray-200 bg-gray-50`}
                        >
                          <div className="p-2 pr-0 flex flex-col gap-2">
                            {message.sender === "matey" && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    message.text || ""
                                  );
                                  setCopiedMessageId(message.id);
                                  setTimeout(() => {
                                    setCopiedMessageId(null);
                                    setActiveMessageId(null);
                                  }, 1500);
                                }}
                                className={`text-sm font-medium px-3 py-1.5 rounded-md border transition-all duration-200 shadow-sm ${
                                  copiedMessageId === message.id
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                }`}
                              >
                                {copiedMessageId === message.id
                                  ? "Too easy, it's copied!"
                                  : "Copy this!"}
                              </button>
                            )}
                            <button
                              onClick={() => setShowReportModal(true)}
                              className="text-sm font-medium px-3 py-1.5 rounded-md border transition-all duration-200 shadow-sm bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            >
                              Report
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Desktop 3-dot menu - hidden on mobile */}
                  <AnimatePresence>
                    {!isMobile &&
                      hoveredMessageId === message.id &&
                      message.sender === "matey" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`absolute ${
                            message.id === "1" && message.sender === "matey"
                              ? "right-[5.5rem]"
                              : "right-10"
                          } top-3 ml-2`}
                        >
                          <button
                            onClick={() =>
                              setShowDropdown(
                                showDropdown === message.id ? null : message.id
                              )
                            }
                            className="hover:scale-90 duration-200"
                          >
                            <MoreHorizontal size={16} className="text-black" />
                          </button>

                          <AnimatePresence>
                            {showDropdown === message.id &&
                              message.sender === "matey" && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                                >
                                  <p className="w-full px-4 py-2 text-left text-sm text-gray-700">
                                    Rate this message
                                  </p>
                                  <button
                                    onClick={() =>
                                      handleDropdownAction(
                                        "helpful",
                                        message.id,
                                        message.text,
                                        message.timestamp
                                      )
                                    }
                                    className={`w-full px-4 py-2 text-left text-sm ${
                                      feedbackAnimations[message.id] ===
                                      "helpful"
                                        ? "text-green-500"
                                        : "text-gray-700"
                                    }  hover:bg-green-50 hover:text-green-700 transition-colors flex items-center gap-2 relative`}
                                  >
                                    <motion.div
                                      animate={
                                        feedbackAnimations[message.id] ===
                                        "helpful"
                                          ? {
                                              scale: [1, 1.3, 1],
                                              rotate: [0, 10, -10, 0],
                                            }
                                          : {}
                                      }
                                      transition={{
                                        duration: 0.6,
                                        ease: "easeInOut",
                                      }}
                                    >
                                      <ThumbsUp size={14} />
                                    </motion.div>
                                    Helpful
                                    {feedbackAnimations[message.id] ===
                                      "helpful" && (
                                      <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute right-2 text-green-500"
                                      >
                                        ✓
                                      </motion.div>
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDropdownAction(
                                        "unhelpful",
                                        message.id,
                                        message.text,
                                        message.timestamp
                                      )
                                    }
                                    className={`w-full px-4 py-2 text-left text-sm ${
                                      feedbackAnimations[message.id] ===
                                      "unhelpful"
                                        ? "text-red-500"
                                        : "text-gray-700"
                                    } hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2 relative`}
                                  >
                                    <motion.div
                                      animate={
                                        feedbackAnimations[message.id] ===
                                        "unhelpful"
                                          ? {
                                              scale: [1, 1.3, 1],
                                              rotate: [0, -10, 10, 0],
                                            }
                                          : {}
                                      }
                                      transition={{
                                        duration: 0.6,
                                        ease: "easeInOut",
                                      }}
                                    >
                                      <ThumbsDown size={14} />
                                    </motion.div>
                                    Unhelpful
                                    {feedbackAnimations[message.id] ===
                                      "unhelpful" && (
                                      <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute right-2 text-red-500"
                                      >
                                        ✓
                                      </motion.div>
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDropdownAction("report")
                                    }
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
                                  >
                                    <Flag size={14} />
                                    Report
                                  </button>
                                </motion.div>
                              )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  <ReportModal
                    isOpen={showReportModal}
                    onClose={onClose}
                    messageId={message.id}
                    messageText={message.text}
                    messageTimestamp={message.timestamp}
                    closeExtraPart={() => {
                      setActiveMessageId(null);
                    }}
                  />
                </AnimatePresence>
                {message.isToolSuggestion && message.products && (
                  <motion.div
                    style={{ borderRadius: "0px 35px 0px 25px" }}
                    className="mt-3 w-[80%] ml-12 bg-gradient-to-r from-paleYellow to-white border-2 border-yellow rounded-xl p-3 sm:p-4 shadow-lg"
                  >
                    <div className="flex gap-3 mb-3 items-center">
                      <div className="bg-yellow p-2 rounded-full">
                        <Wrench className="text-white" size={20} />
                      </div>
                      <p className="font-bold sm:text-lg text-md">
                        Tools Recommendation
                      </p>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 px-2">
                      {message.products.map((product, idx) => (
                        <ProductCard key={idx} product={product} idx={idx} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                key="typing-indicator"
                className="mb-6 flex justify-start"
              >
                <div className="sm:w-12 sm:h-12 w-9 h-9 rounded-full mr-3 flex-shrink-0 overflow-hidden">
                  {renderMateyExpression("thinking")}
                </div>
                <div
                  className="bg-white p-5 shadow-lg"
                  style={{
                    borderRadius: "5px 25px 25px 25px",
                    clipPath:
                      "polygon(0% 15%, 5% 0%, 100% 0%, 100% 85%, 95% 100%, 0% 100%)",
                  }}
                >
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 0.6,
                        delay: 0,
                      }}
                      className="w-2 h-2 bg-yellow rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 0.6,
                        delay: 0.2,
                      }}
                      className="w-2 h-2 bg-yellow rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 0.6,
                        delay: 0.4,
                      }}
                      className="w-2 h-2 bg-yellow rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatContainerRef} />
        </div>
        {showPrompt ? (
          <div className="p-3 bg-white/70 border-t border-yellow/30 relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-3 md:flex-wrap overflow-x-auto"
            >
              {randomPrompts.map((prompt, index) => (
                <button
                  key={index}
                  style={{
                    borderRadius:
                      index % 2 === 0
                        ? "20px 10px 25px 15px"
                        : "15px 25px 10px 20px",
                  }}
                  className="px-4 py-2 bg-paleYellow text-black rounded-full text-md md:text-lg whitespace-nowrap flex-shrink-0 border-2 border-yellow hover:bg-lightYellow transition-colors"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="absolute top-0 block md:hidden right-0 h-full w-16 pointer-events-none bg-gradient-to-l from-lightYellow/70 to-transparent" />
          </div>
        ) : (
          ""
        )}
        <ChatSidebar currentInput={inputValue} mateyOutput={mateyOutput} />
        {showBudgetTab && (
          <BudgetTab
            onSelect={handleBudgetTabSelect}
            baseCost={estimatedBaseCost}
            onCancel={() => {
              handleBudgetCancel();
            }}
            location={location.pathname}
          />
        )}
        {showBudgetSlider && (
          <div className="px-4 pt-2">
            <BudgetSlider
              onBudgetChange={handleBudgetChange}
              isActive={showBudgetSlider && !budgetCompleted}
              onComplete={handleBudgetComplete}
              onCancel={handleBudgetCancel}
              showBudget={() => {}}
              baseCost={estimatedBaseCost}
            />
          </div>
        )}
        {!showUploadButton &&
          !subscriptionData &&
          uploadCount >= MAX_FREE_UPLOADS && (
            <div className="text-center text-sm text-gray-500 mt-1 mb-2">
              <span className="flex items-center justify-center gap-1">
                <ImageIcon size={14} /> You've used all {MAX_FREE_UPLOADS}{" "}
                uploads.
              </span>
            </div>
          )}

        <AnimatePresence>
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: isMobile ? 0.2 : 0.3 }}
              className="fixed bottom-20 transform -translate-x-1/2 w-full max-w-md px-4 z-50"
            >
              <motion.div
                className="relative bg-white p-4 rounded-lg border border-yellow/30 shadow-lg"
                layout
              >
                <motion.div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Your photo is ready to send!
                  </p>
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-auto max-h-40 object-contain rounded-lg border-2 border-yellow shadow-md"
                  />
                </motion.div>
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ borderRadius: "60% 40% 50% 45%" }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md"
                  onClick={clearImagePreview}
                >
                  <XCircle size={20} className="text-red-500" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="p-2 sm:p-4 bg-white border-t border-yellow/30">
          <div className="flex items-center gap-3">
            {(subscriptionData ||
              (showUploadButton && uploadCount < MAX_FREE_UPLOADS)) && (
              <motion.button
                whileHover={isMobile ? {} : { scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                style={{ borderRadius: "60% 40% 50% 45%" }}
                className="p-3 md:p-4 bg-paleYellow text-orange hover:bg-yellow hover:text-white rounded-full shadow-md relative group"
                onClick={handleFileUpload}
                title="Upload an image"
                disabled={isCompressingImage}
              >
                {isCompressingImage ? (
                  <div className="animate-spin h-4 w-4 border-2 border-orange border-t-transparent rounded-full" />
                ) : (
                  <ImageIcon size={18} />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </motion.button>
            )}

            {/* input component */}
            <div className="flex-1 relative">
              <div className="relative input-wrapper w-full">
                <input
                  ref={inputRef}
                  value={inputValue}
                  onFocus={focusAndAlignInput}
                  // onFocus={focusAndAlignInput}
                  onBlur={unFocusAndRestore}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    getSuggestionsForInput(e.target.value);
                  }}
                  style={{ borderRadius: "20px 30px 15px 25px" }}
                  onKeyDown={handleKeyDown}
                  placeholder="What are ya tackling today?"
                  className="
    w-full 
    p-3 
    sm:text-lg 
    text-md 
    rounded-xl 
    border-2 
    border-yellow/30 
    bg-transparent 
    shadow-inner 
    focus:outline-none 
    focus:ring-4 
    focus:ring-yellow 
    focus:ring-opacity-40 
    focus:shadow-inner 
    transition-all 
    duration-300 
    ease-in-out 
    relative 
    z-10
    min-h-[48px]
    max-h-[120px]
  "
                />

                <AnimatePresence>
                  {showSuggestions && inputValue.trim() !== "" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: isMobile ? 0.15 : 0.3 }}
                      style={{ borderRadius: "25px 15px 20px 30px" }}
                      className="absolute left-0 right-0 bottom-full mt-1 bg-white rounded-xl shadow-lg border-2 border-yellow/30 z-20 overflow-hidden"
                    >
                      {suggestedPrompts.map((prompt, index) => (
                        <motion.div
                          key={index}
                          initial={messageAnimationVariants.initial}
                          animate={messageAnimationVariants.animate}
                          transition={{
                            ...messageAnimationVariants.transition,
                            delay: isMobile ? 0 : index * 0.1,
                          }}
                          className="p-3 hover:bg-paleYellow text-start cursor-pointer border-b border-yellow/20 last:border-b-0"
                          onClick={() => handlePromptClick(prompt)}
                        >
                          {prompt}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <motion.button
              whileHover={isMobile ? {} : { scale: 1.1, rotate: -15 }}
              whileTap={{ scale: 0.9, rotate: isMobile ? 0 : 15 }}
              style={{ borderRadius: "40% 60% 50% 45%" }}
              className="p-3 md:p-4 bg-yellow text-white cursor-pointer rounded-full hover:bg-softYellow shadow-md"
              onClick={handleSendMessage}
              disabled={
                (inputValue.trim() === "" && !imagePreview) ||
                isCompletingText ||
                isCompressingImage
              }
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Explanation Modal */}
      <ExplanationModal
        showExplanationModal={showExplanationModal}
        setShowExplanationModal={setShowExplanationModal}
        currentToolName={currentToolName}
        currentExplanation={currentExplanation}
      />
    </div>
  );
}
