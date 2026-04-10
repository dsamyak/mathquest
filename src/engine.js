/* ============================================
   MathQuest — Question Generator Engine
   Algorithmically generates unlimited unique questions
   based on core templates and difficulty scaling.
   ============================================ */

const NAMES = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Charlie', 'Drew'];
const ITEMS = ['apples', 'stickers', 'marbles', 'cards', 'blocks', 'books', 'coins', 'candies'];
const OBJECTS = ['bag', 'dress', 'toy', 'game', 'watch', 'phone', 'shoes', 'bicycle'];

// Helper to get random item
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to generate a random integer between min and max (inclusive)
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle an array
export function shuffle(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Generate multiple choice distractors
function generateDistractors(correctAnswer, type = 'number') {
  const isStr = typeof correctAnswer === 'string';
  let numAns = isStr ? parseFloat(correctAnswer) : correctAnswer;
  if (isNaN(numAns)) numAns = 10; // fallback if not a number

  const distractors = new Set();
  
  // Logical mistakes based on typical errors
  if (type === 'addition') {
    distractors.add(numAns + 10);
    distractors.add(numAns - 10);
    distractors.add(numAns + 100);
  } else if (type === 'subtraction') {
    distractors.add(numAns + 10);
    distractors.add(Math.abs(numAns - 10)); // prevent negative if possible
    distractors.add(numAns + 100);
  } else if (type === 'multiplication') {
    distractors.add(Math.floor(numAns * 1.5));
    distractors.add(numAns + randInt(1, 5));
    distractors.add(numAns - randInt(1, 5));
  } else {
    // Generic number distractors
    distractors.add(numAns + randInt(1, 10));
    const sub = numAns - randInt(1, 10);
    distractors.add(sub > 0 ? sub : numAns + randInt(11, 20));
    distractors.add(Math.floor(numAns * 1.1) + 1);
  }

  // Fallback if we don't have 3 unique distractors
  while (distractors.size < 3 || distractors.has(numAns)) {
    distractors.delete(numAns);
    const mod = randInt(-15, 15);
    if (mod !== 0) distractors.add(Math.max(1, numAns + mod));
  }

  return Array.from(distractors).slice(0, 3).map(String);
}


/* --- Core Templates --- */

const Templates = {
  // === Module 1 & 2 Basics ===
  
  addition_simple() {
    const a = randInt(10, 40);
    const b = randInt(10, 40);
    const ans = a + b;
    return {
      q: `What is ${a} + ${b}?`,
      a: String(ans),
      choices: shuffle([String(ans), ...generateDistractors(ans, 'addition')])
    };
  },

  addition_regroup() {
    const a = randInt(15, 89);
    // ensure regrouping on ones digit
    const onesA = a % 10;
    const onesB = randInt(10 - onesA, 9); 
    const b = randInt(1, 8) * 10 + onesB;
    const ans = a + b;
    return {
      q: `What is ${a} + ${b}?`,
      a: String(ans),
      choices: shuffle([String(ans), ...generateDistractors(ans, 'addition')])
    };
  },

  subtraction_simple() {
    const a = randInt(20, 99);
    // ensure no regrouping
    const onesA = a % 10;
    const onesB = randInt(0, onesA);
    const tensB = randInt(1, Math.floor(a/10));
    const b = tensB * 10 + onesB;
    const ans = a - b;
    return {
      q: `What is ${a} - ${b}?`,
      a: String(ans),
      choices: shuffle([String(ans), ...generateDistractors(ans, 'subtraction')])
    };
  },

  subtraction_regroup() {
    const a = randInt(30, 99);
    // ensure regrouping on ones digit
    const onesA = a % 10;
    const onesB = randInt(onesA + 1, 9);
    const tensB = randInt(1, Math.floor(a/10) - 1);
    const b = tensB * 10 + onesB;
    const ans = a - b;
    return {
      q: `What is ${a} - ${b}?`,
      a: String(ans),
      choices: shuffle([String(ans), ...generateDistractors(ans, 'subtraction')])
    };
  },

  multiplication_intro() {
    const groups = randInt(2, 5);
    const perGroup = randInt(2, 5);
    const ans = groups * perGroup;
    return {
      q: `There are ${groups} groups of ${perGroup}. How many in total?`,
      a: String(ans),
      choices: shuffle([String(ans), ...generateDistractors(ans, 'multiplication')])
    };
  },

  division_intro() {
    const perGroup = randInt(2, 5);
    const groups = randInt(2, 5);
    const total = groups * perGroup;
    return {
      q: `Share ${total} ${rand(ITEMS)} equally among ${groups} friends. How many does each get?`,
      a: String(perGroup),
      choices: shuffle([String(perGroup), ...generateDistractors(perGroup, 'division')])
    };
  },


  // === Module 3 Advanced ===

  multiplication_tables() {
    const a = randInt(6, 9);
    const b = randInt(4, 9);
    const ans = a * b;
    return {
      q: `What is ${a} × ${b}?`,
      a: String(ans),
      choices: shuffle([String(ans), ...generateDistractors(ans, 'multiplication')])
    };
  },

  division_remainders() {
    const divisor = randInt(3, 9);
    const quotient = randInt(3, 9);
    const remainder = randInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    const ans = `${quotient} R ${remainder}`;
    
    // Custom distractors for remainders
    const d1 = `${quotient} R ${remainder + 1}`;
    const d2 = `${quotient+1} R ${remainder}`;
    const d3 = `${quotient-1} R ${Math.abs(remainder - 1)}`;
    
    return {
      q: `What is ${dividend} ÷ ${divisor}?`,
      a: ans,
      choices: shuffle([ans, d1, d2, d3])
    };
  },

  fractions_intro() {
    const den = randInt(3, 10);
    const num = randInt(1, den - 1);
    return {
      q: `What fraction is ${num} out of ${den}?`,
      a: `${num}/${den}`,
      choices: shuffle([`${num}/${den}`, `${den}/${num}`, `${num+1}/${den}`, `${num}/${den+1}`])
    };
  },

  fractions_equivalent() {
    const num = randInt(1, 4);
    const den = randInt(num + 1, 6);
    const mult = randInt(2, 4);
    const ansNum = num * mult;
    const ansDen = den * mult;
    
    return {
      q: `Which fraction is equivalent to ${num}/${den}?`,
      a: `${ansNum}/${ansDen}`,
      choices: shuffle([
        `${ansNum}/${ansDen}`, 
        `${ansNum+1}/${ansDen}`, 
        `${ansNum}/${ansDen+1}`, 
        `${num+mult}/${den+mult}` // common student mistake
      ])
    };
  },


  /* === INTERACTIVE BUILDERS: Part-Whole & Comparison === */

  word_part_whole() {
    const name = rand(NAMES);
    const item1 = rand(OBJECTS);
    const item2 = rand(OBJECTS);
    const val1 = randInt(100, 500);
    const val2 = randInt(100, 400);
    const val3 = randInt(50, 300);
    const total = val1 + val2 + val3;
    
    return {
      builderType: 'part-whole',
      q: `${name} spent $${val1} on a ${item1} and $${val2} on a ${item2}. ${name} had $${val3} left. How much money did ${name} have at first?`,
      blocks: [val1, val2, val3],
      a: String(total)
    };
  },

  word_comparison() {
    const name1 = rand(NAMES);
    let name2 = rand(NAMES);
    while (name1 === name2) name2 = rand(NAMES);
    
    const baseVal = randInt(500, 2000);
    const diff = randInt(100, 500);
    
    // Person 1 is base, Person 2 is base + diff
    const entity2Val = baseVal + diff;
    const total = baseVal + entity2Val;
    
    return {
      builderType: 'comparison',
      q: `${name1} saved $${baseVal}. ${name2} saved $${diff} more than ${name1}. How much did they save altogether?`,
      entity1: name1,
      entity2: name2,
      blocks: [
        { val: baseVal, label: `$${baseVal}` },
        { val: diff, label: `$${diff}` }
      ],
      a: String(total),
      baseVal: baseVal,
      diffVal: diff
    };
  },


  /* === SPECIAL TEMPLATES (100+ Assignment Mode) ====== */
  // These are the complex problems from the textbook

  template_a_shop_sales() {
    // Template A (File Shop): "A shopkeeper sold [X] items on Saturday. It sold [Y] fewer items on Sunday. It sold [Z] times as many items on Sunday as on Monday. At $[W] each, how much money did he get Monday?"
    
    const w = randInt(2, 6); // price
    const z = randInt(2, 4); // multiplier
    const mondayCount = randInt(50, 200); 
    const sundayCount = mondayCount * z;
    const y = randInt(50, 150); // fewer
    const saturdayCount = sundayCount + y; // x
    const ans = mondayCount * w;
    const item = rand(ITEMS);
    
    return {
      q: `A shopkeeper sold ${saturdayCount} ${item} on Saturday. They sold ${y} fewer ${item} on Sunday. They sold ${z} times as many ${item} on Sunday as on Monday. At $${w} each, how much money did they get on Monday?`,
      a: String(ans),
      choices: shuffle([String(ans), ...generateDistractors(ans, 'number')])
    };
  },

  template_b_transfer() {
    // Template B (Transfer Problem): "[Person A] and [Person B] had items. After [B] gave [X] items to [A], [A] had [Y] items. [B] then had [Z] fewer items than [A]. How many did [B] have at first?"
    
    const nameA = rand(NAMES);
    let nameB = rand(NAMES);
    while (nameA === nameB) nameB = rand(NAMES);
    const items = rand(ITEMS);
    
    const finalA = randInt(200, 500); // Y
    const z = randInt(30, 80); // fewer amount for B
    const finalB = finalA - z; 
    
    const transferX = randInt(20, 100); // X
    const initialB = finalB + transferX;
    
    return {
      q: `${nameA} and ${nameB} had some ${items}. After ${nameB} gave ${transferX} ${items} to ${nameA}, ${nameA} had ${finalA} ${items}. ${nameB} then had ${z} fewer ${items} than ${nameA}. How many ${items} did ${nameB} have at first?`,
      a: String(initialB),
      choices: shuffle([String(initialB), ...generateDistractors(initialB, 'number')])
    };
  },
  
  template_guess_check() {
    // "Guess and Check" money problem (46 total $5 and $2 notes valuing $149)
    const valA = randInt(0, 1) === 0 ? 5 : 10;
    const valB = 2; // Keep it simple: 2
    
    const qtyA = randInt(15, 30);
    const qtyB = randInt(15, 30);
    
    const totalCount = qtyA + qtyB;
    const totalValue = (qtyA * valA) + (qtyB * valB);
    
    return {
      builderType: 'guess-check',
      q: `A piggy bank contains ${totalCount} notes consisting of $${valA} and $${valB} notes. The total value is $${totalValue}. Find the number of $${valA} notes.`,
      params: {
        valA: valA,
        valB: valB,
        targetCount: totalCount,
        targetValue: totalValue
      },
      a: String(qtyA)
    };
  }
};


// Fallback generator for generic topic types when a specific template isn't defined yet
function generateGeneric(questionType) {
  const num1 = randInt(1, 100);
  const num2 = randInt(1, 100);
  const ans = num1 + num2;
  return {
    q: `Generic Problem: What is ${num1} + ${num2}? (Type: ${questionType})`,
    a: String(ans),
    choices: shuffle([String(ans), ...generateDistractors(ans, 'addition')])
  };
}


// Exported API
export const Generator = {
  
  getQuestion(questionType) {
    if (Templates[questionType]) {
      return Templates[questionType]();
    }
    console.warn(`Template missing for: ${questionType}. Using generic generator.`);
    return generateGeneric(questionType);
  },
  
  // Gets a sequence of questions for a lesson
  getLessonItems(lessonData) {
    const items = [];
    const count = lessonData.questionsPerLesson || 10;
    
    for (let i = 0; i < count; i++) {
      items.push(this.getQuestion(lessonData.questionType));
    }
    return items;
  },
  
  // Generates a set of questions for the Gamified Syllabus Task
  generateSyllabusTask() {
    const items = [];
    // We mix multiple syllabus topics
    const pool = [
      'template_a_shop_sales',
      'template_b_transfer',
      'word_part_whole',
      'word_comparison',
      'template_guess_check',
      'addition_regroup',
      'subtraction_regroup',
      'multiplication_tables',
      'division_remainders',
      'fractions_equivalent'
    ];
    
    // Generate a manageable task of 50 questions
    for (let i = 0; i < 50; i++) {
      const type = rand(pool);
      items.push(this.getQuestion(type));
    }
    
    return items;
  }
};
