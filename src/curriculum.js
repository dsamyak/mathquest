/* ============================================
   MathQuest — Curriculum Data
   Singapore MOE Primary Mathematics Syllabus
   All modules, lessons, and their configurations
   ============================================ */

export const MODULES = [
  {
    id: 1,
    title: 'Primary 1',
    subtitle: 'Grade 1 — Singapore MOE',
    icon: '✏️',
    description: 'Master the foundations! Learn numbers 0–100, trace and write digits, discover number bonds, add & subtract within 40, tell time, identify shapes, and read picture graphs — the full P1 Singapore syllabus.',
    color: 'primary',
    lessons: [
      {
        title: 'Number Tracing: 0–9',
        desc: 'Trace and learn to write every digit',
        type: 'tracing',
        questionType: 'number_tracing',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Counting to 10',
        desc: 'Count objects and match to numerals',
        type: 'quiz',
        questionType: 'counting_10',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Counting to 20',
        desc: 'Teens, ten-frames, and number words',
        type: 'quiz',
        questionType: 'counting_20',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Counting to 100',
        desc: 'Skip counting by 2s, 5s, and 10s',
        type: 'quiz',
        questionType: 'counting_100',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Comparing & Ordering',
        desc: 'Greater than, less than, and ordering',
        type: 'quiz',
        questionType: 'comparing_ordering',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Number Bonds',
        desc: 'Making 10 and part-whole thinking',
        type: 'quiz',
        questionType: 'number_bonds',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Addition Within 20',
        desc: 'Adding with stories and pictures',
        type: 'quiz',
        questionType: 'addition_within_20',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Subtraction Within 20',
        desc: 'Take away and find the difference',
        type: 'quiz',
        questionType: 'subtraction_within_20',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Addition & Subtraction Within 40',
        desc: 'Mental maths with bigger numbers',
        type: 'quiz',
        questionType: 'add_sub_within_40',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Length & Mass',
        desc: 'Comparing tall/short, heavy/light',
        type: 'quiz',
        questionType: 'length_mass',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Telling Time',
        desc: "O'clock and half past the hour",
        type: 'quiz',
        questionType: 'telling_time_p1',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: '2D & 3D Shapes',
        desc: 'Circles, triangles, cubes, and more',
        type: 'quiz',
        questionType: 'shapes_2d_3d',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Picture Graphs',
        desc: 'Read and understand simple graphs',
        type: 'quiz',
        questionType: 'picture_graphs',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Patterns',
        desc: 'Number patterns and shape patterns',
        type: 'quiz',
        questionType: 'patterns',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
    ]
  },
  {
    id: 2,
    title: 'Primary 2',
    subtitle: 'Grade 2 — Singapore MOE',
    icon: '🧱',
    description: 'Grow your skills! Master numbers to 1,000, learn multiplication & division basics, explore fractions, money, time, and 2D/3D shapes with concrete and pictorial models.',
    color: 'secondary',
    lessons: [
      {
        title: 'Numbers to 1,000',
        desc: 'Place value with Concrete-Pictorial blocks',
        type: 'quiz',
        questionType: 'place_value_1000',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Addition & Subtraction',
        desc: 'Operations within 1,000',
        type: 'quiz',
        questionType: 'addition_4digit',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Multiplication & Division Intro',
        desc: 'Grouping and sharing basics',
        type: 'quiz',
        questionType: 'multiplication_intro',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Fractions Intro',
        desc: 'Understanding equal parts',
        type: 'quiz',
        questionType: 'fractions_intro',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Money',
        desc: 'Counting dollars and cents',
        type: 'quiz',
        questionType: 'money_basic',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
      {
        title: 'Time & 2D/3D Shapes',
        desc: 'Reading clocks and identifying shapes',
        type: 'quiz',
        questionType: 'time_basic',
        questionsPerLesson: 10,
        xpPerQuestion: 10,
      },
    ]
  },
  {
    id: 3,
    title: 'Middle Primary',
    subtitle: 'Primary 3 & 4',
    icon: '📊',
    description: 'Dive into Visual Model Drawing! Master numbers to 100,000, learn the famous Singapore Bar Model method, and explore area, perimeter, and bar graphs.',
    color: 'warm',
    lessons: [
      {
        title: 'Numbers to 100,000',
        desc: 'Mastering large numbers and place value',
        type: 'quiz',
        questionType: 'place_value_10000',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: 'Equivalent Fractions & Decimals',
        desc: 'Comparing values and converting forms',
        type: 'quiz',
        questionType: 'fractions_equivalent',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: 'Bar Modeling: Part-Whole Model',
        desc: 'Build block architectures to find totals',
        type: 'part-whole',
        questionType: 'word_part_whole',
        questionsPerLesson: 8,
        xpPerQuestion: 15,
      },
      {
        title: 'Bar Modeling: Comparison Model',
        desc: 'Compare quantities using stacked models',
        type: 'comparison',
        questionType: 'word_comparison',
        questionsPerLesson: 8,
        xpPerQuestion: 15,
      },
      {
        title: 'Area and Perimeter',
        desc: 'Calculate space for rectangles and squares',
        type: 'quiz',
        questionType: 'area_perimeter',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
      {
        title: 'Symmetry & Bar Graphs',
        desc: 'Analyze patterns and data tables',
        type: 'quiz',
        questionType: 'bar_graphs',
        questionsPerLesson: 10,
        xpPerQuestion: 12,
      },
    ]
  },
  {
    id: 4,
    title: 'Upper Primary',
    subtitle: 'Primary 5 & 6',
    icon: '🏆',
    description: 'Conquer advanced heuristics! Master percentages, ratios, rate, and complex algebraic word problems using advanced logical models.',
    color: 'danger',
    lessons: [
      {
        title: 'Four Operations with Fractions',
        desc: 'Add, subtract, multiply, and divide fractions',
        type: 'quiz',
        questionType: 'fractions_add_sub',
        questionsPerLesson: 10,
        xpPerQuestion: 15,
      },
      {
        title: 'Ratio and Proportion',
        desc: 'Compare multiple quantities',
        type: 'guess-check',
        questionType: 'guess_check',
        questionsPerLesson: 8,
        xpPerQuestion: 15,
      },
      {
        title: 'Percentages',
        desc: 'Calculate discounts and percentage changes',
        type: 'quiz',
        questionType: 'fractions_intro',
        questionsPerLesson: 10,
        xpPerQuestion: 15,
      },
      {
        title: 'Advanced Bar Modeling',
        desc: 'Before/After scenarios and Equal Concept',
        type: 'comparison',
        questionType: 'word_comparison',
        questionsPerLesson: 8,
        xpPerQuestion: 20,
      },
      {
        title: 'Geometry: Triangles, Circles, & Angles',
        desc: 'Properties of complex shapes',
        type: 'quiz',
        questionType: 'angles',
        questionsPerLesson: 10,
        xpPerQuestion: 15,
      },
      {
        title: 'Rate & Average',
        desc: 'Calculate speed, distance, and time',
        type: 'quiz',
        questionType: 'measurement',
        questionsPerLesson: 10,
        xpPerQuestion: 15,
      },
      {
        title: 'Basic Algebra',
        desc: 'Solve equations with unknown variables',
        type: 'guess-check',
        questionType: 'guess_check',
        questionsPerLesson: 8,
        xpPerQuestion: 20,
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
