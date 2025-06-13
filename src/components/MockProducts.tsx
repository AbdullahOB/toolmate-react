export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  budgetTier: 'low' | 'medium' | 'high' | 'premium' | 'luxury';
}

export interface ToolCategory {
  name: string;
  averagePrice: number;
  essentialFactor: number; // How essential is this category (1-10)
}

// Average prices per category for budget calculations
export const toolCategories: ToolCategory[] = [
  { name: 'power tools', averagePrice: 85, essentialFactor: 9 },
  { name: 'hand tools', averagePrice: 35, essentialFactor: 8 },
  { name: 'hardware', averagePrice: 20, essentialFactor: 7 },
  { name: 'measuring tools', averagePrice: 30, essentialFactor: 6 },
  { name: 'safety equipment', averagePrice: 25, essentialFactor: 10 },
  { name: 'painting supplies', averagePrice: 40, essentialFactor: 5 },
  { name: 'plumbing tools', averagePrice: 50, essentialFactor: 7 },
  { name: 'electrical tools', averagePrice: 60, essentialFactor: 8 },
  { name: 'woodworking tools', averagePrice: 70, essentialFactor: 6 },
  { name: 'storage solutions', averagePrice: 45, essentialFactor: 4 },
];

// User's owned tools (to be populated based on quiz or conversation)
export let ownedTools: string[] = [];

// Set owned tools
export const setOwnedTools = (tools: string[]) => {
  ownedTools = tools;
};

// Calculate base cost for required tools
export const calculateBaseCost = (requiredCategories: string[]): number => {
  let baseCost = 0;

  requiredCategories.forEach((category) => {
    const toolCategory = toolCategories.find((tc) => tc.name === category);
    if (toolCategory) {
      baseCost += toolCategory.averagePrice;
    }
  });

  return baseCost;
};

// Calculate tier costs based on base cost
export const calculateTierCosts = (baseCost: number) => {
  return {
    matesChoice: Math.round(baseCost * 0.8), // 80% - bare-bones
    buildersPick: Math.round(baseCost * 1.0), // 100% - solid middle
    tradiesDream: Math.round(baseCost * 1.3), // 130% - bells and whistles
  };
};

// Adjust costs based on owned tools
export const adjustForOwnedTools = (requiredCategories: string[]): number => {
  let adjustedBaseCost = 0;

  requiredCategories.forEach((category) => {
    const toolCategory = toolCategories.find((tc) => tc.name === category);
    if (toolCategory && !ownedTools.includes(category)) {
      adjustedBaseCost += toolCategory.averagePrice;
    }
  });

  return adjustedBaseCost;
};

