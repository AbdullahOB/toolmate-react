"use client";

import type React from "react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import type { IMateyExpression } from "@/types/types";
import {
  getProductsByKeywords,
  extractKeywords,
  detectHelpRequest,
  extractProductNames,
} from "@/components/MockProducts";
import { motion } from "framer-motion";
import { mockProducts } from "@/components/MockProducts";
import { useSubscription } from "./SubscriptionDetailsContext";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import useMessages from "@/hooks/useMessages";
export type Message = {
  id: string;
  text: string;
  sender: "user" | "matey";
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
  budget?: number;
  keywords?: string[];
};

const mateyResponses = {
  greeting: [
    "Alright legend, What are we tackling today?",
    "Got a project in mind or just winging it?",
    "Tell me what's up. tools, plans, or dramas?",
    "Need a hand or just curious? I'm all ears.",
    "What are we fixing, building, or figuring out?",
    "Hit me with it, mate. I've seen worse.",
    "You bring the idea. I'll bring the know-how.",
  ],
  thinking: [
    "Hmm, let me think about that for a sec...",
    "Scratching my head on this one... just a moment!",
    "Let me dig through my toolbox of knowledge...",
    "Thinking cap is on! Give me a jiffy...",
    "Just working out the nuts and bolts of this question...",
  ],
  general: [
    "Crikey! That's a great question. Let me sort that out for ya.",
    "Fair dinkum! I've got just the answer for that.",
    "Beauty! I know exactly what you need here.",
    "Strewth! You've come to the right place with that question.",
    "Too right! I can definitely help with that one.",
    "Spot on question! Here's what you need to know...",
    "Bonza! I've got some ripper advice for that.",
    "You've stumped me for a sec, but I reckon I've got the answer now!",
    "That's a cracker of a question! Here's my two cents...",
    "Well I'll be! That's something I know a fair bit about.",
  ],
  tools: [
    "For that job, you'll want to get your hands on these beauties...",
    "A true tradie would reach for these tools first...",
    "Based on my experience, these are the tools you'll need in your corner...",
    "I wouldn't start that project without these in my toolkit...",
    "Every DIYer worth their salt would use these for that job...",
  ],
  advice: [
    "Between you and me, here's a little trick of the trade...",
    "Most folks get this wrong, but what you really want to do is...",
    "My old man taught me this technique years ago, and it's never failed me...",
    "Here's something they don't tell you in the instruction manuals...",
    "I learned this the hard way so you don't have to...",
  ],
  encouragement: [
    "You've got this, mate! That project will be a piece of cake with your skills.",
    "With a steady hand like yours, this'll be done in no time!",
    "Trust me, you're asking all the right questions. You're gonna nail this project!",
    "I can tell you know your stuff! This project is right up your alley.",
    "That's the spirit! Tackle it head-on and you'll be wrapped up before you know it.",
  ],
  imageResponse: [
    "Crikey! That's a ripper of an image! Let me have a squiz at what we're dealing with here...",
    "Beauty! Thanks for the visual, mate. Let me analyze what tools you might need for this...",
    "G'day! That's a fair dinkum challenge you've got there. Let me think about the right tools...",
    "Strewth! That's an interesting project you've got. Let me sort out what you'll need...",
    "Well would you look at that! Give me a sec to figure out the best approach here...",
    "Now that's what I call a proper DIY challenge! Let me see what we're working with...",
    "That's a beauty of a project! Let me take a gander and suggest some tools...",
    "Oh, I see what you're up against now! Let me think about the best way to tackle this...",
    "Thanks for the pic, mate! Makes it much easier for me to help you out properly.",
    "Got your image loud and clear! Let me put my thinking cap on for this one...",
  ],
  sliderCancel: [
    "No worries, mate! We can sort out the budget later. Just give me a shout when you're ready.",
    "Fair enough! Budget's not set in stone. We can come back to it whenever you like.",
    "Too easy! The slider will be here when you need it. Let's crack on with something else.",
    "No drama! We can figure out the budget when you're ready to pull the trigger.",
    "She'll be right! We can talk budget another time. What else can I help with?",
    "Roger that! The budget slider's not going anywhere. It'll be here when you need it.",
    "All good, cobber! We can sort the budget out later. What else is on your mind?",
    "No dramas! The slider will be waiting for ya when you're ready to give it a burl.",
    "Righto! We'll put a pin in that for now. The slider's here whenever you need it.",
    "Sweet as! We can come back to the budget chat later. What else can I help with?",
  ],
};

