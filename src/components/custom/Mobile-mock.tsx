import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import HeroChat from "./HeroChat";
import { useAppContext } from "@/context/AppContext";
import MateyGfx from "../../../public/MatteyNobg.json";

export function MobileMock() {
  const {
    showExplanationModal,
    isMobileChatOpened,
    setIsMobileChatOpened,
    isMobileFullHeight,
    isChatFullScreen,
    setIsChatFullScreen,
  } = useAppContext();

  const [deviceHeight, setDeviceHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Device height and mobile detection
  useEffect(() => {
    const handleResize = () => {
      setDeviceHeight(window.innerHeight);
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Improved keyboard detection without auto full-screen
  useEffect(() => {
    if (!isMobile) return;

    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    const handleViewportChange = () => {
      const currentHeight = visualViewport.height;
      const screenHeight = window.screen.height;
      const calculatedKeyboardHeight = screenHeight - currentHeight;

      // Keyboard is considered open if more than 150px of height is lost
      const keyboardOpen = calculatedKeyboardHeight > 150;
      setIsKeyboardOpen(keyboardOpen);
      setKeyboardHeight(calculatedKeyboardHeight);

      // Don't automatically go full screen - let user interaction handle this
      if (keyboardOpen) {
        // Just ensure chat is positioned properly
        setTimeout(() => {
          if (chatContainerRef.current && !isChatFullScreen) {
            chatContainerRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    };

    visualViewport.addEventListener("resize", handleViewportChange);
    return () => {
      visualViewport.removeEventListener("resize", handleViewportChange);
    };
  }, [isMobile, isChatFullScreen]);

  // Auto-focus and chat opening - ensure proper frame view on load
  useEffect(() => {
    if (isMobile) {
      setIsMobileChatOpened(true);

      // Ensure both Matey and input are visible on load
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start", // Changed back to center for better positioning
          });
        }
      }, 500);
    }
  }, [isMobile, setIsMobileChatOpened]);

  // Calculate chat container height - more conservative approach
  const getChatHeight = () => {
    if (isChatFullScreen) {
      // When keyboard is open, adjust height to account for it
      if (isKeyboardOpen) {
        return `h-[${deviceHeight - keyboardHeight - 20}px]`;
      }
      return "h-[100vh]";
    }

    // Normal chat heights - increased to provide more room for budget tab
    if (deviceHeight < 660) {
      return "h-[520px]"; // Increased from 480px
    } else {
      return isMobileFullHeight ? "h-[580px]" : "h-[540px]"; // Increased heights
    }
  };

  // Reduced image margins to minimize white space
  const getImageMargins = () => {
    if (deviceHeight < 660) {
      return "-mb-[280px] -mt-4"; // Reduced margins
    } else {
      return "-mb-[160px] -mt-2"; // Reduced margins
    }
  };

  // Calculate container margins to reduce white space
  const getContainerMargins = () => {
    if (isChatFullScreen) return "mx-0";
    return "mx-2"; // Reduced from mx-auto to minimize side white space
  };

  return (
    <div
      ref={containerRef}
      className={`w-full ${isMobileChatOpened ? "mt-24" : "mt-0"} ${
        isChatFullScreen ? "mb-0" : "-mb-4"
      } h-full flex lg:flex-row flex-col p-0 lg:justify-start 
      text-center
      justify-center
      items-center
      relative`}
    >
      {/* Lottie Animation - Hidden when chat is full screen */}
      <AnimatePresence>
        {!isChatFullScreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 0.4 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.3 }}
          >
            <Lottie
              className={`absolute ${
                showExplanationModal ? "z-0" : "z-40"
              } -top-[58px] -left-[275px] w-[1px] h-[1px] ${
                isMobileFullHeight ? "hidden" : ""
              }`}
              animationData={MateyGfx}
              style={{
                width: "100%",
                height: "auto",
              }}
              loop={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex"></div>

      {/* Mobile Matey Image - Hidden when chat is full screen, reduced margins */}
      <AnimatePresence>
        {!isChatFullScreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden w-full h-full"
          >
            <img
              loading="lazy"
              src="/assets/matey/langingMatey.svg"
              alt="Matey Character"
              className={`w-80 h-80 mx-auto ${getImageMargins()}`} // Reduced size from w-96 h-96
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Container with Grey Border - improved positioning */}
      <motion.div
        ref={chatContainerRef}
        className={`lg:w-[480px] ${getChatHeight()} w-[96%] ${getContainerMargins()}
          lg:mb-10 lg:ml-20 z-10 md:rounded-[1.8rem] rounded-2xl
          ${
            isMobileChatOpened
              ? deviceHeight < 660
                ? "mt-32" // Reduced from mt-10
                : "-mt-0" // Reduced from -mt-20
              : "mt-0"
          }
          ${
            isChatFullScreen
              ? "fixed inset-0 w-full max-w-none rounded-none lg:ml-0 lg:mb-0 mt-0"
              : ""
          }
          bg-gradient-to-t from-slate-300 to-softYellow
          transition-all duration-300 ease-in-out
          ${isChatFullScreen ? "p-1" : "p-1"}
          ${
            isKeyboardOpen && isChatFullScreen ? `mb-[${keyboardHeight}px]` : ""
          }
        `}
        layout
        initial={false}
        animate={{
          scale: isChatFullScreen ? 1 : 1,
          borderRadius: isChatFullScreen ? 0 : 24,
          // Position chat above keyboard when it's open and in full screen
          y: isChatFullScreen && isKeyboardOpen ? -keyboardHeight / 2 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Inner container with proper background */}
        <div
          className={`w-full h-full ${
            isChatFullScreen
              ? "rounded-none"
              : "rounded-2xl md:rounded-[1.7rem]"
          } overflow-hidden bg-white`}
        >
          <HeroChat />
        </div>
      </motion.div>

      {/* Overlay to help with focus when keyboard is open */}
      <AnimatePresence>
        {isChatFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black pointer-events-none z-0"
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