export const mockProducts: Product[] = [
  // Low Budget (Mate's Choice - 80%)
  {
    id: 'p1',
    name: 'Basic Drill Set',
    price: 35,
    description: 'Simple drill for basic home projects',
    category: 'power tools',
    imageUrl: '/assets/images/demo/product1.png',
    budgetTier: 'low',
  },
  {
    id: 'p2',
    name: 'Wall Anchors Pack',
    price: 8,
    description: 'Standard wall anchors for light fixtures',
    category: 'hardware',
    imageUrl: '/assets/images/demo/product2.png',
    budgetTier: 'low',
  },
  {
    id: 'p3',
    name: 'Screwdriver Set',
    price: 15,
    description: 'Basic screwdriver set with multiple heads',
    category: 'hand tools',
    imageUrl: '/assets/images/demo/product3.png',
    budgetTier: 'low',
  },
  {
    id: 'p4',
    name: 'Measuring Tape',
    price: 10,
    description: 'Standard 16ft measuring tape',
    category: 'measuring tools',
    imageUrl: '/assets/images/demo/product1.png',
    budgetTier: 'low',
  },
  {
    id: 'p5',
    name: 'Hammer',
    price: 12,
    description: 'Basic claw hammer for general use',
    category: 'hand tools',
    imageUrl: '/assets/images/demo/product2.png',
    budgetTier: 'low',
  },
  {
    id: 'p6',
    name: 'Safety Glasses',
    price: 8,
    description: 'Basic eye protection',
    category: 'safety equipment',
    imageUrl: '/assets/images/demo/product3.png',
    budgetTier: 'low',
  },

  // Medium Budget (Builder's Pick - 100%)
  {
    id: 'p7',
    name: 'Cordless Drill',
    price: 65,
    description: 'Reliable cordless drill with multiple settings',
    category: 'power tools',
    imageUrl: '/assets/images/demo/product1.png',
    budgetTier: 'medium',
  },
  {
    id: 'p8',
    name: 'Self-Drill Wall Anchors',
    price: 18,
    description: 'Premium self-drilling anchors for easy installation',
    category: 'hardware',
    imageUrl: '/assets/images/demo/product2.png',
    budgetTier: 'medium',
  },
  {
    id: 'p9',
    name: 'Multi-Tool Kit',
    price: 45,
    description: 'Versatile multi-tool for various home projects',
    category: 'hand tools',
    imageUrl: '/assets/images/demo/product3.png',
    budgetTier: 'medium',
  },
  {
    id: 'p10',
    name: 'Stud Finder',
    price: 25,
    description: 'Electronic stud finder with metal detection',
    category: 'measuring tools',
    imageUrl: '/assets/images/demo/product1.png',
    budgetTier: 'medium',
  },
  {
    id: 'p11',
    name: 'Level Set',
    price: 30,
    description: '3-piece level set for accurate measurements',
    category: 'measuring tools',
    imageUrl: '/assets/images/demo/product2.png',
    budgetTier: 'medium',
  },
  {
    id: 'p12',
    name: 'Work Gloves',
    price: 15,
    description: 'Durable work gloves for hand protection',
    category: 'safety equipment',
    imageUrl: '/assets/images/demo/product3.png',
    budgetTier: 'medium',
  },

  // High Budget (Tradie's Dream - 130%)
  {
    id: 'p13',
    name: 'Professional Drill Kit',
    price: 110,
    description: 'High-performance drill with multiple attachments',
    category: 'power tools',
    imageUrl: '/assets/images/demo/product1.png',
    budgetTier: 'high',
  },
  {
    id: 'p14',
    name: 'Heavy-Duty Anchoring System',
    price: 35,
    description: 'Professional-grade anchors for heavy items',
    category: 'hardware',
    imageUrl: '/assets/images/demo/product2.png',
    budgetTier: 'high',
  },
  {
    id: 'p15',
    name: 'Complete Tool Set',
    price: 95,
    description: 'Comprehensive tool set for serious DIYers',
    category: 'hand tools',
    imageUrl: '/assets/images/demo/product3.png',
    budgetTier: 'high',
  },
  {
    id: 'p16',
    name: 'Laser Level',
    price: 85,
    description: 'Self-leveling laser level for precise alignment',
    category: 'measuring tools',
    imageUrl: '/assets/images/demo/product1.png',
    budgetTier: 'high',
  },
  {
    id: 'p17',
    name: 'Impact Driver',
    price: 90,
    description: 'Powerful impact driver for tough fastening jobs',
    category: 'power tools',
    imageUrl: '/assets/images/demo/product2.png',
    budgetTier: 'high',
  },
  {
    id: 'p18',
    name: 'Safety Kit',
    price: 45,
    description: 'Complete safety kit with glasses, gloves, and ear protection',
    category: 'safety equipment',
    imageUrl: '/assets/images/demo/product3.png',
    budgetTier: 'high',
  },

  // Premium Budget (Additional high-end options)
  {
    id: 'p19',
    name: 'Contractor-Grade Drill',
    price: 150,
    description: 'Professional drill used by contractors',
    category: 'power tools',
    imageUrl: '/assets/images/demo/product1.png',
    budgetTier: 'premium',
  },
  {
    id: 'p20',
    name: 'Premium Mounting Hardware',
    price: 45,
    description: 'Top-quality mounting hardware for any surface',
    category: 'hardware',
    imageUrl: '/assets/images/demo/product2.png',
    budgetTier: 'premium',
  },
  {
    id: 'p21',
    name: 'Professional Tool Collection',
    price: 135,
    description: 'Complete professional-grade tool collection',
    category: 'hand tools',
    imageUrl: '/assets/images/demo/product3.png',
    budgetTier: 'premium',
  },
  {
    id: 'p22',
    name: 'Digital Measuring Tool',
    price: 125,
    description: 'Digital laser measuring tool for precise measurements',
    category: 'measuring tools',
    imageUrl: '/assets/images/demo/product1.png',
    budgetTier: 'premium',
  },
  {
    id: 'p23',
    name: 'Oscillating Multi-Tool',
    price: 140,
    description: 'Professional oscillating tool with multiple attachments',
    category: 'power tools',
    imageUrl: '/assets/images/demo/product2.png',
    budgetTier: 'premium',
  },
  {
    id: 'p24',
    name: 'Professional Safety Equipment',
    price: 75,
    description: 'Professional-grade safety equipment for serious work',
    category: 'safety equipment',
    imageUrl: '/assets/images/demo/product3.png',
    budgetTier: 'premium',
  },

  // Luxury Budget (Top-of-the-line options)
  {
    id: 'p25',
    name: 'Industrial Drill System',
    price: 195,
    description: 'Industrial-grade drill system with all attachments',
    category: 'power tools',
    imageUrl: '/assets/images/demo/product1.png',
    budgetTier: 'luxury',
  },
  {
    id: 'p26',
    name: 'Designer Hardware Set',
    price: 75,
    description: 'Designer hardware with premium finishes',
    category: 'hardware',
    imageUrl: '/assets/images/demo/product2.png',
    budgetTier: 'luxury',
  },
  {
    id: 'p27',
    name: 'Master Craftsman Tool Kit',
    price: 185,
    description: 'Complete master craftsman tool kit with case',
    category: 'hand tools',
    imageUrl: '/assets/images/demo/product3.png',
    budgetTier: 'luxury',
  },
  {
    id: 'p28',
    name: 'Rotary Hammer Drill',
    price: 175,
    description: 'Professional rotary hammer drill for concrete and masonry',
    category: 'power tools',
    imageUrl: '/assets/images/demo/product1.png',
    budgetTier: 'luxury',
  },
  {
    id: 'p29',
    name: 'Smart Tool System',
    price: 190,
    description: 'Connected tool system with smartphone integration',
    category: 'power tools',
    imageUrl: '/assets/images/demo/product2.png',
    budgetTier: 'luxury',
  },
  {
    id: 'p30',
    name: 'Professional Safety System',
    price: 95,
    description: 'Complete professional safety system with advanced features',
    category: 'safety equipment',
    imageUrl: '/assets/images/demo/product3.png',
    budgetTier: 'luxury',
  },
];

