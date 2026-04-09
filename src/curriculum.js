/* ============================================
   MathQuest — Curriculum Data
   All modules, lessons, and their configurations
   ============================================ */

export const MODULES = [
  {
    id: 1,
    title: 'Foundations',
    subtitle: 'Primary 1A/1B Level',
    icon: '🧱',
    description: 'Master numbers, basic operations, time, money, and picture graphs. Build a solid foundation for your math journey!',
    color: 'primary',
    lessons: [
      {
        title: 'Numbers to 10',
        desc: 'Count and recognize numbers 1-10',
        type: 'quiz',
        questionType: 'counting_10',
        questionsPerLesson: 10,
        xpPerQuestion: 5,
      },
      {
        title: 'Numbers to 20',
        desc: 'Explore numbers from 11 to 20',
        type: 'quiz',
        questionType: 'counting_20',
        questionsPerLesson: 10,
        xpPerQuestion: 5,
      },
      {
        title: 'Numbers to 40',
        desc: 'Place value with tens and ones',
        type: 'quiz',
        questionType: 'place_value_40',
        questionsPerLesson: 10,
        xpPerQuestion: 8,
      },
      {
        title: 'Numbers to 100',
        desc: 'Master the hundreds chart',
        type: 'quiz',
        questionType: 'counting_100',
        questionsPerLesson: 10,
        xpPerQuestion: 8,
      },
      {
        title: 'Addition Without Regrouping',
        desc: 'Add numbers without carrying',
        type: 'quiz',
        questionType: 'addition_simple',
        questionsPerLesson: 10,
        xpPerQuestion: 8,
      },
      {
        title: 'Subtraction Without Regrouping',
        desc: 'Subtract without borrowing',
        type: 'quiz',
        questionType: 'subtraction_simple',
        questionsPerLesson: 10,
        xpPerQuestion: 8,
      },
      {
        title: 'Addition With Regrouping',
        desc: 'Learn to carry over when adding',
        type: 'quiz',
        questionType: 'addition_regroup',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Subtraction With Regrouping',
        desc: 'Learn to borrow when subtracting',
        type: 'quiz',
        questionType: 'subtraction_regroup',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Number Bonds',
        desc: 'Split and combine numbers flexibly',
        type: 'quiz',
        questionType: 'number_bonds',
        questionsPerLesson: 10,
        xpPerQuestion: 8,
      },
      {
        title: 'Telling Time',
        desc: 'Read clocks to the hour and half-hour',
        type: 'quiz',
        questionType: 'time_basic',
        questionsPerLesson: 10,
        xpPerQuestion: 8,
      },
      {
        title: 'Money',
        desc: 'Count coins and notes',
        type: 'quiz',
        questionType: 'money_basic',
        questionsPerLesson: 10,
        xpPerQuestion: 8,
      },
      {
        title: 'Multiplication as Repeated Addition',
        desc: 'Understand multiplication through groups',
        type: 'quiz',
        questionType: 'multiplication_intro',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Division: Sharing & Grouping',
        desc: 'Divide items into equal groups',
        type: 'quiz',
        questionType: 'division_intro',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Picture Graphs',
        desc: 'Read and build picture graphs',
        type: 'quiz',
        questionType: 'picture_graph',
        questionsPerLesson: 10,
        xpPerQuestion: 8,
      },
    ]
  },
  {
    id: 2,
    title: 'Advanced Fundamentals',
    subtitle: 'Numbers to 10,000',
    icon: '📊',
    description: 'Work with larger numbers, master regrouping with 4-digit numbers, and solve word problems using Part-Whole and Comparison models.',
    color: 'secondary',
    lessons: [
      {
        title: 'Numbers to 1,000',
        desc: 'Hundreds, tens, and ones place value',
        type: 'quiz',
        questionType: 'place_value_1000',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Numbers to 10,000',
        desc: 'Thousands place and expanded notation',
        type: 'quiz',
        questionType: 'place_value_10000',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: 'Number Patterns',
        desc: 'Find and continue number sequences',
        type: 'quiz',
        questionType: 'number_patterns',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: '4-Digit Addition',
        desc: 'Add large numbers with regrouping',
        type: 'quiz',
        questionType: 'addition_4digit',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: '4-Digit Subtraction',
        desc: 'Subtract large numbers with regrouping',
        type: 'quiz',
        questionType: 'subtraction_4digit',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: 'Word Problems: Part-Whole Model',
        desc: 'Build block models to solve problems',
        type: 'part-whole',
        questionType: 'word_part_whole',
        questionsPerLesson: 8,
        xpPerQuestion: 15,
      },
      {
        title: 'Word Problems: Comparison Model',
        desc: 'Compare quantities using block models',
        type: 'comparison',
        questionType: 'word_comparison',
        questionsPerLesson: 8,
        xpPerQuestion: 15,
      },
    ]
  },
  {
    id: 3,
    title: 'Mastery Topics',
    subtitle: 'Advanced Problem Solving',
    icon: '🏆',
    description: 'Multiplication tables, fractions, geometry, measurement, and complex word problems. Become a true Math Master!',
    color: 'warm',
    lessons: [
      {
        title: 'Multiplication Tables (6-9)',
        desc: 'Master the harder times tables',
        type: 'quiz',
        questionType: 'multiplication_tables',
        questionsPerLesson: 12,
        xpPerQuestion: 10,
      },
      {
        title: 'Division With & Without Remainders',
        desc: 'Divide with leftover amounts',
        type: 'quiz',
        questionType: 'division_remainders',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: 'Introduction to Fractions',
        desc: 'Understand parts of a whole',
        type: 'quiz',
        questionType: 'fractions_intro',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Equivalent Fractions',
        desc: 'Find fractions that are equal',
        type: 'quiz',
        questionType: 'fractions_equivalent',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: 'Comparing & Ordering Fractions',
        desc: 'Which fraction is greater?',
        type: 'quiz',
        questionType: 'fractions_compare',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: 'Adding & Subtracting Fractions',
        desc: 'Combine and subtract fractions',
        type: 'quiz',
        questionType: 'fractions_add_sub',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: 'Length, Mass & Volume',
        desc: 'Measure and convert units',
        type: 'quiz',
        questionType: 'measurement',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Bar Graphs',
        desc: 'Read, interpret, and build bar graphs',
        type: 'quiz',
        questionType: 'bar_graphs',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Angles',
        desc: 'Right, acute, and obtuse angles',
        type: 'quiz',
        questionType: 'angles',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Perpendicular & Parallel Lines',
        desc: 'Identify line relationships',
        type: 'quiz',
        questionType: 'lines',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Area & Perimeter',
        desc: 'Calculate space and boundary lengths',
        type: 'quiz',
        questionType: 'area_perimeter',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
    ]
  }
];

// Helper: get flat lesson reference
export function getLesson(moduleId, lessonIndex) {
  const mod = MODULES.find(m => m.id === moduleId);
  if (!mod) return null;
  return mod.lessons[lessonIndex] || null;
}

export function getModule(moduleId) {
  return MODULES.find(m => m.id === moduleId) || null;
}
