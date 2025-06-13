const KeywordsInformations = () => {
  const suggestionsByKeyword: Record<string, string[]> = {
    how: ['How do I install a ceiling fan?', 'How to fix a leaky faucet?', 'How can I build a bookshelf?'],
    what: [
      'What tools do I need for tiling?',
      "What's the best drill for concrete?",
      'What type of saw should I use for laminate?',
    ],
    which: [
      'Which hammer is best for framing?',
      'Which power tools are essential for beginners?',
      'Which screws should I use for drywall?',
    ],
    can: [
      'Can you recommend tools for kitchen renovation?',
      'Can I use a regular drill for concrete?',
      'Can you help me choose between cordless tools?',
    ],
    i: ['I need to hang a heavy mirror', 'I want to build a deck', "I'm looking for power tools for beginners"],
    drill: [
      'I need a drill for concrete walls',
      "What's the best drill for woodworking?",
      'Drill bits for metal surfaces',
    ],
    saw: [
      'What type of saw do I need for cutting laminate?',
      'Saw recommendations for precision cuts',
      'Best saw for beginners',
    ],
    hammer: [
      'What hammer should I use for framing?',
      'Hammer recommendations for small projects',
      'Different types of hammers and their uses',
    ],
    paint: [
      'Best paint for bathroom walls',
      'Paint recommendations for outdoor furniture',
      'How to choose the right paint finish',
    ],
    screw: [
      'What screws should I use for drywall?',
      'Screwdriver recommendations for furniture assembly',
      'Different types of screws for woodworking',
    ],
    tool: [
      'Essential tools for a beginner DIYer',
      'Tools needed for kitchen renovation',
      'Best multi-tools for home projects',
    ],
    fix: ['How to fix a leaky faucet', 'Fix squeaky door hinges', 'Tools to fix loose floorboards'],
    build: ['Tools needed to build a deck', 'How to build a bookshelf', 'Best wood for building outdoor furniture'],
    install: [
      'How to install ceiling lights',
      'Tools for installing kitchen cabinets',
      'Install floating shelves on drywall',
    ],
  };
  return suggestionsByKeyword;
};

export default KeywordsInformations;