// Get products by budget tier
export const getProductsByTier = (tier: string) => {
  switch (tier) {
    case 'matesChoice':
      return mockProducts.filter((p) => p.budgetTier === 'low');
    case 'buildersPick':
      return mockProducts.filter((p) => ['low', 'medium'].includes(p.budgetTier));
    case 'tradiesDream':
      return mockProducts.filter((p) => ['medium', 'high'].includes(p.budgetTier));
    default:
      return mockProducts;
  }
};

// Get products by budget value (0-100 slider value)
export const getProductsByBudget = (budget: number) => {
  // Budget ranges
  if (budget <= 33) {
    return mockProducts.filter((p) => p.budgetTier === 'low');
  } else if (budget <= 66) {
    return mockProducts.filter((p) => ['low', 'medium'].includes(p.budgetTier));
  } else {
    return mockProducts.filter((p) => ['medium', 'high', 'premium'].includes(p.budgetTier));
  }
};

// Get products by keywords
export const getProductsByKeywords = (keywords: string[]) => {
  if (!keywords.length) return [];

  const keywordRegex = new RegExp(keywords.join('|'), 'i');
  return mockProducts.filter(
    (product) =>
      keywordRegex.test(product.name) || keywordRegex.test(product.description) || keywordRegex.test(product.category)
  );
};

// Common DIY and tool-related keywords for extraction
const toolKeywords = [
  'drill',
  'hammer',
  'screwdriver',
  'saw',
  'level',
  'measure',
  'tape',
  'nail',
  'screw',
  'anchor',
  'mount',
  'hang',
  'install',
  'fix',
  'repair',
  'build',
  'paint',
  'brush',
  'roller',
  'sander',
  'sand',
  'cut',
  'drill bit',
  'wrench',
  'pliers',
  'clamp',
  'glue',
  'tape',
  'ladder',
  'wall',
  'ceiling',
  'floor',
  'tile',
  'wood',
  'metal',
  'plastic',
  'concrete',
  'brick',
  'drywall',
  'stud',
  'pipe',
  'wire',
  'cable',
  'electric',
  'plumbing',
  'furniture',
  'shelf',
  'cabinet',
  'door',
  'window',
  'mirror',
  'picture',
  'frame',
  'garden',
  'outdoor',
  'lawn',
  'deck',
  'fence',
];

// Extract keywords from text
export const extractKeywords = (text: string): string[] => {
  const words = text.toLowerCase().split(/\s+/);
  return words.filter((word) => toolKeywords.some((keyword) => word.includes(keyword) || keyword.includes(word)));
};