const STORAGE_KEY = "matey-chat-messages";
const UPLOAD_COUNT_KEY = "matey-upload-count";
const UPLOAD_DATE_KEY = "matey-upload-date";
const MAX_FREE_UPLOADS = 2;
const MAX_IMAGE_WIDTH = 800;
const MAX_IMAGE_HEIGHT = 600;
const IMAGE_QUALITY = 0.7;
const compressImage = (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > MAX_IMAGE_WIDTH) {
        height = (height * MAX_IMAGE_WIDTH) / width;
        width = MAX_IMAGE_WIDTH;
      }
      if (height > MAX_IMAGE_HEIGHT) {
        width = (width * MAX_IMAGE_HEIGHT) / height;
        height = MAX_IMAGE_HEIGHT;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
      resolve(compressedDataUrl);
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = dataUrl;
  });
};
export interface AppContextType {
  selectedPrompt: string | null;
  setSelectedPrompt: React.Dispatch<React.SetStateAction<string | null>>;
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
  showExplanationModal: boolean;
  setShowExplanationModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBudget: number;
  setSelectedBudget: React.Dispatch<React.SetStateAction<number>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Chat state
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  currentSuggestion: string;
  setCurrentSuggestion: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  isInitialized: boolean;
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  showEmojiBubble: boolean;
  setShowEmojiBubble: React.Dispatch<React.SetStateAction<boolean>>;
  currentEmoji: IMateyExpression;
  setCurrentEmoji: React.Dispatch<React.SetStateAction<IMateyExpression>>;
  isCompletingText: boolean;
  setIsCompletingText: React.Dispatch<React.SetStateAction<boolean>>;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  isCompressingImage: boolean;
  setIsCompressingImage: React.Dispatch<React.SetStateAction<boolean>>;
  suggestedPrompts: string[];
  setSuggestedPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  showSuggestions: boolean;
  feedbackLoading: boolean;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  uploadCount: number;
  setUploadCount: React.Dispatch<React.SetStateAction<number>>;
  uploadDate: string;
  setUploadDate: React.Dispatch<React.SetStateAction<string>>;
  showUploadButton: boolean;
  setShowUploadButton: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileFullHeight: boolean;
  setIsMobileFullHeight: React.Dispatch<React.SetStateAction<boolean>>;
  mateyAskedForPhoto: boolean;
  setMateyAskedForPhoto: React.Dispatch<React.SetStateAction<boolean>>;
  userAskedAboutUpload: boolean;
  setUserAskedAboutUpload: React.Dispatch<React.SetStateAction<boolean>>;
  showPrompt: boolean;
  setShowPrompt: React.Dispatch<React.SetStateAction<boolean>>;
  showBudgetSlider: boolean;
  setShowBudgetSlider: React.Dispatch<React.SetStateAction<boolean>>;
  currentBudget: number;
  setCurrentBudget: React.Dispatch<React.SetStateAction<number>>;
  budgetCompleted: boolean;
  setBudgetCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  extractedKeywords: string[];
  setExtractedKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  extractedProductNames: string[];
  setExtractedProductNames: React.Dispatch<React.SetStateAction<string[]>>;
  revealPattern: "inline" | "micro-quiz" | "side-drawer" | "creative";
  setRevealPattern: React.Dispatch<
    React.SetStateAction<"inline" | "micro-quiz" | "side-drawer" | "creative">
  >;
  showMicroQuiz: boolean;
  setShowMicroQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  showBudgetTab: boolean;
  setShowBudgetTab: React.Dispatch<React.SetStateAction<boolean>>;
  showCreativeReveal: boolean;
  setShowCreativeReveal: React.Dispatch<React.SetStateAction<boolean>>;
  quizCompleted: boolean;
  setQuizCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  userOwnedTools: string[];
  setUserOwnedTools: React.Dispatch<React.SetStateAction<string[]>>;
  estimatedBaseCost: number;
  setEstimatedBaseCost: React.Dispatch<React.SetStateAction<number>>;
  hasOpenedBudget: boolean;
  setHasOpenedBudget: React.Dispatch<React.SetStateAction<boolean>>;
  activeMessageId: string | null;
  setActiveMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  copiedMessageId: string | null;
  setCopiedMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  isInitialLoading: boolean;
  setIsInitialLoading: React.Dispatch<React.SetStateAction<boolean>>;

