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
  } else if (type === 'small') {
    // For small numbers (P1 level)
    distractors.add(Math.max(0, numAns - randInt(1, 3)));
    distractors.add(numAns + randInt(1, 3));
    distractors.add(numAns + randInt(4, 6));
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
    if (mod !== 0) distractors.add(Math.max(0, numAns + mod));
  }

  return Array.from(distractors).slice(0, 3).map(String);
}


/* ================================================================
   PRIMARY 1 TEMPLATES — Singapore MOE Syllabus
   ================================================================ */

// Emoji sets for counting visuals
const COUNT_EMOJI = ['🍎', '⭐', '🌸', '🐟', '🦋', '🍊', '🎈', '🍓', '🐱', '🌻'];

// SVG path data for digit tracing (simplified stroke paths for 0-9)
const DIGIT_PATHS = {
  0: [
    { type: 'ellipse', cx: 50, cy: 55, rx: 28, ry: 38, startAngle: -90 }
  ],
  1: [
    { type: 'line', points: [[38, 30], [50, 18], [50, 92]] }
  ],
  2: [
    { type: 'curve', points: [[25, 35], [25, 18], [50, 14], [75, 18], [75, 35], [25, 90], [75, 90]] }
  ],
  3: [
    { type: 'curve', points: [[25, 20], [50, 14], [72, 20], [72, 40], [50, 50], [72, 60], [72, 80], [50, 90], [25, 84]] }
  ],
  4: [
    { type: 'line', points: [[60, 18], [20, 65], [78, 65]] },
    { type: 'line', points: [[60, 18], [60, 92]] }
  ],
  5: [
    { type: 'line', points: [[68, 18], [30, 18], [28, 50]] },
    { type: 'curve', points: [[28, 50], [50, 42], [72, 55], [72, 72], [50, 90], [28, 82]] }
  ],
  6: [
    { type: 'curve', points: [[65, 20], [50, 14], [28, 30], [25, 60], [25, 75], [40, 90], [60, 90], [72, 75], [72, 62], [60, 48], [40, 48], [25, 60]] }
  ],
  7: [
    { type: 'line', points: [[25, 18], [75, 18], [45, 92]] }
  ],
  8: [
    { type: 'curve', points: [[50, 50], [28, 38], [28, 22], [50, 14], [72, 22], [72, 38], [50, 50], [25, 65], [25, 78], [50, 90], [75, 78], [75, 65], [50, 50]] }
  ],
  9: [
    { type: 'curve', points: [[72, 40], [60, 28], [40, 28], [28, 40], [28, 50], [40, 60], [60, 60], [72, 48], [72, 30], [72, 70], [55, 90]] }
  ]
};

// Number words for Primary 1
const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
];

// Shape data
const SHAPES_2D = [
  { name: 'circle', sides: 0, desc: 'round with no corners' },
  { name: 'triangle', sides: 3, desc: '3 straight sides and 3 corners' },
  { name: 'rectangle', sides: 4, desc: '4 sides with opposite sides equal' },
  { name: 'square', sides: 4, desc: '4 equal sides and 4 right angles' },
];

const SHAPES_3D = [
  { name: 'cube', faces: 6, desc: '6 square faces, all the same size', example: 'a dice' },
  { name: 'cuboid', faces: 6, desc: '6 rectangular faces', example: 'a box' },
  { name: 'cylinder', faces: 3, desc: '2 flat circular faces and 1 curved surface', example: 'a can' },
  { name: 'cone', faces: 2, desc: '1 flat circular face and 1 pointed top', example: 'an ice cream cone' },
  { name: 'sphere', faces: 1, desc: '1 curved surface, perfectly round', example: 'a ball' },
];

const SHAPE_EMOJI = {
  circle: '⚪', triangle: '🔺', rectangle: '🟦', square: '🟧',
  cube: '🎲', cuboid: '📦', cylinder: '🥫', cone: '🍦', sphere: '⚽'
};


/* --- Core Templates --- */