// Detect if user is asking for help
export const detectHelpRequest = (text: string): boolean => {
  const helpPhrases = [
    'help',
    'suggest',
    'recommend',
    'advice',
    'what should',
    'which',
    'need a',
    'looking for',
    'can you recommend',
    'what tool',
    "what's the best",
    'what is the best',
    'not sure',
    "don't know",
    'confused',
    'options',
    'alternatives',
    'ideas',
    'cost',
    'price',
    'budget',
    'cheap',
    'expensive',
    'affordable',
    'quality',
    'best value',
  ];

  const lowerText = text.toLowerCase();
  return helpPhrases.some((phrase) => lowerText.includes(phrase));
};

// Extract product names from text
export const extractProductNames = (text: string): string[] => {
  const productTypes = [
    'drill',
    'hammer',
    'screwdriver',
    'saw',
    'level',
    'measuring tape',
    'stud finder',
    'wrench',
    'pliers',
    'sander',
    'nail gun',
    'impact driver',
    'circular saw',
    'jigsaw',
    'miter saw',
    'table saw',
    'router',
    'oscillating tool',
    'angle grinder',
    'heat gun',
    'staple gun',
    'caulking gun',
    'clamp',
    'workbench',
    'toolbox',
    'tool chest',
    'ladder',
    'step stool',
    'utility knife',
    'tape measure',
    'laser level',
    'digital level',
    'spirit level',
    'torpedo level',
    'chalk line',
    'chisel',
    'file',
    'rasp',
    'plane',
    'hand saw',
    'hacksaw',
    'coping saw',
    'wire stripper',
    'crimping tool',
    'multimeter',
    'voltage tester',
    'stud finder',
    'pipe cutter',
    'pipe wrench',
    'basin wrench',
    'adjustable wrench',
    'socket set',
    'ratchet',
    'torque wrench',
    'hex key',
    'allen wrench',
    'screwdriver bit',
    'drill bit',
    'spade bit',
    'hole saw',
    'forstner bit',
    'countersink bit',
    'brad point bit',
    'masonry bit',
    'tile bit',
    'glass bit',
    'wood bit',
    'metal bit',
    'universal bit',
    'driver bit',
  ];

  const lowerText = text.toLowerCase();
  return productTypes.filter((product) => lowerText.includes(product));
};

// Extract skill level from text
export const extractSkillLevel = (text: string): 'beginner' | 'intermediate' | 'advanced' | null => {
  const lowerText = text.toLowerCase();

  const beginnerPhrases = ['never', 'first time', 'beginner', 'novice', 'new to', 'no experience', 'just starting'];
  const intermediatePhrases = ['some experience', 'done before', 'familiar', 'comfortable', 'know how'];
  const advancedPhrases = ['experienced', 'expert', 'professional', 'tradesperson', 'tradie', 'contractor', 'advanced'];

  if (beginnerPhrases.some((phrase) => lowerText.includes(phrase))) {
    return 'beginner';
  }

  if (advancedPhrases.some((phrase) => lowerText.includes(phrase))) {
    return 'advanced';
  }

  if (intermediatePhrases.some((phrase) => lowerText.includes(phrase))) {
    return 'intermediate';
  }

  return null;
};

// Quiz questions for micro-quiz reveal
export const quizQuestions = [
  {
    id: 'tools',
    question: 'What tools do you already own?',
    options: ['None/very few', 'Basic toolkit', 'Quite a few', 'Professional set'],
    valueMap: {
      'None/very few': [],
      'Basic toolkit': ['hammer', 'screwdriver set', 'measuring tape'],
      'Quite a few': ['hammer', 'screwdriver set', 'measuring tape', 'drill', 'level', 'pliers'],
      'Professional set': [
        'hammer',
        'screwdriver set',
        'measuring tape',
        'drill',
        'level',
        'pliers',
        'power tools',
        'specialty tools',
      ],
    },
  },
  {
    id: 'skill',
    question: 'How would you rate your DIY skills?',
    options: ['Complete beginner', 'Some experience', 'Confident DIYer', 'Professional/Tradie'],
    valueMap: {
      'Complete beginner': 'beginner',
      'Some experience': 'intermediate',
      'Confident DIYer': 'intermediate',
      'Professional/Tradie': 'advanced',
    },
  },
  {
    id: 'comfort',
    question: "What's your comfort level with spending on tools?",
    options: ['Bare minimum', 'Good value', 'Quality matters', 'Only the best'],
    valueMap: {
      'Bare minimum': 'matesChoice',
      'Good value': 'buildersPick',
      'Quality matters': 'buildersPick',
      'Only the best': 'tradiesDream',
    },
  },
];