  // Refs
  mobileMockChatRef: React.RefObject<HTMLDivElement>;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  userMessageSentDuringLoading: React.MutableRefObject<boolean>;
  currentExplanation: string;
  setCurrentExplanation: React.Dispatch<React.SetStateAction<string>>;
  currentToolName: string;
  setCurrentToolName: React.Dispatch<React.SetStateAction<string>>;
  hoveredMessageId: string | null;
  setHoveredMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  showReportModal: boolean;
  setShowReportModal: React.Dispatch<React.SetStateAction<boolean>>;
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  feedbackAnimations: { [key: string]: "helpful" | "unhelpful" | null };
  onClose: () => void;
  handleDropdownAction: (action: string, messageId?: string) => void;
  // Functions
  handleSendMessage: () => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  completeText: () => void;
  getSuggestionsForInput: (input: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  clearImagePreview: () => void;
  handlePromptClick: (prompt: string) => void;
  clearChatHistory: () => void;
  getContextualResponse: (input: string) => {
    text: string;
    expression: IMateyExpression;
  };
  renderMateyExpression: (expression?: IMateyExpression) => JSX.Element;
  handleFileUpload: () => void;
  handleBudgetChange: (budget: number, tier: string) => void;
  handleQuizComplete: (answers: Record<string, string>) => void;
  handleBudgetTabSelect: (tier: string) => void;
  handleCreativeSelect: (tier: string) => void;
  handleBudgetComplete: () => void;
  handleBudgetCancel: () => void;
  showRandomEmojiBubble: () => void;
  checkIfUserAsksAboutUpload: (text: string) => boolean;
  handleTouchStart: (messageId: string) => void;
  handleTouchEnd: () => void;
  // isMobileChatOpened
  isMobileChatOpened: boolean;
  setIsMobileChatOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const [selectedBudget, setSelectedBudget] = useState<number>(0);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileFullHeight, setIsMobileFullHeight] = useState(false);
  const [isMobileChatOpened, setIsMobileChatOpened] = useState(false);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [feedbackAnimations, setFeedbackAnimations] = useState<{
    [key: string]: "helpful" | "unhelpful" | null;
  }>({});
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [currentToolName, setCurrentToolName] = useState("");
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentSuggestion, setCurrentSuggestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showEmojiBubble, setShowEmojiBubble] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState<IMateyExpression>("smile");
  const [isCompletingText, setIsCompletingText] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadDate, setUploadDate] = useState<string>("");
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [mateyAskedForPhoto, setMateyAskedForPhoto] = useState(false);
  const [userAskedAboutUpload, setUserAskedAboutUpload] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [showBudgetSlider, setShowBudgetSlider] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(50);
  const [budgetCompleted, setBudgetCompleted] = useState(false);
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [extractedProductNames, setExtractedProductNames] = useState<string[]>(
    []
  );
  const [revealPattern, setRevealPattern] = useState<
    "inline" | "micro-quiz" | "side-drawer" | "creative"
  >("inline");
  const [showMicroQuiz, setShowMicroQuiz] = useState(false);
  const [showBudgetTab, setShowBudgetTab] = useState(false);
  const [showCreativeReveal, setShowCreativeReveal] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userOwnedTools, setUserOwnedTools] = useState<string[]>([]);
  const [estimatedBaseCost, setEstimatedBaseCost] = useState(100);
  const [hasOpenedBudget, setHasOpenedBudget] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  // Refs
  const mobileMockChatRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userMessageSentDuringLoading = useRef(false);
  let longPressTimeout: NodeJS.Timeout;
  const { subscriptionData } = useSubscription();
  const { user } = useUser();
  const [feedbackLoading, setFeedback] = useState(false);
  const [backendMessages, refetch, isFetching] = useMessages();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const parseStoredMessages = (storedMessages: string | null): Message[] => {
    if (!storedMessages) return [];
    try {
      const parsedMessages = isFetching
        ? JSON.parse(storedMessages)
        : backendMessages;
      return parsedMessages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
        imageUrl: message.imageUrl || undefined,
        isImage: !!message.imageUrl,
      }));
    } catch (error) {
      console.error("Error parsing stored messages:", error);
      return [];
    }
  };
  const saveMessagesToLocalStorage = (messages: Message[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  };
  // Initialize upload count and date
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCount = localStorage.getItem(UPLOAD_COUNT_KEY);
      const storedDate = localStorage.getItem(UPLOAD_DATE_KEY);
      const today = new Date().toDateString();
      if (storedDate && storedDate !== today) {
        setUploadCount(0);
        setUploadDate(today);
        localStorage.setItem(UPLOAD_COUNT_KEY, "0");
        localStorage.setItem(UPLOAD_DATE_KEY, today);
      } else {
        setUploadCount(storedCount ? Number.parseInt(storedCount, 10) : 0);
        setUploadDate(storedDate || today);
      }
    }
  }, []);

  // Update upload count in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(UPLOAD_COUNT_KEY, uploadCount.toString());
      localStorage.setItem(UPLOAD_DATE_KEY, uploadDate);
      if (uploadCount >= MAX_FREE_UPLOADS) {
        setShowUploadButton(false);
      }
    }
  }, [uploadCount, uploadDate]);

  // Handle selected prompt
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (selectedPrompt) {
      setInputValue(selectedPrompt);
    }
  }, [selectedPrompt]);

  // Initialize chat
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedMessages = localStorage.getItem(STORAGE_KEY);
        const parsedMessages = parseStoredMessages(storedMessages);

        if (parsedMessages.length > 0) {
          setMessages(parsedMessages);
          setIsInitialized(true);
        } else {
          userMessageSentDuringLoading.current = false;
          setIsTyping(true);
          setIsInitialLoading(true);
          setTimeout(() => {
            setIsTyping(false);
            if (!userMessageSentDuringLoading.current) {
              setTimeout(() => {
                const randomGreeting =
                  mateyResponses.greeting[
                    Math.floor(Math.random() * mateyResponses.greeting.length)
                  ];
                const greetingMessage: Message = {
                  id: Date.now().toString(),
                  text: randomGreeting,
                  sender: "matey",
                  timestamp: new Date(),
                  expression: "hello",
                };
                setMessages([greetingMessage]);
                setIsInitialized(true);
                showRandomEmojiBubble();
              }, 300);
            }
            setIsInitialLoading(false);
          }, 3000);
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        setIsInitialized(false);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      saveMessagesToLocalStorage(messages);
      const toolSuggestions = messages.filter(
        (msg) => msg.isToolSuggestion && msg.products
      );
      if (toolSuggestions.length > 0) {
        try {
          localStorage.setItem(
            "tool-suggestion",
            JSON.stringify(toolSuggestions)
          );
          if (user) {
            axios.post(
              `${import.meta.env.VITE_SERVER_URL}/store-suggested-tools`,
              {
                userName: user.fullName,
                userEmail:
                  user.emailAddresses?.map((email) => email.emailAddress) || [],
                suggestedTools: toolSuggestions,
              }
            );
          }
        } catch (error) {
          console.error(
            "Error saving tool suggestions to localStorage:",
            error
          );
        }
      }
    }
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, isTyping]);

  // Update suggestions when input changes
  useEffect(() => {
    getSuggestionsForInput(inputValue);
  }, [inputValue]);

  // Hide prompt when messages exist
  useEffect(() => {
    if (messages.length > 1) {
      setShowPrompt(false);
    }
  }, [messages]);

  // Functions
  const showRandomEmojiBubble = () => {
    const expressions: IMateyExpression[] = [
      "laugh",
      "hello",
      "smile",
      "offer",
      "1thumb",
      "2thumb",
    ];
    const randomExpression =
      expressions[Math.floor(Math.random() * expressions.length)];
    setCurrentEmoji(randomExpression);
    setShowEmojiBubble(true);
    setTimeout(() => {
      setShowEmojiBubble(false);
    }, 3000);
  };

  const checkIfUserAsksAboutUpload = (text: string) => {
    const lowerText = text.toLowerCase();
    return (
      lowerText.includes("upload photo") ||
      lowerText.includes("upload image") ||
      lowerText.includes("upload picture") ||
      lowerText.includes("send photo") ||
      lowerText.includes("send image") ||
      lowerText.includes("send picture") ||
      lowerText.includes("share photo") ||
      lowerText.includes("share image") ||
      lowerText.includes("can i upload") ||
      lowerText.includes("can i send") ||
      lowerText.includes("can i share") ||
      lowerText.includes("how to upload")
    );
  };
  const getContextualResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    if (
      lowerInput.includes("?") ||
      lowerInput.startsWith("how") ||
      lowerInput.startsWith("what") ||
      lowerInput.startsWith("which") ||
      lowerInput.startsWith("can") ||
      lowerInput.startsWith("where")
    ) {
      return {
        text:
          "Great question! " +
          mateyResponses.general[
            Math.floor(Math.random() * mateyResponses.general.length)
          ],
        expression: "thinking" as IMateyExpression,
      };
    }
    if (
      lowerInput.includes("tool") ||
      lowerInput.includes("drill") ||
      lowerInput.includes("hammer") ||
      lowerInput.includes("saw") ||
      lowerInput.includes("screwdriver")
    ) {
      return {
        text: mateyResponses.tools[
          Math.floor(Math.random() * mateyResponses.tools.length)
        ],
        expression: "tool" as IMateyExpression,
      };
    }

    if (
      lowerInput.includes("project") ||
      lowerInput.includes("build") ||
      lowerInput.includes("make") ||
      lowerInput.includes("create") ||
      lowerInput.includes("construct")
    ) {
      return {
        text:
          mateyResponses.encouragement[
            Math.floor(Math.random() * mateyResponses.encouragement.length)
          ] +
          " " +
          mateyResponses.advice[
            Math.floor(Math.random() * mateyResponses.advice.length)
          ],
        expression: "offer" as IMateyExpression,
      };
    }
    return {
      text: mateyResponses.general[
        Math.floor(Math.random() * mateyResponses.general.length)
      ],
      expression: "smile" as IMateyExpression,
    };
  };

  const renderMateyExpression = (expression?: IMateyExpression) => {
    switch (expression) {
      case "laugh":
        return (
          <motion.img
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
            src="/assets/matey-emoji/largeSmile.svg"
            alt="excited"
            width={40}
            height={40}
          />
        );
      case "hello":
        return (
          <motion.img
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
            src="/assets/matey-emoji/hello.svg"
            alt="hello"
            width={40}
            height={40}
          />
        );
      case "smile":
        return (
          <motion.img
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
            src="/assets/matey-emoji/smile.svg"
            alt="happy"
            width={40}
            height={40}
          />
        );
      case "offer":
        return (
          <motion.img
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
            src="/assets/matey-emoji/take.svg"
            alt="offer"
            width={40}
            height={40}
          />
        );
      case "1thumb":
        return (
          <motion.img
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
            src="/assets/matey-emoji/thumb1.svg"
            alt="thumb1"
            width={40}
            height={40}
          />
        );
      case "2thumb":
        return (
          <motion.img
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
            src="/assets/matey-emoji/thumbs2.svg"
            alt="thumb2"
            width={40}
            height={40}
          />
        );
      case "tool":
        return (
          <motion.img
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
            src="/assets/matey-emoji/tool.svg"
            alt="tool"
            width={40}
            height={40}
          />
        );
      case "thinking":
        return (
          <motion.img
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
            src="/assets/matey-emoji/thinking.svg"
            alt="thinking"
            width={40}
            height={40}
          />
        );
      default:
        return (
          <motion.img
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
            src="/assets/matey-emoji/smile.svg"
            alt="default"
            width={40}
            height={40}
          />
        );
    }
  };
  const mateyOutput = messages
    .filter((msg) => msg.sender === "matey")
    .slice(-1)[0];

  const postMessagesToServer = async (allMessages: Message[]) => {
    if (!user) return;

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/store-messages`, {
        userName: user.fullName,
        userEmail:
          user.emailAddresses?.map((email) => email.emailAddress) || [],
        messages: allMessages,
      });
      refetch();
    } catch (err) {
      console.error("Failed to send messages to server:", err);
    }
  };

  const handleSendMessage = async () => {
    if ((inputValue.trim() === "" && !imagePreview) || isCompressingImage)
      return;

    if (isInitialLoading) {
      userMessageSentDuringLoading.current = true;
      setIsTyping(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      isImage: !!imagePreview,
      imageUrl: imagePreview || undefined,
    };

    if (checkIfUserAsksAboutUpload(inputValue)) {
      setTimeout(() => {
        setUserAskedAboutUpload(true);
        setShowUploadButton(true);
      }, 2700);
    }

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessagesToLocalStorage(updatedMessages);
    setInputValue("");
    setCurrentSuggestion("");
    setImagePreview(null);
    setIsTyping(true);

    const keywords = extractKeywords(userMessage.text);
    const productNames = extractProductNames(userMessage.text);
    const isHelpRequest = detectHelpRequest(userMessage.text);

    setExtractedKeywords(keywords);
    setExtractedProductNames(productNames);

    let messageFlow = [...updatedMessages];

    setTimeout(() => {
      let randomResponse;
      const isImageMessage = !!userMessage.isImage;

      if (isImageMessage) {
        const randomIndex = Math.floor(
          Math.random() * mateyResponses.imageResponse.length
        );
        randomResponse = {
          text: mateyResponses.imageResponse[randomIndex],
          expression: ["smile", "tool", "thinking", "offer"][
            Math.floor(Math.random() * 4)
          ] as IMateyExpression,
        };
      } else if (
        userAskedAboutUpload ||
        checkIfUserAsksAboutUpload(userMessage.text)
      ) {
        if (uploadCount >= MAX_FREE_UPLOADS) {
          randomResponse = {
            text: `That's the last one I can swing ya today, mate. If you need more, reckon the Best Mate plan might be worth a squiz.`,
            expression: "thinking",
          };
        } else {
          randomResponse = {
            text: subscriptionData
              ? "Go ahead and upload your photo - I can give you more targeted advice with a visual."
              : "Normally that's part of the paid plan, but I'll let you sneak two through Caroma. Go ahead and upload it, just keep it between us!",
            expression: "offer",
          };
          setMateyAskedForPhoto(true);
          setShowUploadButton(true);
        }
      } else {
        randomResponse = getContextualResponse(userMessage.text);
        if (Math.random() < 0.1 && !mateyAskedForPhoto) {
          if (subscriptionData) {
            randomResponse.text +=
              " If you could upload a photo of what you're working on, I can give you more specific advice.";
          } else {
            randomResponse.text +=
              " Hey, it'd be a real help if you could upload a photo of what you're working on. That way I can give you more specific advice!";
          }
          setMateyAskedForPhoto(true);
          setShowUploadButton(true);
        }
      }

      const mateyResponse: Message = {
        id: Date.now().toString(),
        text: randomResponse.text,
        sender: "matey",
        timestamp: new Date(),
        expression: randomResponse.expression,
      };

      const updatedWithMateyResponse = [...messageFlow, mateyResponse];
      setMessages(updatedWithMateyResponse);
      saveMessagesToLocalStorage(updatedWithMateyResponse);
      messageFlow = updatedWithMateyResponse;

      showRandomEmojiBubble();
      setIsTyping(false);

      if (isHelpRequest || productNames.length > 0 || keywords.length > 0) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setTimeout(() => {
              let questionText = "";

              if (showBudgetTab) {
                if (productNames.length > 0) {
                  questionText = `I see you're looking for ${productNames.join(
                    ", "
                  )}. Let me know your budget and I'll suggest some options.`;
                } else if (
                  userMessage.text.toLowerCase().includes("budget") &&
                  !isOpen
                ) {
                  questionText =
                    "Still keen to sort the budget, mate? It'll help me give better recos.";
                } else if (keywords.length > 0) {
                  questionText = `I see you're working with ${keywords.join(
                    ", "
                  )}. What's your budget for tools?`;
                } else {
                  questionText = `I'd be happy to help! What's your budget for the tools you need?`;
                }
              } else {
                const fallbackMessages = [
                  "Pick what fits — I'll keep things realistic, not ridiculous.",
                  "Here's three ways to tackle it, from bare-bones to bells and whistles.",
                ];
                questionText =
                  fallbackMessages[
                    Math.floor(Math.random() * fallbackMessages.length)
                  ];
              }

              const budgetQuestion: Message = {
                id: Date.now().toString(),
                text: questionText,
                sender: "matey",
                timestamp: new Date(),
                expression: "offer",
                keywords: keywords,
              };

              const updatedWithBudgetQuestion = [
                ...messageFlow,
                budgetQuestion,
              ];
              setMessages(updatedWithBudgetQuestion);
              saveMessagesToLocalStorage(updatedWithBudgetQuestion);
              messageFlow = updatedWithBudgetQuestion;

              setRevealPattern("side-drawer");
              setShowBudgetTab(true);
              setBudgetCompleted(false);
              // ✅ Post messages after final Matey message
              postMessagesToServer(messageFlow);
            }, 300);
          }, 1500);
        }, 1000);
      } else {
        // ✅ Post if no budget question
        postMessagesToServer(messageFlow);
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (currentSuggestion && !isCompletingText) {
        e.preventDefault();
        completeText();
        return;
      }
      handleSendMessage();
      return;
    }
    if (e.key === "Tab" && currentSuggestion) {
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
        setCurrentSuggestion("");
      }
    };
    animateNextChar();
  };

  const getSuggestionsForInput = (input: string) => {
    if (!input || input.length < 2) {
      setShowSuggestions(false);
      return;
    }
    const allSuggestions = [
      "How do I install a ceiling fan?",
      "How to fix a leaky faucet?",
      "Tools needed for basic plumbing",
      "How to hang a heavy mirror?",
      "How to patch a hole in the wall?",
      "Best way to paint a room?",
      "How do I unclog a drain without callin' a plumber?",
      "Can I assemble flat-pack furniture solo?",
      "What's the easiest way to paint a fence?",
      "How do I replace a broken tile?",
      "Tips for using a power drill for the first time",
      "How to clean gutters safely?",
      "What tools do I need for tiling?",
      "Tips for installing laminate flooring",
      "How to build a simple bookshelf?",
      "What's the best way to paint kitchen cabinets?",
      "How to install floating shelves properly?",
      "Build a raised garden bed on a budget",
      "How to install curtain rods without wrecking the wall?",
      "Best way to fix squeaky doors?",
    ];
    const filtered = allSuggestions
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 3);
    setSuggestedPrompts(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const today = new Date().toDateString();
    if (uploadDate !== today) {
      setUploadCount(0);
      setUploadDate(today);
      localStorage.setItem(UPLOAD_COUNT_KEY, "0");
      localStorage.setItem(UPLOAD_DATE_KEY, today);
    }

    const newCount = uploadCount + 1;
    setUploadCount(newCount);
    if (newCount >= MAX_FREE_UPLOADS) {
      setShowUploadButton(false);
    }

    setIsCompressingImage(true);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      const compressedDataUrl = await compressImage(dataUrl);
      setImagePreview(compressedDataUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      alert(
        "Failed to process image. Please try a different image or a smaller file."
      );
    } finally {
      setIsCompressingImage(false);
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    setCurrentSuggestion("");
    inputRef.current?.focus();
  };

  const clearChatHistory = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("tool-suggestion");
        setShowPrompt(true);
        setMessages([]);
        setShowBudgetTab(false);
        setIsInitialized(false);
        setMateyAskedForPhoto(false);
        setUserAskedAboutUpload(false);
        setShowUploadButton(false);
        setShowBudgetSlider(false);
        setBudgetCompleted(false);
        setExtractedKeywords([]);
        setExtractedProductNames([]);
        userMessageSentDuringLoading.current = false;
        setIsTyping(true);
        setIsInitialLoading(true);

        setTimeout(() => {
          setIsTyping(false);
          if (!userMessageSentDuringLoading.current) {
            setTimeout(() => {
              const randomGreeting =
                mateyResponses.greeting[
                  Math.floor(Math.random() * mateyResponses.greeting.length)
                ];
              setMessages([
                {
                  id: "1",
                  text: randomGreeting,
                  sender: "matey",
                  timestamp: new Date(),
                  expression: "hello",
                },
              ]);
              setIsInitialized(true);
              showRandomEmojiBubble();
            }, 300);
          }
          setIsInitialLoading(false);
        }, 3000);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const onClose = useCallback(() => {
    setShowReportModal(false);
  }, []);
  const handleFeedback = useCallback(
    async (
      messageId: string,
      feedbackType: "helpful" | "unhelpful",
      messageText?: string,
      messageTimestamp?: string
    ) => {
      setFeedback(true);
      try {
        const payload = {
          messageId,
          messageText,
          messageTimestamp,
          feedback: feedbackType,
          isLoggedInUser: !!user,
          ...(user && {
            name: user.fullName,
            email: user.emailAddresses.map((email) => email.emailAddress),
          }),
          reportStatus: false,
        };

        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/add-feedback`,
          payload
        );
      } catch (err) {
        console.error("Feedback submission error:", err);
      } finally {
        setFeedback(false);
      }
      setFeedbackAnimations((prev) => ({
        ...prev,
        [messageId]: feedbackType,
      }));

      setTimeout(() => {
        setFeedbackAnimations((prev) => ({
          ...prev,
          [messageId]: null,
        }));
        setShowDropdown(null);
      }, 1500);
    },
    [user]
  );

  const handleDropdownAction = useCallback(
    (
      action: string,
      messageId?: string,
      messageText?: string,
      messageTimestamp?: string
    ) => {
      if (action === "report") {
        setShowReportModal(true);
      } else if (action === "helpful" || action === "unhelpful") {
        if (messageId) {
          handleFeedback(
            messageId,
            action as "helpful" | "unhelpful",
            messageText,
            messageTimestamp
          );
        }
      } else {
        console.log(`Action: ${action}`);
      }

      if (action !== "helpful" && action !== "unhelpful") {
        setShowDropdown(null);
      }
    },
    [handleFeedback]
  );
  const handleBudgetChange = (budget: number) => {
    setCurrentBudget(budget);
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleQuizComplete = (answers: Record<string, string>) => {
    setShowMicroQuiz(false);
    setQuizCompleted(true);
    if (answers.tools === "None/very few") {
      setUserOwnedTools([]);
    } else if (answers.tools === "Basic toolkit") {
      setUserOwnedTools(["hammer", "screwdriver set", "measuring tape"]);
    } else if (answers.tools === "Quite a few") {
      setUserOwnedTools([
        "hammer",
        "screwdriver set",
        "measuring tape",
        "drill",
        "level",
        "pliers",
      ]);
    } else if (answers.tools === "Professional set") {
      setUserOwnedTools([
        "hammer",
        "screwdriver set",
        "measuring tape",
        "drill",
        "level",
        "pliers",
        "power tools",
        "specialty tools",
      ]);
    }
    setShowBudgetSlider(true);
  };

  const handleBudgetTabSelect = (tier: string) => {
    if (tier === "matesChoice") {
      setCurrentBudget(20);
    } else if (tier === "buildersPick") {
      setCurrentBudget(50);
    } else if (tier === "tradiesDream") {
      setCurrentBudget(80);
    }
    setShowBudgetSlider(true);
  };

  const handleCreativeSelect = (tier: string) => {
    setShowCreativeReveal(false);
    if (tier === "matesChoice") {
      setCurrentBudget(20);
    } else if (tier === "buildersPick") {
      setCurrentBudget(50);
    } else if (tier === "tradiesDream") {
      setCurrentBudget(80);
    }
    setShowBudgetSlider(true);
  };

  const handleBudgetComplete = () => {
    setBudgetCompleted(true);
    let budgetTier = "low";
    if (currentBudget <= 35) {
      budgetTier = "low";
    } else if (currentBudget <= 65) {
      budgetTier = "medium";
    } else {
      budgetTier = "high";
    }

    interface RawProduct {
      name: string;
      price: number;
      imageUrl: string;
      budgetTier: "low" | "medium" | "high" | "premium" | "luxury";
    }
    let relevantProducts: RawProduct[] = [];
    if (extractedProductNames.length > 0) {
      relevantProducts = getProductsByKeywords(extractedProductNames).filter(
        (p) => {
          if (budgetTier === "low") return p.budgetTier === "low";
          if (budgetTier === "medium")
            return ["low", "medium"].includes(p.budgetTier);
          return ["low", "medium", "high", "premium", "luxury"].includes(
            p.budgetTier
          );
        }
      );
    }
    if (relevantProducts.length === 0 && extractedKeywords.length > 0) {
      relevantProducts = getProductsByKeywords(extractedKeywords).filter(
        (p) => {
          if (budgetTier === "low") return p.budgetTier === "low";
          if (budgetTier === "medium")
            return ["low", "medium"].includes(p.budgetTier);
          return ["low", "medium", "high", "premium", "luxury"].includes(
            p.budgetTier
          );
        }
      );
    }
    if (relevantProducts.length === 0) {
      if (budgetTier === "low") {
        relevantProducts = mockProducts.filter((p) => p.budgetTier === "low");
      } else if (budgetTier === "medium") {
        relevantProducts = mockProducts.filter((p) =>
          ["low", "medium"].includes(p.budgetTier)
        );
      } else {
        relevantProducts = mockProducts.filter((p) =>
          ["medium", "high", "premium"].includes(p.budgetTier)
        );
      }
    }
    const formattedProducts = relevantProducts.slice(0, 5).map((p) => ({
      name: p.name,
      price: p.price,
      assets: p.imageUrl,
    }));
    const tierLabel =
      budgetTier === "low"
        ? "Good"
        : budgetTier === "medium"
        ? "Better"
        : "Best";
    const toolSuggestion: Message = {
      id: Date.now().toString(),
      text: `Based on your ${tierLabel} range preference, here are some tools that might help:`,
      sender: "matey",
      timestamp: new Date(),
      expression: "offer",
      isToolSuggestion: true,
      budget: currentBudget,
      keywords: extractedKeywords,
      products:
        formattedProducts.length > 0
          ? formattedProducts
          : [
              {
                name: "Cordless Drill",
                price: 50,
                assets: "/assets/images/demo/product1.png",
              },
              {
                name: "Self-Drill Wall Anchors",
                price: 15,
                assets: "/assets/images/demo/product2.png",
              },
            ],
    };

    const updatedWithToolSuggestion = [...messages, toolSuggestion];
    setMessages(updatedWithToolSuggestion);
    saveMessagesToLocalStorage(updatedWithToolSuggestion);

    // Hide the slider after a short delay
    setTimeout(() => {
      setShowBudgetSlider(false);
    }, 3000);
  };

  const handleBudgetCancel = () => {
    setShowBudgetSlider(false);
    const randomCancelResponse =
      mateyResponses.sliderCancel[
        Math.floor(Math.random() * mateyResponses.sliderCancel.length)
      ];
    const cancelMessage: Message = {
      id: Date.now().toString(),
      text: randomCancelResponse,
      sender: "matey",
      timestamp: new Date(),
      expression: "smile",
    };

    const updatedMessages = [...messages, cancelMessage];
    setMessages(updatedMessages);
    saveMessagesToLocalStorage(updatedMessages);
    showRandomEmojiBubble();
  };

  const handleTouchStart = (messageId: string) => {
    longPressTimeout = setTimeout(() => {
      setActiveMessageId(messageId);
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimeout);
  };

  const value: AppContextType = {
    selectedPrompt,
    setSelectedPrompt,
    clicked,
    setClicked,
    selectedBudget,
    setSelectedBudget,
    isOpen,
    setIsOpen,
    isMobileFullHeight,
    setIsMobileFullHeight,

    // Chat state
    messages,
    setMessages,
    inputValue,
    setInputValue,
    currentSuggestion,
    setCurrentSuggestion,
    isTyping,
    setIsTyping,
    isInitialized,
    setIsInitialized,
    showEmojiBubble,
    setShowEmojiBubble,
    currentEmoji,
    setCurrentEmoji,
    isCompletingText,
    setIsCompletingText,
    imagePreview,
    setImagePreview,
    isCompressingImage,
    setIsCompressingImage,
    suggestedPrompts,
    setSuggestedPrompts,
    showSuggestions,
    setShowSuggestions,
    uploadCount,
    setUploadCount,
    uploadDate,
    setUploadDate,
    showUploadButton,
    setShowUploadButton,
    mateyAskedForPhoto,
    setMateyAskedForPhoto,
    userAskedAboutUpload,
    setUserAskedAboutUpload,
    showPrompt,
    setShowPrompt,
    showBudgetSlider,
    setShowBudgetSlider,
    currentBudget,
    setCurrentBudget,
    budgetCompleted,
    setBudgetCompleted,
    extractedKeywords,
    setExtractedKeywords,
    extractedProductNames,
    setExtractedProductNames,
    revealPattern,
    setRevealPattern,
    showMicroQuiz,
    setShowMicroQuiz,
    showBudgetTab,
    setShowBudgetTab,
    showCreativeReveal,
    setShowCreativeReveal,
    quizCompleted,
    setQuizCompleted,
    userOwnedTools,
    setUserOwnedTools,
    estimatedBaseCost,
    setEstimatedBaseCost,
    hasOpenedBudget,
    setHasOpenedBudget,
    activeMessageId,
    setActiveMessageId,
    copiedMessageId,
    setCopiedMessageId,
    isInitialLoading,
    setIsInitialLoading,

    // Refs
    chatContainerRef,
    mobileMockChatRef,
    fileInputRef,
    inputRef,
    scrollContainerRef,
    userMessageSentDuringLoading,

    // Functions
    handleSendMessage,
    handleKeyDown,
    completeText,
    getSuggestionsForInput,
    handleFileChange,
    clearImagePreview,
    handlePromptClick,
    clearChatHistory,
    getContextualResponse,
    renderMateyExpression,
    handleFileUpload,
    handleBudgetChange,
    handleQuizComplete,
    handleBudgetTabSelect,
    handleCreativeSelect,
    handleBudgetComplete,
    handleBudgetCancel,
    showRandomEmojiBubble,
    checkIfUserAsksAboutUpload,
    handleTouchStart,
    handleTouchEnd,
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
    //loading states
    feedbackLoading,
    isMobileChatOpened,
    setIsMobileChatOpened,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export { AppContextProvider, AppContext };