const Templates = {

  /* ================================================================
     PRIMARY 1: NUMBER TRACING (Interactive Canvas)
     ================================================================ */
  number_tracing() {
    const digit = randInt(0, 9);
    return {
      builderType: 'tracing',
      q: `Trace the number <span class="trace-digit-display">${digit}</span> by following the guide below!`,
      digit: digit,
      paths: DIGIT_PATHS[digit],
      a: String(digit), // answer is the digit itself (auto-checked by tracing)
    };
  },

  /* ================================================================
     PRIMARY 1: COUNTING TO 10
     ================================================================ */
  counting_10() {
    const type = randInt(1, 4);

    if (type === 1) {
      // Count emoji objects
      const count = randInt(1, 10);
      const emoji = rand(COUNT_EMOJI);
      const display = (emoji + ' ').repeat(count);
      return {
        q: `Count the objects:<br><span class="emoji-objects">${display}</span><br>How many ${emoji} are there?`,
        a: String(count),
        choices: shuffle([String(count), ...generateDistractors(count, 'small')]),
        visual: { type: 'ten_frame', params: { count: count, total: 10 } }
      };
    } else if (type === 2) {
      // Match numeral to word
      const num = randInt(1, 10);
      const word = NUMBER_WORDS[num];
      return {
        q: `What number is <strong>"${word}"</strong>?`,
        a: String(num),
        choices: shuffle([String(num), ...generateDistractors(num, 'small')]),
        visual: { type: 'number_line', params: { min: 0, max: 10, highlight: [] } }
      };
    } else if (type === 3) {
      // What comes after
      const num = randInt(0, 8);
      const ans = num + 1;
      return {
        q: `What number comes just after <strong>${num}</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), String(num), String(ans + 1), String(Math.max(0, num - 1))]),
        visual: { type: 'number_line', params: { min: 0, max: 10, highlight: [num], hops: [{ from: num, to: ans, label: '+1', color: '#10b981' }] } }
      };
    } else {
      // What comes before
      const num = randInt(2, 10);
      const ans = num - 1;
      return {
        q: `What number comes just before <strong>${num}</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), String(num), String(num + 1), String(Math.max(0, ans - 1))]),
        visual: { type: 'number_line', params: { min: 0, max: 10, highlight: [num], hops: [{ from: num, to: ans, label: '-1', color: '#ef4444' }] } }
      };
    }
  },

  /* ================================================================
     PRIMARY 1: COUNTING TO 20
     ================================================================ */
  counting_20() {
    const type = randInt(1, 4);

    if (type === 1) {
      // Ten-frame question
      const count = randInt(11, 20);
      const tens = Math.floor(count / 10);
      const ones = count % 10;
      return {
        q: `Look at the ten-frames below.<br>How many dots are filled in?`,
        a: String(count),
        choices: shuffle([String(count), ...generateDistractors(count, 'small')]),
        visual: { type: 'ten_frame', params: { count: count, total: 20 } }
      };
    } else if (type === 2) {
      // Number word matching for teens
      const num = randInt(11, 20);
      const word = NUMBER_WORDS[num];
      return {
        q: `Write the number for the word <strong>"${word}"</strong>.`,
        a: String(num),
        choices: shuffle([String(num), ...generateDistractors(num, 'small')]),
        visual: { type: 'number_line', params: { min: 10, max: 20, highlight: [] } }
      };
    } else if (type === 3) {
      // Compose tens and ones
      const tens = 1;
      const ones = randInt(0, 9);
      const ans = tens * 10 + ones;
      return {
        q: `What number is <strong>${tens} ten</strong> and <strong>${ones} ones</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + 1), String(ones), String(10 + ones + 1)]),
        visual: { type: 'base10_blocks', params: { hundreds: 0, tens: tens, ones: ones } }
      };
    } else {
      // What is between
      const num = randInt(11, 18);
      return {
        q: `What number is between <strong>${num}</strong> and <strong>${num + 2}</strong>?`,
        a: String(num + 1),
        choices: shuffle([String(num + 1), String(num), String(num + 2), String(num + 3)]),
        visual: { type: 'number_line', params: { min: 10, max: 20, highlight: [num, num + 2] } }
      };
    }
  },

  /* ================================================================
     PRIMARY 1: COUNTING TO 100
     ================================================================ */
  counting_100() {
    const type = randInt(1, 4);

    if (type === 1) {
      // Skip counting by 2s
      const start = randInt(0, 10) * 2;
      const seq = [start, start + 2, start + 4];
      const ans = start + 6;
      return {
        q: `Count by 2s: ${seq.join(', ')}, ___`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + 1), String(ans - 1), String(ans + 2)]),
        visual: { type: 'number_line', params: { min: start, max: ans + 4, highlight: [...seq, ans], hops: seq.map((v, i) => ({ from: v, to: v + 2, label: '+2', color: '#7c3aed' })) } }
      };
    } else if (type === 2) {
      // Skip counting by 5s
      const start = randInt(0, 6) * 5;
      const seq = [start, start + 5, start + 10];
      const ans = start + 15;
      return {
        q: `Count by 5s: ${seq.join(', ')}, ___`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + 5), String(ans - 5), String(ans + 1)]),
        visual: { type: 'number_line', params: { min: start, max: ans + 5, highlight: [...seq] } }
      };
    } else if (type === 3) {
      // Skip counting by 10s
      const start = randInt(1, 4) * 10;
      const seq = [start, start + 10, start + 20];
      const ans = start + 30;
      return {
        q: `Count by 10s: ${seq.join(', ')}, ___`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + 10), String(ans - 10), String(ans + 5)]),
        visual: { type: 'number_line', params: { min: start, max: ans + 10, highlight: [...seq] } }
      };
    } else {
      // Place value: tens and ones
      const tens = randInt(2, 9);
      const ones = randInt(0, 9);
      const ans = tens * 10 + ones;
      return {
        q: `What number has <strong>${tens} tens</strong> and <strong>${ones} ones</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), String(tens + ones), String(ones * 10 + tens), String(ans + 10)]),
        visual: { type: 'base10_blocks', params: { hundreds: 0, tens: tens, ones: ones } }
      };
    }
  },

  /* ================================================================
     PRIMARY 1: COMPARING & ORDERING
     ================================================================ */
  comparing_ordering() {
    const type = randInt(1, 4);

    if (type === 1) {
      // Greater or smaller 
      const a = randInt(1, 50);
      let b = randInt(1, 50);
      while (b === a) b = randInt(1, 50);
      const bigger = Math.max(a, b);
      return {
        q: `Which number is <strong>greater</strong>: <strong>${a}</strong> or <strong>${b}</strong>?`,
        a: String(bigger),
        choices: shuffle([String(a), String(b)]),
        visual: { type: 'comparison_bars', params: { values: [a, b], labels: [String(a), String(b)] } }
      };
    } else if (type === 2) {
      // Which is smallest
      const nums = [randInt(1, 30), randInt(31, 60), randInt(61, 99)];
      const smallest = Math.min(...nums);
      return {
        q: `Which is the <strong>smallest</strong> number?<br>${shuffle(nums).join(' , ')}`,
        a: String(smallest),
        choices: shuffle(nums.map(String)),
        visual: { type: 'comparison_bars', params: { values: nums, labels: nums.map(String) } }
      };
    } else if (type === 3) {
      // Arrange ascending
      const base = randInt(10, 50);
      const a = base, b = base + randInt(3, 10), c = base + randInt(12, 25);
      const shuffled = shuffle([a, b, c]);
      const sorted = [a, b, c].join(', ');
      return {
        q: `Arrange in order from <strong>smallest to greatest</strong>:<br>${shuffled.join(', ')}`,
        a: sorted,
        choices: shuffle([sorted, [c, b, a].join(', '), [b, a, c].join(', '), [a, c, b].join(', ')]),
        visual: { type: 'comparison_bars', params: { values: shuffled, labels: shuffled.map(String) } }
      };
    } else {
      // Compare with symbols
      const a = randInt(1, 40);
      let b = randInt(1, 40);
      while (b === a) b = randInt(1, 40);
      const ans = a > b ? '>' : '<';
      return {
        q: `Fill in the blank: <strong>${a}</strong> ___ <strong>${b}</strong>`,
        a: ans,
        choices: shuffle(['>', '<', '=']),
        visual: { type: 'comparison_bars', params: { values: [a, b], labels: [String(a), String(b)] } }
      };
    }
  },

  /* ================================================================
     PRIMARY 1: NUMBER BONDS
     ================================================================ */
  number_bonds() {
    const type = randInt(1, 4);

    if (type === 1) {
      // Number bonds — find the missing part to make 10
      const part = randInt(1, 9);
      const ans = 10 - part;
      return {
        q: `Number bond: <strong>${part}</strong> and <strong>___</strong> make <strong>10</strong>.`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'small')]),
        visual: { type: 'number_bond', params: { whole: 10, part1: part, part2: ans, missingPart: 'part2' } }
      };
    } else if (type === 2) {
      // Number bond — find the whole
      const a = randInt(1, 8);
      const b = randInt(1, 10 - a);
      const ans = a + b;
      return {
        q: `<strong>${a}</strong> and <strong>${b}</strong> make <strong>___</strong>.`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + 1), String(ans - 1), String(a * b)]),
        visual: { type: 'number_bond', params: { whole: ans, part1: a, part2: b, missingPart: 'whole' } }
      };
    } else if (type === 3) {
      // Number bonds to 5
      const part = randInt(0, 5);
      const ans = 5 - part;
      return {
        q: `Number bond: <strong>${part}</strong> + <strong>___</strong> = <strong>5</strong>`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'small')]),
        visual: { type: 'number_bond', params: { whole: 5, part1: part, part2: ans, missingPart: 'part2' } }
      };
    } else {
      // Decompose a number
      const total = randInt(5, 10);
      const part1 = randInt(1, total - 1);
      const part2 = total - part1;
      return {
        q: `Break <strong>${total}</strong> into two parts. If one part is <strong>${part1}</strong>, what is the other?`,
        a: String(part2),
        choices: shuffle([String(part2), String(part2 + 1), String(part2 - 1 >= 0 ? part2 - 1 : part2 + 2), String(total)]),
        visual: { type: 'number_bond', params: { whole: total, part1: part1, part2: part2, missingPart: 'part2' } }
      };
    }
  },

  /* ================================================================
     PRIMARY 1: ADDITION WITHIN 20
     ================================================================ */
  addition_within_20() {
    const type = randInt(1, 4);

    if (type === 1) {
      // Simple addition with picture story
      const a = randInt(1, 10);
      const b = randInt(1, 10 - Math.max(0, a - 10));
      const bClamped = Math.min(b, 20 - a);
      const ans = a + bClamped;
      const emoji = rand(COUNT_EMOJI);
      return {
        q: `${rand(NAMES)} has ${a} ${emoji}. ${rand(NAMES)} gives ${bClamped} more ${emoji}.<br>How many ${emoji} are there now?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'small')]),
        visual: { type: 'number_line', params: { min: 0, max: 20, highlight: [a, ans], hops: [{ from: a, to: ans, label: `+${bClamped}`, color: '#10b981' }] } }
      };
    } else if (type === 2) {
      // Vertical addition
      const a = randInt(3, 12);
      const b = randInt(2, Math.min(8, 20 - a));
      const ans = a + b;
      return {
        q: `What is <strong>${a} + ${b}</strong> = ?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'small')]),
        visual: { type: 'number_line', params: { min: 0, max: 20, highlight: [a, ans], hops: [{ from: a, to: ans, label: `+${b}`, color: '#7c3aed' }] } }
      };
    } else if (type === 3) {
      // Missing addend
      const ans = randInt(1, 9);
      const total = randInt(ans + 2, Math.min(20, ans + 10));
      const other = total - ans;
      return {
        q: `<strong>${other}</strong> + ___ = <strong>${total}</strong>`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'small')])
      };
    } else {
      // Adding zero
      const a = randInt(1, 20);
      return {
        q: `What is <strong>${a} + 0</strong> = ?`,
        a: String(a),
        choices: shuffle([String(a), String(a + 1), String(0), String(a - 1)])
      };
    }
  },

  /* ================================================================
     PRIMARY 1: SUBTRACTION WITHIN 20
     ================================================================ */
  subtraction_within_20() {
    const type = randInt(1, 4);

    if (type === 1) {
      // Take-away story
      const total = randInt(5, 20);
      const take = randInt(1, total - 1);
      const ans = total - take;
      const emoji = rand(COUNT_EMOJI);
      return {
        q: `${rand(NAMES)} has ${total} ${emoji} and gives away ${take}.<br>How many ${emoji} are left?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'small')]),
        visual: { type: 'number_line', params: { min: 0, max: 20, highlight: [total, ans], hops: [{ from: total, to: ans, label: `-${take}`, color: '#ef4444' }] } }
      };
    } else if (type === 2) {
      // Simple subtraction
      const a = randInt(5, 20);
      const b = randInt(1, a - 1);
      const ans = a - b;
      return {
        q: `What is <strong>${a} − ${b}</strong> = ?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'small')]),
        visual: { type: 'number_line', params: { min: 0, max: 20, highlight: [a, ans], hops: [{ from: a, to: ans, label: `-${b}`, color: '#ef4444' }] } }
      };
    } else if (type === 3) {
      // Find the difference
      const a = randInt(8, 20);
      const b = randInt(1, a - 2);
      const diff = a - b;
      return {
        q: `What is the difference between <strong>${a}</strong> and <strong>${b}</strong>?`,
        a: String(diff),
        choices: shuffle([String(diff), ...generateDistractors(diff, 'small')]),
        visual: { type: 'comparison_bars', params: { values: [a, b], labels: [String(a), String(b)] } }
      };
    } else {
      // Missing subtrahend
      const total = randInt(8, 20);
      const ans = randInt(1, total - 1);
      const result = total - ans;
      return {
        q: `<strong>${total}</strong> − ___ = <strong>${result}</strong>`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'small')]),
        visual: { type: 'number_line', params: { min: 0, max: 20, highlight: [total, result] } }
      };
    }
  },

  /* ================================================================
     PRIMARY 1: ADDITION & SUBTRACTION WITHIN 40
     ================================================================ */
  add_sub_within_40() {
    const isAdd = rand([true, false]);
    const type = randInt(1, 3);

    if (isAdd) {
      const a = randInt(10, 25);
      const b = randInt(5, Math.min(15, 40 - a));
      const ans = a + b;
      
      if (type === 1) {
        return {
          q: `What is <strong>${a} + ${b}</strong> = ?`,
          a: String(ans),
          choices: shuffle([String(ans), ...generateDistractors(ans, 'small')])
        };
      } else if (type === 2) {
        const emoji = rand(COUNT_EMOJI);
        return {
          q: `There are ${a} ${emoji} in Box A and ${b} ${emoji} in Box B.<br>How many ${emoji} altogether?`,
          a: String(ans),
          choices: shuffle([String(ans), ...generateDistractors(ans, 'small')])
        };
      } else {
        // Missing addend
        return {
          q: `${a} + ___ = <strong>${ans}</strong>`,
          a: String(b),
          choices: shuffle([String(b), ...generateDistractors(b, 'small')])
        };
      }
    } else {
      const a = randInt(20, 40);
      const b = randInt(5, a - 5);
      const ans = a - b;

      if (type === 1) {
        return {
          q: `What is <strong>${a} − ${b}</strong> = ?`,
          a: String(ans),
          choices: shuffle([String(ans), ...generateDistractors(ans, 'small')])
        };
      } else if (type === 2) {
        return {
          q: `${rand(NAMES)} had ${a} ${rand(ITEMS)}. ${randInt(1, 1) ? 'He' : 'She'} used ${b}. How many are left?`,
          a: String(ans),
          choices: shuffle([String(ans), ...generateDistractors(ans, 'small')])
        };
      } else {
        return {
          q: `<strong>${a}</strong> − ___ = <strong>${ans}</strong>`,
          a: String(b),
          choices: shuffle([String(b), ...generateDistractors(b, 'small')])
        };
      }
    }
  },

  /* ================================================================
     PRIMARY 1: LENGTH & MASS (Measurement)
     ================================================================ */
  length_mass() {
    const type = randInt(1, 4);
    const objectsLong = ['pencil', 'ribbon', 'straw', 'stick', 'rope', 'ruler'];
    const objectsHeavy = ['watermelon', 'bag of rice', 'book', 'chair', 'box'];
    const objectsLight = ['feather', 'leaf', 'paper clip', 'marble', 'coin'];

    if (type === 1) {
      // Which is longer/taller?
      const a = rand(objectsLong);
      let b = rand(objectsLong);
      while (a === b) b = rand(objectsLong);
      const aLen = randInt(5, 20);
      const bLen = randInt(5, 20);
      while (aLen === bLen) { /* force different */ }
      const longer = aLen > bLen ? a : b;
      return {
        q: `A ${a} is ${aLen} cm long. A ${b} is ${bLen} cm long.<br>Which is <strong>longer</strong>?`,
        a: longer,
        choices: shuffle([a, b])
      };
    } else if (type === 2) {
      // Which is heavier?
      const heavy = rand(objectsHeavy);
      const light = rand(objectsLight);
      return {
        q: `Which is <strong>heavier</strong>: a <strong>${heavy}</strong> or a <strong>${light}</strong>?`,
        a: heavy,
        choices: shuffle([heavy, light])
      };
    } else if (type === 3) {
      // Ordering by length
      const lengths = [randInt(2, 8), randInt(10, 16), randInt(18, 25)];
      const shuffledL = shuffle(lengths);
      const shortest = Math.min(...lengths);
      return {
        q: `Three ribbons are ${shuffledL[0]} cm, ${shuffledL[1]} cm, and ${shuffledL[2]} cm long.<br>Which is the <strong>shortest</strong>?`,
        a: `${shortest} cm`,
        choices: shuffle(shuffledL.map(l => `${l} cm`))
      };
    } else {
      // Compare units
      const obj = rand(objectsLong);
      const units = randInt(3, 15);
      return {
        q: `A ${obj} is about <strong>${units} paper clips</strong> long.<br>Another ${obj} is about <strong>${units + randInt(2, 5)} paper clips</strong> long.<br>Which ${obj} is <strong>shorter</strong>?`,
        a: `The first ${obj}`,
        choices: shuffle([`The first ${obj}`, `The second ${obj}`])
      };
    }
  },

  /* ================================================================
     PRIMARY 1: TELLING TIME
     ================================================================ */
  telling_time_p1() {
    const type = randInt(1, 3);

    if (type === 1) {
      // O'clock
      const hour = randInt(1, 12);
      const ans = `${hour} o'clock`;
      // Build a text-based clock representation
      return {
        q: `The short hand points to <strong>${hour}</strong> and the long hand points to <strong>12</strong>.<br>What time is it?`,
        a: ans,
        choices: shuffle([ans, `${hour === 12 ? 1 : hour + 1} o'clock`, `half past ${hour}`, `${hour === 1 ? 12 : hour - 1} o'clock`]),
        visual: { type: 'clock', params: { hour: hour, minute: 0 } }
      };
    } else if (type === 2) {
      // Half past
      const hour = randInt(1, 12);
      const ans = `half past ${hour}`;
      return {
        q: `The short hand is between <strong>${hour}</strong> and <strong>${hour === 12 ? 1 : hour + 1}</strong>. The long hand points to <strong>6</strong>.<br>What time is it?`,
        a: ans,
        choices: shuffle([ans, `${hour} o'clock`, `half past ${hour === 12 ? 1 : hour + 1}`, `${hour === 12 ? 1 : hour + 1} o'clock`]),
        visual: { type: 'clock', params: { hour: hour, minute: 30 } }
      };
    } else {
      // Match time to activity
      const activities = [
        { time: '7 o\'clock', activity: 'wake up for school' },
        { time: '12 o\'clock', activity: 'eat lunch' },
        { time: '3 o\'clock', activity: 'school ends' },
        { time: '8 o\'clock', activity: 'go to bed' },
        { time: 'half past 6', activity: 'eat dinner' },
      ];
      const item = rand(activities);
      return {
        q: `${rand(NAMES)} usually ${item.activity}. What time might that be?`,
        a: item.time,
        choices: shuffle(activities.slice(0, 4).map(a => a.time))
      };
    }
  },

  /* ================================================================
     PRIMARY 1: 2D & 3D SHAPES
     ================================================================ */
  shapes_2d_3d() {
    const type = randInt(1, 4);

    if (type === 1) {
      // Identify 2D shape by description
      const shape = rand(SHAPES_2D);
      return {
        q: `I am a shape that is ${shape.desc}.<br>What am I?`,
        a: shape.name,
        choices: shuffle(SHAPES_2D.map(s => s.name)),
        visual: { type: 'shape', params: { name: shape.name, showLabels: true } }
      };
    } else if (type === 2) {
      // Count sides
      const shape = rand(SHAPES_2D.filter(s => s.sides > 0));
      return {
        q: `How many sides does a <strong>${shape.name}</strong> have?`,
        a: String(shape.sides),
        choices: shuffle([String(shape.sides), '2', '5', String(shape.sides + 1)]),
        visual: { type: 'shape', params: { name: shape.name, showLabels: true } }
      };
    } else if (type === 3) {
      // 3D shape identification
      const shape = rand(SHAPES_3D);
      return {
        q: `This 3D shape looks like <strong>${shape.example}</strong>. It has ${shape.desc}.<br>What shape is it?`,
        a: shape.name,
        choices: shuffle(SHAPES_3D.slice(0, 4).map(s => s.name)),
        visual: { type: 'shape', params: { name: shape.name, showLabels: false } }
      };
    } else {
      // Match shape to real object
      const pairs = [
        { shape: 'sphere', obj: 'a ball' },
        { shape: 'cube', obj: 'a dice' },
        { shape: 'cylinder', obj: 'a tin can' },
        { shape: 'cone', obj: 'an ice cream cone' },
        { shape: 'cuboid', obj: 'a cereal box' },
      ];
      const pair = rand(pairs);
      return {
        q: `What shape is <strong>${pair.obj}</strong>?`,
        a: pair.shape,
        choices: shuffle(pairs.slice(0, 4).map(p => p.shape)),
        visual: { type: 'shape', params: { name: pair.shape, showLabels: false } }
      };
    }
  },

  /* ================================================================
     PRIMARY 1: PICTURE GRAPHS
     ================================================================ */
  picture_graphs() {
    const type = randInt(1, 3);
    const fruits = ['🍎', '🍊', '🍌', '🍇'];
    const fruitNames = ['Apples', 'Oranges', 'Bananas', 'Grapes'];
    const counts = [randInt(1, 6), randInt(1, 6), randInt(1, 6), randInt(1, 6)];

    // Build a text-based picture graph
    let graph = '<div class="picture-graph">';
    for (let i = 0; i < 4; i++) {
      graph += `<div class="graph-row"><span class="graph-label">${fruitNames[i]}</span><span class="graph-icons">${fruits[i].repeat(counts[i])}</span></div>`;
    }
    graph += '</div>';

    if (type === 1) {
      // How many of X?
      const idx = randInt(0, 3);
      return {
        q: `Look at the picture graph:<br>${graph}<br>How many <strong>${fruitNames[idx]}</strong> are there?`,
        a: String(counts[idx]),
        choices: shuffle([String(counts[idx]), ...generateDistractors(counts[idx], 'small')])
      };
    } else if (type === 2) {
      // Which has the most?
      const maxVal = Math.max(...counts);
      const maxIdx = counts.indexOf(maxVal);
      return {
        q: `Look at the picture graph:<br>${graph}<br>Which fruit has the <strong>most</strong>?`,
        a: fruitNames[maxIdx],
        choices: shuffle(fruitNames.slice())
      };
    } else {
      // How many more X than Y?
      const i = 0, j = 1;
      const diff = Math.abs(counts[i] - counts[j]);
      const more = counts[i] > counts[j] ? fruitNames[i] : fruitNames[j];
      const fewer = counts[i] > counts[j] ? fruitNames[j] : fruitNames[i];
      return {
        q: `Look at the picture graph:<br>${graph}<br>How many more <strong>${more}</strong> than <strong>${fewer}</strong>?`,
        a: String(diff),
        choices: shuffle([String(diff), ...generateDistractors(diff, 'small')])
      };
    }
  },

  /* ================================================================
     PRIMARY 1: PATTERNS
     ================================================================ */
  patterns() {
    const type = randInt(1, 4);

    if (type === 1) {
      // Number pattern +1
      const start = randInt(1, 15);
      const seq = [start, start + 1, start + 2];
      const ans = start + 3;
      return {
        q: `What comes next? <strong>${seq.join(', ')}, ___</strong>`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + 1), String(ans - 1), String(start)]),
        visual: { type: 'number_line', params: { min: start, max: ans + 2, highlight: seq } }
      };
    } else if (type === 2) {
      // Number pattern +2
      const start = randInt(1, 10);
      const seq = [start, start + 2, start + 4];
      const ans = start + 6;
      return {
        q: `What comes next? <strong>${seq.join(', ')}, ___</strong>`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + 1), String(ans + 2), String(ans - 2)]),
        visual: { type: 'number_line', params: { min: start, max: ans + 2, highlight: seq, hops: seq.map(v => ({ from: v, to: v + 2, label: '+2' })) } }
      };
    } else if (type === 3) {
      // Shape pattern
      const patternSets = [
        { pattern: ['🔴', '🔵', '🔴', '🔵', '🔴'], ans: '🔵', options: ['🔵', '🔴', '🟢', '🟡'] },
        { pattern: ['⭐', '⭐', '🌙', '⭐', '⭐'], ans: '🌙', options: ['🌙', '⭐', '☀️', '🌟'] },
        { pattern: ['🔺', '🔺', '⬜', '🔺', '🔺'], ans: '⬜', options: ['⬜', '🔺', '⚪', '🟦'] },
        { pattern: ['🟢', '🟡', '🟢', '🟡', '🟢'], ans: '🟡', options: ['🟡', '🟢', '🔵', '🔴'] },
      ];
      const p = rand(patternSets);
      return {
        q: `What comes next in the pattern?`,
        a: p.ans,
        choices: shuffle(p.options),
        visual: { type: 'pattern_strip', params: { items: p.pattern, highlightLast: true } }
      };
    } else {
      // Decreasing pattern
      const start = randInt(15, 25);
      const seq = [start, start - 1, start - 2];
      const ans = start - 3;
      return {
        q: `What comes next? <strong>${seq.join(', ')}, ___</strong>`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + 1), String(ans - 1), String(start)]),
        visual: { type: 'number_line', params: { min: ans - 2, max: start, highlight: seq } }
      };
    }
  },


  /* ================================================================
     GRADE 3 TEMPLATES — Singapore Math Level 2A & 2B
     ================================================================ */

  /* Unit 1: Numbers to 1,000 */
  g3_numbers_1000() {
    const type = randInt(1, 4);
    if (type === 1) {
      // Place value
      const num = randInt(100, 999);
      const strNum = String(num);
      const pos = randInt(0, 2);
      const posName = ['hundreds', 'tens', 'ones'][pos];
      const digit = parseInt(strNum[pos]);
      const ans = digit * Math.pow(10, 2 - pos);
      const choices = new Set([String(ans), String(digit), String(digit * 10), String(digit * 100)]);
      while (choices.size < 4) choices.add(String(randInt(1, 9) * 10));
      return {
        q: `In the number <strong>${num}</strong>, what is the value of the digit <strong>${digit}</strong> in the ${posName} place?`,
        a: String(ans),
        choices: shuffle(Array.from(choices).slice(0, 4)),
        visual: { type: 'place_value_chart', params: { number: num, columns: ['H', 'T', 'O'] } }
      };
    } else if (type === 2) {
      // Expanded form
      const h = randInt(1, 9) * 100;
      const t = randInt(0, 9) * 10;
      const o = randInt(0, 9);
      const ans = h + t + o;
      return {
        q: `What number is <strong>${h} + ${t} + ${o}</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'number')])
      };
    } else if (type === 3) {
      // Compare two numbers
      const a = randInt(100, 999);
      let b = randInt(100, 999);
      while (a === b) b = randInt(100, 999);
      const bigger = Math.max(a, b);
      return {
        q: `Which is greater: <strong>${a}</strong> or <strong>${b}</strong>?`,
        a: String(bigger),
        choices: shuffle([String(a), String(b)])
      };
    } else {
      // 10/100 more or less
      const num = randInt(100, 800);
      const change = rand([10, 100]);
      const more = rand([true, false]);
      const ans = more ? num + change : num - change;
      return {
        q: `What is <strong>${change} ${more ? 'more' : 'less'}</strong> than <strong>${num}</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'number')])
      };
    }
  },

  /* Unit 2: Addition within 1,000 */
  g3_addition_1000() {
    const type = randInt(1, 3);
    if (type === 1) {
      // Without regrouping
      const a = randInt(100, 500);
      const b = randInt(100, 499 - (a % 10 > 4 ? 100 : 0));
      const ans = a + b;
      return {
        q: `What is <strong>${a} + ${b}</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'addition')])
      };
    } else if (type === 2) {
      // With regrouping
      const a = randInt(150, 600);
      const b = randInt(150, 399);
      const ans = a + b;
      return {
        q: `Calculate: <strong>${a} + ${b}</strong> = ?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'addition')])
      };
    } else {
      // Word problem
      const a = randInt(200, 500);
      const b = randInt(100, 400);
      const ans = a + b;
      const name = rand(NAMES);
      return {
        q: `${name} collected ${a} stickers. Then ${name} got ${b} more stickers. How many stickers does ${name} have now?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'addition')])
      };
    }
  },

  /* Unit 2: Subtraction within 1,000 */
  g3_subtraction_1000() {
    const type = randInt(1, 3);
    if (type === 1) {
      // Without regrouping
      const a = randInt(300, 999);
      const b = randInt(100, a - 100);
      const ans = a - b;
      return {
        q: `What is <strong>${a} − ${b}</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'subtraction')])
      };
    } else if (type === 2) {
      // From a round number
      const a = rand([400, 500, 600, 700, 800, 900, 1000]);
      const b = randInt(100, a - 50);
      const ans = a - b;
      return {
        q: `Calculate: <strong>${a} − ${b}</strong> = ?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'subtraction')])
      };
    } else {
      // Word problem
      const total = randInt(400, 900);
      const spent = randInt(100, total - 50);
      const ans = total - spent;
      return {
        q: `A shopkeeper had ${total} ${rand(ITEMS)}. He sold ${spent}. How many are left?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'subtraction')])
      };
    }
  },

  /* Unit 3: Bar Models — Add & Subtract */
  g3_bar_model_addsub() {
    const type = randInt(1, 3);
    if (type === 1) {
      // Part-whole addition
      const a = randInt(100, 500);
      const b = randInt(100, 400);
      const total = a + b;
      return {
        builderType: 'part-whole',
        q: `${rand(NAMES)} has ${a} ${rand(ITEMS)} and ${rand(NAMES)} has ${b} ${rand(ITEMS)}. How many do they have altogether?`,
        blocks: [a, b],
        a: String(total)
      };
    } else if (type === 2) {
      // Comparison
      const a = randInt(200, 600);
      const diff = randInt(50, 200);
      const ans = a - diff;
      return {
        builderType: 'part-whole',
        q: `${rand(NAMES)} has ${a} ${rand(ITEMS)}. ${rand(NAMES)} has ${diff} fewer. How many does the second person have?`,
        blocks: [a, diff],
        a: String(ans)
      };
    } else {
      // Three-part word problem
      const a = randInt(100, 300);
      const b = randInt(100, 250);
      const c = randInt(50, 200);
      const total = a + b + c;
      return {
        builderType: 'part-whole',
        q: `A shop sold ${a} items on Monday, ${b} on Tuesday, and ${c} on Wednesday. How many items were sold altogether?`,
        blocks: [a, b, c],
        a: String(total)
      };
    }
  },

  /* Units 4-5: Multiplication by 2, 3, 4 */
  g3_multiply_234() {
    const type = randInt(1, 4);
    const table = rand([2, 3, 4]);
    if (type === 1) {
      // Basic times table
      const b = randInt(1, 10);
      const ans = table * b;
      return {
        q: `What is <strong>${table} × ${b}</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'multiplication')]),
        visual: { type: 'array_dots', params: { rows: table, cols: b } }
      };
    } else if (type === 2) {
      // Groups of
      const groups = randInt(2, 10);
      const perGroup = table;
      const ans = groups * perGroup;
      const emoji = rand(COUNT_EMOJI);
      return {
        q: `There are <strong>${groups} groups</strong> of <strong>${perGroup} ${emoji}</strong>.<br>How many ${emoji} altogether?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'multiplication')])
      };
    } else if (type === 3) {
      // Word problem
      const plates = randInt(3, 10);
      const each = table;
      const ans = plates * each;
      const item = rand(ITEMS);
      return {
        q: `There are ${each} ${item} on each of ${plates} plates. How many ${item} are there in all?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'multiplication')])
      };
    } else {
      // Missing factor
      const b = randInt(2, 10);
      const ans = table * b;
      return {
        q: `<strong>${table} × ___ = ${ans}</strong>. What is the missing number?`,
        a: String(b),
        choices: shuffle([String(b), ...generateDistractors(b, 'small')])
      };
    }
  },

  /* Unit 6: Multiplication by 5, 10 */
  g3_multiply_510() {
    const type = randInt(1, 4);
    const table = rand([5, 10]);
    if (type === 1) {
      const b = randInt(1, 10);
      const ans = table * b;
      return {
        q: `What is <strong>${table} × ${b}</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'multiplication')])
      };
    } else if (type === 2) {
      // Skip counting
      const start = 0;
      const seq = [start, table, table * 2, table * 3];
      const ans = table * 4;
      return {
        q: `Count by ${table}s: ${seq.join(', ')}, ___`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + table), String(ans - table), String(ans + 1)])
      };
    } else if (type === 3) {
      // Word problem
      const count = randInt(2, 10);
      const price = table;
      const ans = count * price;
      return {
        q: `Each ${rand(OBJECTS)} costs $${price}. How much do ${count} of them cost?`,
        a: `$${ans}`,
        choices: shuffle([`$${ans}`, `$${ans + price}`, `$${ans - price}`, `$${count + price}`])
      };
    } else {
      // Commutative property
      const a = randInt(2, 10);
      const ans = a * table;
      return {
        q: `<strong>${a} × ${table}</strong> is the same as <strong>${table} × ___</strong>. What is the product?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'multiplication')])
      };
    }
  },

  /* Unit 4: Division Basics */
  g3_division() {
    const type = randInt(1, 4);
    if (type === 1) {
      // Basic division
      const divisor = rand([2, 3, 4, 5, 10]);
      const quotient = randInt(1, 10);
      const dividend = divisor * quotient;
      return {
        q: `What is <strong>${dividend} ÷ ${divisor}</strong>?`,
        a: String(quotient),
        choices: shuffle([String(quotient), ...generateDistractors(quotient, 'small')])
      };
    } else if (type === 2) {
      // Sharing equally
      const total = rand([12, 15, 16, 18, 20, 24, 30]);
      const groups = rand([2, 3, 4, 5, 6]);
      if (total % groups !== 0) {
        const ans = Math.floor(total / groups);
        return {
          q: `Share <strong>${groups * (ans)}</strong> ${rand(ITEMS)} equally among <strong>${groups}</strong> children. How many does each child get?`,
          a: String(ans),
          choices: shuffle([String(ans), ...generateDistractors(ans, 'small')])
        };
      }
      const ans = total / groups;
      return {
        q: `Share <strong>${total}</strong> ${rand(ITEMS)} equally among <strong>${groups}</strong> children. How many does each child get?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'small')])
      };
    } else if (type === 3) {
      // Grouping
      const perGroup = rand([2, 3, 4, 5]);
      const groups = randInt(2, 8);
      const total = perGroup * groups;
      return {
        q: `${total} ${rand(ITEMS)} are put into groups of ${perGroup}. How many groups are there?`,
        a: String(groups),
        choices: shuffle([String(groups), ...generateDistractors(groups, 'small')])
      };
    } else {
      // Connection to multiplication
      const a = rand([2, 3, 4, 5, 10]);
      const b = randInt(2, 10);
      const product = a * b;
      return {
        q: `If <strong>${a} × ${b} = ${product}</strong>, then <strong>${product} ÷ ${a}</strong> = ?`,
        a: String(b),
        choices: shuffle([String(b), String(a), String(product), String(b + 1)])
      };
    }
  },

  /* Unit 7: Bar Models — Multiply & Divide */
  g3_bar_model_muldiv() {
    const type = randInt(1, 3);
    if (type === 1) {
      // Multiplication model
      const groups = randInt(2, 5);
      const each = randInt(20, 100);
      const total = groups * each;
      return {
        builderType: 'part-whole',
        q: `Mrs. ${rand(NAMES)} bought ${groups} identical packages. Each package has ${each} items. How many items did she buy in all?`,
        blocks: Array(groups).fill(each),
        a: String(total)
      };
    } else if (type === 2) {
      // Division model
      const parts = rand([2, 3, 4, 5]);
      const each = randInt(10, 50);
      const total = parts * each;
      return {
        builderType: 'part-whole',
        q: `${total} ${rand(ITEMS)} are shared equally among ${parts} friends. How many does each friend get?`,
        blocks: [total],
        a: String(each)
      };
    } else {
      // Multiples word problem
      const baseVal = randInt(30, 100);
      const times = randInt(2, 4);
      const total = baseVal * times;
      return {
        builderType: 'part-whole',
        q: `${rand(NAMES)} has ${baseVal} ${rand(ITEMS)}. ${rand(NAMES)} has ${times} times as many. How many does the second person have?`,
        blocks: Array(times).fill(baseVal),
        a: String(total)
      };
    }
  },

  /* Unit 10: Mental Calculations */
  g3_mental_calc() {
    const type = randInt(1, 4);
    if (type === 1) {
      // Add ones mentally
      const a = randInt(100, 900);
      const b = randInt(1, 9);
      const ans = a + b;
      return {
        q: `Add mentally: <strong>${a} + ${b}</strong> = ?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'number')])
      };
    } else if (type === 2) {
      // Add tens mentally
      const a = randInt(100, 900);
      const b = randInt(1, 9) * 10;
      const ans = a + b;
      return {
        q: `Add mentally: <strong>${a} + ${b}</strong> = ?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'number')])
      };
    } else if (type === 3) {
      // Subtract ones
      const a = randInt(200, 950);
      const b = randInt(1, 9);
      const ans = a - b;
      return {
        q: `Subtract mentally: <strong>${a} − ${b}</strong> = ?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'number')])
      };
    } else {
      // Add hundreds
      const a = randInt(100, 700);
      const b = rand([100, 200, 300, 400, 500]);
      const ans = a + b;
      return {
        q: `Add mentally: <strong>${a} + ${b}</strong> = ?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'number')])
      };
    }
  },

  /* Unit 11: Money */
  g3_money() {
    const type = randInt(1, 4);
    if (type === 1) {
      // Write amount
      const d = randInt(1, 99);
      const c = randInt(5, 95);
      const ans = `$${d}.${c < 10 ? '0' + c : c}`;
      return {
        q: `Write in numerals: <strong>${d} dollars and ${c} cents</strong>.`,
        a: ans,
        choices: shuffle([ans, `$${c}.${d < 10 ? '0' + d : d}`, `$${d + 1}.00`, `$${d}.${c + 1 < 100 ? (c + 1 < 10 ? '0' + (c+1) : c+1) : '00'}`])
      };
    } else if (type === 2) {
      // Convert cents to dollars
      const cents = randInt(100, 5000);
      const d = Math.floor(cents / 100);
      const c = cents % 100;
      const ans = `$${d}.${c < 10 ? '0' + c : c}`;
      return {
        q: `Convert <strong>${cents}¢</strong> to dollars.`,
        a: ans,
        choices: shuffle([ans, `$${cents}`, `$${d}.${c}0`, `$${d + 1}.${c < 10 ? '0' + c : c}`])
      };
    } else if (type === 3) {
      // Word problem — total cost
      const price = randInt(2, 10);
      const qty = randInt(2, 6);
      const ans = price * qty;
      return {
        q: `Each book costs $${price}. ${rand(NAMES)} buys ${qty} books. How much does ${rand(NAMES)} pay?`,
        a: `$${ans}`,
        choices: shuffle([`$${ans}`, `$${ans + price}`, `$${price + qty}`, `$${ans - price}`]),
        visual: { type: 'money', params: { dollars: ans, cents: 0 } }
      };
    } else {
      // Making change
      const paid = rand([50, 100]);
      const cost = randInt(10, paid - 5);
      const change = paid - cost;
      return {
        q: `${rand(NAMES)} buys something for <strong>$${cost}</strong> and pays with a <strong>$${paid}</strong> note. How much change?`,
        a: `$${change}`,
        choices: shuffle([`$${change}`, `$${change + 5}`, `$${change - 5 > 0 ? change - 5 : change + 10}`, `$${paid}`])
      };
    }
  },

  /* Unit 12: Fractions */
  g3_fractions() {
    const type = randInt(1, 4);
    if (type === 1) {
      // Name the fraction
      const den = rand([2, 3, 4, 5, 6, 7, 8]);
      const num = randInt(1, den - 1);
      return {
        q: `What fraction is <strong>${num}</strong> out of <strong>${den}</strong> equal parts?`,
        a: `${num}/${den}`,
        choices: shuffle([`${num}/${den}`, `${den}/${num}`, `${num + 1}/${den}`, `${num}/${den + 1}`]),
        visual: { type: 'fraction_circle', params: { numerator: num, denominator: den } }
      };
    } else if (type === 2) {
      // Compare fractions (same denominator)
      const den = rand([3, 4, 5, 6, 8]);
      const a = randInt(1, den - 2);
      const b = a + randInt(1, den - a - 1);
      const bigger = `${b}/${den}`;
      return {
        q: `Which is greater: <strong>${a}/${den}</strong> or <strong>${b}/${den}</strong>?`,
        a: bigger,
        choices: shuffle([`${a}/${den}`, `${b}/${den}`]),
        visual: { type: 'fraction_circle', params: { numerator: a, denominator: den } }
      };
    } else if (type === 3) {
      // Ordering fractions
      const den = rand([4, 5, 6, 8]);
      const fracs = shuffle([1, 2, den - 1]);
      const sorted = [...fracs].sort((x, y) => x - y).map(n => `${n}/${den}`).join(', ');
      return {
        q: `Arrange from <strong>smallest to greatest</strong>:<br>${fracs.map(n => `${n}/${den}`).join(', ')}`,
        a: sorted,
        choices: shuffle([sorted, [...fracs].sort((x, y) => y - x).map(n => `${n}/${den}`).join(', '), fracs.map(n => `${n}/${den}`).join(', ')]),
        visual: { type: 'fraction_circle', params: { numerator: fracs[0], denominator: den } }
      };
    } else {
      // Fraction of a set
      const den = rand([2, 3, 4, 5]);
      const total = den * randInt(2, 6);
      const num = 1;
      const ans = total / den;
      return {
        q: `What is <strong>1/${den}</strong> of <strong>${total}</strong>?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'small')]),
        visual: { type: 'fraction_circle', params: { numerator: 1, denominator: den } }
      };
    }
  },

  /* Unit 13: Time */
  g3_time() {
    const type = randInt(1, 4);
    if (type === 1) {
      // Read time (5-minute intervals)
      const hour = randInt(1, 12);
      const min = rand([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
      const strMin = min < 10 ? '0' + min : String(min);
      const ans = `${hour}:${strMin}`;
      return {
        q: `Look at the clock. What time is it?`,
        a: ans,
        choices: shuffle([ans, `${hour}:${min === 0 ? '30' : '00'}`, `${hour + 1 > 12 ? 1 : hour + 1}:${strMin}`, `${hour}:${(min + 5) % 60 < 10 ? '0' + ((min + 5) % 60) : (min + 5) % 60}`]),
        visual: { type: 'clock', params: { hour: hour, minute: min } }
      };
    } else if (type === 2) {
      // a.m. or p.m.
      const activities = [
        { activity: 'eating breakfast', time: 'a.m.' },
        { activity: 'going to school', time: 'a.m.' },
        { activity: 'eating lunch', time: 'p.m.' },
        { activity: 'watching stars', time: 'p.m.' },
        { activity: 'having dinner', time: 'p.m.' },
        { activity: 'sleeping at night', time: 'p.m.' },
      ];
      const act = rand(activities);
      return {
        q: `${rand(NAMES)} is ${act.activity}. Is it <strong>a.m.</strong> or <strong>p.m.</strong>?`,
        a: act.time,
        choices: ['a.m.', 'p.m.']
      };
    } else if (type === 3) {
      // Duration
      const startH = randInt(1, 10);
      const duration = randInt(1, 4);
      const endH = startH + duration;
      return {
        q: `A movie starts at <strong>${startH}:00 p.m.</strong> and ends at <strong>${endH}:00 p.m.</strong> How long is the movie?`,
        a: `${duration} hours`,
        choices: shuffle([`${duration} hours`, `${duration + 1} hours`, `${duration - 1 > 0 ? duration - 1 : duration + 2} hours`, `${endH} hours`])
      };
    } else {
      // Days of the week
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const idx = randInt(0, 5);
      const ans = days[idx + 1];
      return {
        q: `What day comes after <strong>${days[idx]}</strong>?`,
        a: ans,
        choices: shuffle([ans, days[(idx + 2) % 7], days[idx === 0 ? 6 : idx - 1], days[(idx + 3) % 7]])
      };
    }
  },

  /* Units 8-9: Length & Mass */
  g3_length_mass() {
    const type = randInt(1, 4);
    if (type === 1) {
      // Add lengths
      const a = randInt(10, 200);
      const b = randInt(10, 200);
      const ans = a + b;
      return {
        q: `A ribbon is <strong>${a} cm</strong> long. Another ribbon is <strong>${b} cm</strong> long. What is the total length?`,
        a: `${ans} cm`,
        choices: shuffle([`${ans} cm`, `${ans + 10} cm`, `${Math.abs(a - b)} cm`, `${ans - 10} cm`]),
        visual: { type: 'ruler', params: { lengths: [a, b], unit: 'cm', maxVal: Math.max(a, b) + 20 } }
      };
    } else if (type === 2) {
      // Compare mass
      const a = randInt(5, 50);
      const b = randInt(5, 50);
      while (a === b) { /* avoid equal */ }
      const heavier = Math.max(a, b);
      return {
        q: `Box A has a mass of <strong>${a} kg</strong>. Box B has a mass of <strong>${b} kg</strong>. Which box is heavier?`,
        a: a > b ? 'Box A' : 'Box B',
        choices: shuffle(['Box A', 'Box B']),
        visual: { type: 'balance', params: { left: `${a} kg`, right: `${b} kg`, leftVal: a, rightVal: b } }
      };
    } else if (type === 3) {
      // Word problem with mass
      const total = randInt(20, 100);
      const part = randInt(5, total - 5);
      const ans = total - part;
      return {
        q: `A bag of flour has a mass of <strong>${total} kg</strong>. ${rand(NAMES)} uses <strong>${part} kg</strong>. How much flour is left?`,
        a: `${ans} kg`,
        choices: shuffle([`${ans} kg`, `${total + part} kg`, `${ans + 5} kg`, `${part} kg`])
      };
    } else {
      // Multiplication with mass
      const each = randInt(2, 10);
      const qty = randInt(2, 5);
      const ans = each * qty;
      return {
        q: `Each package has a mass of <strong>${each} kg</strong>. What is the mass of <strong>${qty}</strong> packages?`,
        a: `${ans} kg`,
        choices: shuffle([`${ans} kg`, `${ans + each} kg`, `${each + qty} kg`, `${ans - each} kg`])
      };
    }
  },

  /* Unit 14: Volume & Capacity */
  g3_volume() {
    const type = randInt(1, 3);
    if (type === 1) {
      // Compare volumes
      const a = randInt(100, 900);
      const b = randInt(100, 900);
      const more = Math.max(a, b);
      return {
        q: `Container A holds <strong>${a} ml</strong>. Container B holds <strong>${b} ml</strong>. Which holds <strong>more</strong>?`,
        a: a > b ? 'Container A' : 'Container B',
        choices: shuffle(['Container A', 'Container B'])
      };
    } else if (type === 2) {
      // Add volumes
      const a = randInt(100, 500);
      const b = randInt(100, 500);
      const ans = a + b;
      return {
        q: `A jug has <strong>${a} ml</strong> of water. <strong>${b} ml</strong> more water is added. How much water is in the jug now?`,
        a: `${ans} ml`,
        choices: shuffle([`${ans} ml`, `${ans + 100} ml`, `${Math.abs(a - b)} ml`, `${ans - 100} ml`])
      };
    } else {
      // Convert litres
      const litres = randInt(1, 5);
      const ans = litres * 1000;
      return {
        q: `How many <strong>millilitres</strong> are in <strong>${litres} litres</strong>?`,
        a: `${ans} ml`,
        choices: shuffle([`${ans} ml`, `${litres * 100} ml`, `${litres * 10} ml`, `${ans + 500} ml`])
      };
    }
  },

  /* Unit 15: Picture Graphs */
  g3_graphs() {
    const categories = ['Red', 'Blue', 'Green', 'Yellow'];
    const emoji = ['🔴', '🔵', '🟢', '🟡'];
    const counts = [randInt(1, 8), randInt(1, 8), randInt(1, 8), randInt(1, 8)];
    let graph = '<div class="picture-graph">';
    for (let i = 0; i < 4; i++) {
      graph += `<div class="graph-row"><span class="graph-label">${categories[i]}</span><span class="graph-icons">${emoji[i].repeat(counts[i])}</span></div>`;
    }
    graph += '</div>';

    const type = randInt(1, 3);
    if (type === 1) {
      const idx = randInt(0, 3);
      return {
        q: `Look at the graph:<br>${graph}<br>How many <strong>${categories[idx]}</strong> items?`,
        a: String(counts[idx]),
        choices: shuffle([String(counts[idx]), ...generateDistractors(counts[idx], 'small')])
      };
    } else if (type === 2) {
      const maxVal = Math.max(...counts);
      const maxIdx = counts.indexOf(maxVal);
      return {
        q: `Look at the graph:<br>${graph}<br>Which colour has the <strong>most</strong>?`,
        a: categories[maxIdx],
        choices: shuffle(categories.slice())
      };
    } else {
      const total = counts.reduce((s, c) => s + c, 0);
      return {
        q: `Look at the graph:<br>${graph}<br>How many items are there in <strong>total</strong>?`,
        a: String(total),
        choices: shuffle([String(total), ...generateDistractors(total, 'small')])
      };
    }
  },

  /* Unit 16-17: Lines, Surfaces & Shapes */
  g3_shapes() {
    const type = randInt(1, 4);
    if (type === 1) {
      // Flat vs curved
      const items = [
        { obj: 'a dice', surface: 'flat' },
        { obj: 'an orange', surface: 'curved' },
        { obj: 'a box', surface: 'flat' },
        { obj: 'a ball', surface: 'curved' },
        { obj: 'a can', surface: 'both flat and curved' },
        { obj: 'a cone', surface: 'both flat and curved' },
      ];
      const item = rand(items);
      return {
        q: `Does <strong>${item.obj}</strong> have flat surfaces, curved surfaces, or both?`,
        a: item.surface,
        choices: shuffle(['flat', 'curved', 'both flat and curved'])
      };
    } else if (type === 2) {
      // Number of faces
      const shapes = [
        { name: 'cube', faces: 6 },
        { name: 'cuboid', faces: 6 },
        { name: 'cylinder', faces: 3 },
        { name: 'cone', faces: 2 },
        { name: 'sphere', faces: 1 },
      ];
      const shape = rand(shapes);
      return {
        q: `How many faces does a <strong>${shape.name}</strong> have?`,
        a: String(shape.faces),
        choices: shuffle([String(shape.faces), ...generateDistractors(shape.faces, 'small')])
      };
    } else if (type === 3) {
      // Sides and corners
      const shapes = [
        { name: 'triangle', sides: 3 },
        { name: 'rectangle', sides: 4 },
        { name: 'square', sides: 4 },
        { name: 'pentagon', sides: 5 },
        { name: 'hexagon', sides: 6 },
      ];
      const shape = rand(shapes);
      return {
        q: `How many sides does a <strong>${shape.name}</strong> have?`,
        a: String(shape.sides),
        choices: shuffle([String(shape.sides), String(shape.sides + 1), String(shape.sides - 1), String(shape.sides + 2)])
      };
    } else {
      // Match shape to object
      const pairs = [
        { obj: 'a cereal box 📦', shape: 'cuboid' },
        { obj: 'a tennis ball ⚽', shape: 'sphere' },
        { obj: 'a tin can 🥫', shape: 'cylinder' },
        { obj: 'a party hat 🎉', shape: 'cone' },
        { obj: 'a dice 🎲', shape: 'cube' },
      ];
      const pair = rand(pairs);
      return {
        q: `What 3D shape is <strong>${pair.obj}</strong>?`,
        a: pair.shape,
        choices: shuffle(pairs.slice(0, 4).map(p => p.shape))
      };
    }
  },

  /* Unit 17: Patterns */
  g3_patterns() {
    const type = randInt(1, 4);
    if (type === 1) {
      // Increasing pattern with rule
      const start = randInt(1, 50);
      const step = rand([2, 3, 4, 5, 10]);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const ans = start + step * 4;
      return {
        q: `What comes next? <strong>${seq.join(', ')}, ___</strong><br><em>(The rule is: add ${step})</em>`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + step), String(ans - step), String(ans + 1)])
      };
    } else if (type === 2) {
      // Decreasing pattern
      const start = randInt(50, 100);
      const step = rand([2, 3, 5, 10]);
      const seq = [start, start - step, start - step * 2, start - step * 3];
      const ans = start - step * 4;
      return {
        q: `What comes next? <strong>${seq.join(', ')}, ___</strong><br><em>(The rule is: subtract ${step})</em>`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + step), String(ans - step), String(seq[3])])
      };
    } else if (type === 3) {
      // Find the rule
      const start = randInt(2, 20);
      const step = rand([3, 4, 5]);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      return {
        q: `Look at the pattern: <strong>${seq.join(', ')}</strong>.<br>What is the rule?`,
        a: `Add ${step}`,
        choices: shuffle([`Add ${step}`, `Add ${step + 1}`, `Add ${step - 1}`, `Multiply by ${step}`])
      };
    } else {
      // Shape pattern
      const patternSets = [
        { pattern: ['🔴', '🔵', '🟢', '🔴', '🔵', '🟢', '🔴'], ans: '🔵', opts: ['🔵', '🔴', '🟢', '🟡'] },
        { pattern: ['⬜', '⬜', '🔺', '⬜', '⬜', '🔺', '⬜'], ans: '⬜', opts: ['⬜', '🔺', '⚪', '🟦'] },
        { pattern: ['⭐', '🌙', '⭐', '⭐', '🌙', '⭐', '⭐'], ans: '🌙', opts: ['🌙', '⭐', '☀️', '🌟'] },
      ];
      const p = rand(patternSets);
      return {
        q: `What comes next?<br><span class="pattern-display">${p.pattern.join(' ')} ___</span>`,
        a: p.ans,
        choices: shuffle(p.opts)
      };
    }
  },


  /* ================================================================
     PRIMARY 2 & GENERAL TEMPLATES (Existing)
     ================================================================ */

  /* === Numbers to 1,000 (Creative & Step-by-Step) === */
  place_value_1000() {
    // Variety of number-related learning tasks going step-by-step
    const type = randInt(1, 4);
    
    if (type === 1) {
      // Place Value Digit
      const num = randInt(100, 999);
      const strNum = String(num);
      const pos = randInt(0, 2); // 0: hundreds, 1: tens, 2: ones
      const digit = parseInt(strNum[pos]);
      const ans = digit * Math.pow(10, 2 - pos);
      
      // Ensure unique choices by using a Set
      const choices = new Set([String(ans), String(digit), String(digit * 10), String(digit * 100)]);
      while (choices.size < 4) choices.add(String(randInt(1, 9) * 10)); // pad if overlapping
      
      return {
        q: `In the number ${num}, what is the place value of the digit ${digit}?`,
        a: String(ans),
        choices: shuffle(Array.from(choices).slice(0, 4))
      };
    } else if (type === 2) {
      // Expanded form
      const h = randInt(1, 9) * 100;
      const t = randInt(1, 9) * 10;
      const o = randInt(1, 9);
      const ans = h + t + o;
      return {
        q: `What number do we get by expanding: ${h} + ${t} + ${o} = ?`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'number')])
      };
    } else if (type === 3) {
      // More/Less
      const num = randInt(100, 899);
      const change = rand([10, 100]);
      const more = rand([true, false]);
      const ans = more ? num + change : num - change;
      const wrong1 = String(num + 10);
      const wrong2 = String(num - 10);
      const wrong3 = String(num + 100);
      
      return {
        q: `What is ${change} ${more ? 'more' : 'less'} than ${num}?`,
        a: String(ans),
        // Filter out the answer from the wrong choices, then add it back
        choices: shuffle([wrong1, wrong2, wrong3].filter(x => x !== String(ans)).slice(0, 3).concat(String(ans)))
      };
    } else {
      // Composition
      const h = randInt(2, 9);
      const t = randInt(1, 9);
      const o = randInt(1, 9);
      const ans = h * 100 + t * 10 + o;
      return {
        q: `Combine the blocks creatively: ${h} hundreds, ${t} tens, and ${o} ones.`,
        a: String(ans),
        choices: shuffle([String(ans), String((h-1)*100 + t*10 + o), String(o*100 + t*10 + h), String(h*100 + o*10 + t)])
      };
    }
  },

  /* === Numbers to 100,000 (Advanced & Creative) === */
  place_value_10000() {
    const type = randInt(1, 3);
    
    if (type === 1) {
      // Place Value Digit in 5-digit number
      const num = randInt(10000, 99999);
      const strNum = String(num);
      const pos = randInt(0, 4); 
      const digit = parseInt(strNum[pos]);
      const ans = digit * Math.pow(10, 4 - pos);
      
      const choices = new Set([
        String(ans), 
        String(digit * Math.pow(10, 5 - pos) || digit*1000), 
        String(digit * Math.pow(10, 3 - pos) || digit*10), 
        String(digit)
      ]);
      while (choices.size < 4) choices.add(String(randInt(10, 99)*100)); // pad
      
      return {
        q: `In the large number ${num}, what is the actual value of the digit ${digit}?`,
        a: String(ans),
        choices: shuffle(Array.from(choices).slice(0, 4)),
        visual: { type: 'place_value_chart', params: { number: num, columns: ['TTh', 'Th', 'H', 'T', 'O'] } }
      };
    } else if (type === 2) {
      // Rounding
      const num = randInt(10000, 99999);
      const toNearest = rand([100, 1000]);
      const ans = Math.round(num / toNearest) * toNearest;
      return {
        q: `Here's a challenge: Round ${num} to the nearest ${toNearest}.`,
        a: String(ans),
        choices: shuffle([String(ans), ...generateDistractors(ans, 'number')])
      };
    } else {
      // Pattern Completion
      const start = randInt(10000, 80000);
      const step = rand([100, 1000, 10000]);
      const ans = start + step * 3;
      return {
        q: `Look at the pattern and complete it: ${start}, ${start + step}, ${start + step * 2}, ___`,
        a: String(ans),
        choices: shuffle([String(ans), String(ans + step), String(ans - step), String(start + step * 4)])
      };
    }
  },  
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
      choices: shuffle([`${num}/${den}`, `${den}/${num}`, `${num+1}/${den}`, `${num}/${den+1}`]),
      visual: { type: 'fraction_circle', params: { numerator: num, denominator: den } }
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
  },

  /* === Remaining Core Templates === */
  addition_4digit() {
    // Addition within 1000 for P2
    const a = randInt(100, 500);
    const b = randInt(100, 499);
    const ans = a + b;
    return {
      q: `What is ${a} + ${b}?`,
      a: String(ans),
      choices: shuffle([String(ans), ...generateDistractors(ans, 'addition')])
    };
  },

  money_basic() {
    const d = randInt(1, 50);
    const c = randInt(5, 95);
    const ans = `$${d}.${c < 10 ? '0' + c : c}`;
    const wrong1 = `$${c}.${d < 10 ? '0' + d : d}`;
    const wrong2 = `$${d}${c}`;
    const wrong3 = `$${d + 1}.00`;
    return {
      q: `What is the written value of ${d} dollars and ${c} cents?`,
      a: ans,
      choices: shuffle([ans, wrong1, wrong2, wrong3])
    };
  },

  time_basic() {
    const hours = randInt(1, 12);
    const mins = rand([0, 15, 30, 45]);
    const strMins = mins === 0 ? '00' : String(mins);
    const ans = `${hours} ${mins === 0 ? "o'clock" : mins}`;
    return {
      q: `How do you read the time ${hours}:${strMins}?`,
      a: ans,
      choices: shuffle([ans, `${hours + 1} ${mins === 0 ? "o'clock" : mins}`, `${hours}:${strMins}`, `Half past ${hours}`])
    };
  },
  
  area_perimeter() {
    const length = randInt(4, 12);
    const width = randInt(2, 8);
    const isArea = rand([true, false]);
    if (isArea) {
      const ans = length * width;
      return {
        q: `What is the area of a rectangle with length ${length}cm and width ${width}cm?`,
        a: `${ans} cm²`,
        choices: shuffle([`${ans} cm²`, `${length * width + 2} cm²`, `${(length + width) * 2} cm²`, `${length + width} cm²`]),
        visual: { type: 'rectangle_grid', params: { length: length, width: width, showArea: true } }
      };
    } else {
      const ans = (length + width) * 2;
      return {
        q: `What is the perimeter of a rectangle with length ${length}cm and width ${width}cm?`,
        a: `${ans} cm`,
        choices: shuffle([`${ans} cm`, `${length * width} cm`, `${ans + 2} cm`, `${length + width} cm`]),
        visual: { type: 'rectangle_grid', params: { length: length, width: width, showArea: false } }
      };
    }
  },

  bar_graphs() {
    const itemName = rand(ITEMS);
    const val1 = randInt(10, 50);
    const val2 = val1 + randInt(5, 20);
    const diff = val2 - val1;
    return {
      q: `A bar graph shows ${val1} ${itemName} for Group A and ${val2} for Group B. How many more ${itemName} does Group B have?`,
      a: String(diff),
      choices: shuffle([String(diff), String(val1 + val2), String(diff + 5), String(val2)]),
      visual: { type: 'bar_graph', params: { groupA: val1, groupB: val2, item: itemName } }
    };
  },

  fractions_add_sub() {
    const den = randInt(4, 10);
    const num1 = randInt(1, Math.floor(den/2));
    const num2 = randInt(1, den - num1 - 1);
    const ansNum = num1 + num2;
    return {
      q: `What is ${num1}/${den} + ${num2}/${den}?`,
      a: `${ansNum}/${den}`,
      choices: shuffle([`${ansNum}/${den}`, `${ansNum}/${den*2}`, `${num1+num2+1}/${den}`, `${num1*num2}/${den}`]),
      visual: { type: 'fraction_bar', params: { numerator1: num1, numerator2: num2, denominator: den } }
    };
  },

  angles() {
    const known = randInt(30, 150);
    const ans = 180 - known;
    return {
      q: `Angles on a straight line add up to 180°. If one angle is ${known}°, what is the unknown angle?`,
      a: `${ans}°`,
      choices: shuffle([`${ans}°`, `${90 - known > 0 ? 90 - known : known}°`, `${360 - known}°`, `${ans + 10}°`]),
      visual: { type: 'angle', params: { known: known, unknown: ans, type: 'straight' } }
    };
  },

  measurement() {
    const isSpeed = rand([true, false]);
    if (isSpeed) {
      const speed = randInt(40, 90);
      const hours = randInt(2, 5);
      const dist = speed * hours;
      return {
        q: `A car travels at a speed of ${speed} km/h for ${hours} hours. What is the distance covered?`,
        a: `${dist} km`,
        choices: shuffle([`${dist} km`, `${speed + hours} km`, `${dist + 10} km`, `${speed * (hours-1)} km`]),
        visual: { type: 'speed_distance', params: { speed: speed, hours: hours, distance: dist } }
      };
    } else {
      const kg = randInt(2, 9);
      const g = randInt(50, 950);
      return {
        q: `Convert ${kg} kg and ${g} g into grams.`,
        a: `${kg * 1000 + g} g`,
        choices: shuffle([`${kg * 1000 + g} g`, `${kg + g} g`, `${kg * 100 + g} g`, `${kg * 1000 + g + 100} g`])
      };
    }
  },

  // Alias for guess_check used by lesson questionType
  guess_check() {
    return Templates.template_guess_check();
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
      'fractions_equivalent',
      // P1 topics in the mix
      'counting_10',
      'counting_20',
      'number_bonds',
      'addition_within_20',
      'subtraction_within_20',
      'patterns'
    ];
    
    // Generate a manageable task of 50 questions
    for (let i = 0; i < 50; i++) {
      const type = rand(pool);
      items.push(this.getQuestion(type));
    }
    
    return items;
  }
};
