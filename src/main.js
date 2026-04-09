import { State, Audio, Confetti, BADGES, showToast } from './state.js';
import { MODULES, getLesson, getModule } from './curriculum.js';
import { Generator } from './engine.js';

/* ============================================
   MathQuest — Main Application Controller
   Handles routing, DOM binding, and interactive
   builders logic.
   ============================================ */

const DOM = {
  // Views
  views: document.querySelectorAll('.view'),
  dashboard: document.getElementById('view-dashboard'),
  module: document.getElementById('view-module'),
  lesson: document.getElementById('view-lesson'),
  assignment: document.getElementById('view-assignment'),
  achievements: document.getElementById('view-achievements'),
  loading: document.getElementById('loading-screen'),
  
  // Dashboard
  welcomeProg: document.getElementById('welcome-progress'),
  gridModules: document.getElementById('modules-grid'),
  totalXp: document.getElementById('stat-total-xp'),
  totalQs: document.getElementById('stat-questions'),
  accuracy: document.getElementById('stat-accuracy'),
  bestStreak: document.getElementById('stat-best-streak'),
  headerXpFill: document.getElementById('header-xp-fill'),
  headerXpLabel: document.getElementById('header-xp-label'),
  streakBadge: document.getElementById('streak-count'),
  
  // Module View
  modTitle: document.getElementById('module-title'),
  modHeroIcon: document.getElementById('module-hero-icon'),
  modHeroTitle: document.getElementById('module-hero-title'),
  modHeroDesc: document.getElementById('module-hero-desc'),
  modProgressBadge: document.getElementById('module-progress-badge'),
  gridLessons: document.getElementById('lessons-grid'),
  
  // Lesson View
  lessTitle: document.getElementById('lesson-title'),
  lessQCurrent: document.getElementById('lesson-q-current'),
  lessQTotal: document.getElementById('lesson-q-total'),
  lessProgFill: document.getElementById('lesson-progress-fill'),
  probBadge: document.getElementById('problem-type-badge'),
  probText: document.getElementById('problem-text'),
  
  // Builders
  bldPartWhole: document.getElementById('builder-part-whole'),
  bldComparison: document.getElementById('builder-comparison'),
  bldGuessCheck: document.getElementById('builder-guess-check'),
  bldQuiz: document.getElementById('builder-quiz'),
  
  // Feedback
  fbOverlay: document.getElementById('feedback-overlay'),
  fbContent: document.getElementById('feedback-content'),
  fbIcon: document.getElementById('feedback-icon'),
  fbText: document.getElementById('feedback-text'),
  fbDetail: document.getElementById('feedback-detail'),
  fbXp: document.getElementById('feedback-xp'),
  
  // Modal
  modalOverlay: document.getElementById('modal-overlay'),
  modalCard: document.getElementById('modal-card'),
  modalTitle: document.getElementById('modal-title'),
  modalText: document.getElementById('modal-text'),
  modalStats: document.getElementById('modal-stats'),
  modalBadges: document.getElementById('modal-badges'),
};

// Application Init
function init() {
  State.load();
  Audio.init();
  Confetti.init();
  
  bindEvents();
  
  // Sim loading
  setTimeout(() => {
    DOM.loading.classList.remove('active');
    navigate('dashboard');
  }, 1000);
}

function bindEvents() {
  State.subscribe(renderHeader);

  // Global Navigation
  document.getElementById('btn-achievements').onclick = () => { Audio.click(); navigate('achievements'); };
  document.getElementById('btn-continue-learning').onclick = () => { Audio.click(); navigateModuleLevel(); };
  document.getElementById('btn-start-assignment').onclick = () => { Audio.click(); startAssignment(); };
  
  document.getElementById('btn-back-dashboard').onclick = () => { Audio.click(); navigate('dashboard'); };
  document.getElementById('btn-back-module').onclick = () => { Audio.click(); navigate('module', State.getSession().currentModule); };
  document.getElementById('btn-back-from-achievements').onclick = () => { Audio.click(); navigate('dashboard'); };
  document.getElementById('btn-quit-assignment').onclick = () => { Audio.click(); navigate('dashboard'); };

  // Next Question
  document.getElementById('btn-next-question').onclick = nextQuestion;

  // Modals
  document.getElementById('modal-primary-btn').onclick = () => {
    Audio.click();
    closeModal();
    navigate('dashboard');
  };
}

function navigate(viewId, param = null) {
  DOM.views.forEach(v => v.classList.remove('active'));
  const target = document.getElementById(`view-${viewId}`);
  if (target) target.classList.add('active');
  
  State.updateSession({ currentView: viewId });
  
  // View specific setups
  if (viewId === 'dashboard') renderDashboard();
  else if (viewId === 'module') {
    if (param) renderModule(param);
  }
  else if (viewId === 'lesson') {
    // handled by startLesson
  }
  else if (viewId === 'achievements') renderAchievements();
}

function navigateModuleLevel() {
  // Find highest unlocked lesson
  // Simplified: just go to module 1 for continued learning in this demo.
  navigate('module', 1);
}

// ==========================================
// RENDERERS
// ==========================================

function renderHeader(state) {
  DOM.headerXpLabel.textContent = `Lvl ${state.level} • ${state.currentXP} / ${state.xpToNextLevel} XP`;
  DOM.headerXpFill.style.width = `${(state.currentXP / state.xpToNextLevel) * 100}%`;
  DOM.streakBadge.textContent = state.currentStreak;
}

function renderDashboard() {
  const s = State.get();
  renderHeader(s);
  
  DOM.welcomeProg.textContent = s.completedLessons.length;
  DOM.totalXp.textContent = s.totalXP;
  DOM.totalQs.textContent = s.totalQuestionsAnswered;
  DOM.accuracy.textContent = `${State.getAccuracy()}%`;
  DOM.bestStreak.textContent = s.bestStreak;
  
  DOM.gridModules.innerHTML = '';
  MODULES.forEach(mod => {
    const prog = State.getModuleProgress(mod.id, mod.lessons.length);
    const html = `
      <div class="module-card glass-card" data-module="${mod.id}" onclick="window.navToModule(${mod.id})">
        <div class="module-card-header">
          <div class="module-card-icon">${mod.icon}</div>
          <div>
            <div class="module-card-title">${mod.title}</div>
            <div class="module-card-subtitle">${mod.subtitle}</div>
          </div>
        </div>
        <div class="module-card-desc">${mod.description}</div>
        <div class="module-card-progress">
          <div class="module-progress-track">
            <div class="module-progress-fill" style="width: ${(prog/mod.lessons.length)*100}%"></div>
          </div>
          <div class="module-progress-text">${prog}/${mod.lessons.length}</div>
        </div>
      </div>
    `;
    DOM.gridModules.insertAdjacentHTML('beforeend', html);
  });
}
window.navToModule = (id) => { Audio.click(); navigate('module', id); };

function renderModule(moduleId) {
  const mod = getModule(moduleId);
  if (!mod) return navigate('dashboard');
  
  State.updateSession({ currentModule: moduleId });
  
  DOM.modTitle.textContent = `Module ${mod.id}`;
  DOM.modHeroIcon.textContent = mod.icon;
  DOM.modHeroTitle.textContent = mod.title;
  DOM.modHeroDesc.textContent = mod.subtitle;
  
  const prog = State.getModuleProgress(mod.id, mod.lessons.length);
  DOM.modProgressBadge.textContent = `${prog}/${mod.lessons.length} Completed`;
  
  DOM.gridLessons.innerHTML = '';
  
  mod.lessons.forEach((lesson, index) => {
    const isCompleted = State.isLessonCompleted(mod.id, index);
    const isUnlocked = State.isLessonUnlocked(mod.id, index);
    
    let stateClass = '';
    let icon = '🔒';
    if (isCompleted) { stateClass = 'completed'; icon = '✅'; }
    else if (isUnlocked) { stateClass = 'current'; icon = '▶️'; }
    else { stateClass = 'locked'; }
    
    const html = `
      <div class="lesson-card glass-card ${stateClass}" onclick="window.navToLesson(${mod.id}, ${index})">
        <div class="lesson-number">${index + 1}</div>
        <div class="lesson-info">
          <div class="lesson-name">${lesson.title}</div>
          <div class="lesson-desc">${lesson.desc}</div>
        </div>
        <div class="lesson-status-icon">${icon}</div>
      </div>
    `;
    DOM.gridLessons.insertAdjacentHTML('beforeend', html);
  });
}
window.navToLesson = (modId, lessonIdx) => {
  if (State.isLessonUnlocked(modId, lessonIdx)) {
    Audio.click();
    startLesson(modId, lessonIdx);
  } else {
    Audio.error && Audio.error(); 
    showToast("Complete previous lessons to unlock!", "warning");
  }
};

function renderAchievements() {
  const s = State.get();
  
  const grid = document.getElementById('badges-grid');
  grid.innerHTML = '';
  
  BADGES.forEach(b => {
    const earned = s.badges.includes(b.id);
    const html = `
      <div class="badge-card ${earned ? 'earned' : 'locked'}">
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>
    `;
    grid.insertAdjacentHTML('beforeend', html);
  });
  
  // Render dummy explicit skill tree
  const tree = document.getElementById('skill-tree');
  tree.innerHTML = `
    <div class="skill-node ${s.level >= 1 ? 'unlocked' : 'locked'}"><div class="skill-node-circle">🧱</div><div class="skill-node-label">Basics</div></div>
    <div class="skill-node ${s.level >= 2 ? 'unlocked' : 'locked'}"><div class="skill-node-circle">➕</div><div class="skill-node-label">Addition</div></div>
    <div class="skill-node ${s.level >= 3 ? 'unlocked' : 'locked'}"><div class="skill-node-circle">➖</div><div class="skill-node-label">Subtraction</div></div>
    <div class="skill-node ${s.level >= 4 ? 'unlocked' : 'locked'}"><div class="skill-node-circle">🧩</div><div class="skill-node-label">Part-Whole</div></div>
    <div class="skill-node ${s.level >= 5 ? 'unlocked' : 'locked'}"><div class="skill-node-circle">⚖️</div><div class="skill-node-label">Comparison</div></div>
    <div class="skill-node ${s.level >= 6 ? 'unlocked' : 'locked'}"><div class="skill-node-circle">✖️</div><div class="skill-node-label">Multiply</div></div>
  `;
}


// ==========================================
// GAMEPLAY ENGINE
// ==========================================

function startLesson(moduleId, lessonIndex) {
  const lesson = getLesson(moduleId, lessonIndex);
  if (!lesson) return;
  
  const questions = Generator.getLessonItems(lesson);
  
  State.updateSession({
    currentModule: moduleId,
    currentLesson: lessonIndex,
    lessonQuestions: questions,
    currentQuestionIndex: 0,
    lessonCorrect: 0,
    lessonTotal: questions.length,
    sessionStreak: 0
  });
  
  DOM.lessTitle.textContent = lesson.title;
  DOM.lessQTotal.textContent = questions.length;
  
  navigate('lesson');
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const s = State.getSession();
  const index = s.currentQuestionIndex;
  const qObj = s.lessonQuestions[index];
  
  if (!qObj) return finishLesson();
  
  DOM.lessQCurrent.textContent = index + 1;
  DOM.lessProgFill.style.width = `${((index) / s.lessonTotal) * 100}%`;
  
  const lessData = getLesson(s.currentModule, s.currentLesson);
  const type = qObj.builderType || lessData.type;
  
  DOM.probBadge.textContent = type.toUpperCase();
  DOM.probText.innerHTML = qObj.q;
  
  hideAllBuilders();
  
  if (type === 'part-whole') {
    DOM.bldPartWhole.style.display = 'block';
    setupPartWholeBuilder(qObj);
  } else if (type === 'comparison') {
    DOM.bldComparison.style.display = 'block';
    setupComparisonBuilder(qObj);
  } else if (type === 'guess-check') {
    DOM.bldGuessCheck.style.display = 'block';
    setupGuessCheckBuilder(qObj);
  } else {
    // Default Quiz
    DOM.bldQuiz.style.display = 'block';
    setupQuizBuilder(qObj);
  }
}

function hideAllBuilders() {
  DOM.bldPartWhole.style.display = 'none';
  DOM.bldComparison.style.display = 'none';
  DOM.bldGuessCheck.style.display = 'none';
  DOM.bldQuiz.style.display = 'none';
}


// === STANDARD QUIZ HANDLER ===
function setupQuizBuilder(qObj) {
  const container = document.getElementById('quiz-choices');
  container.innerHTML = '';
  document.getElementById('quiz-input-row').style.display = 'none';
  
  if (qObj.choices) {
    qObj.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = c;
      btn.onclick = () => handleAnswer(c === qObj.a, qObj.a, btn);
      container.appendChild(btn);
    });
  } else {
    // Text input
    document.getElementById('quiz-input-row').style.display = 'flex';
    const inp = document.getElementById('quiz-answer-input');
    inp.value = '';
    inp.className = 'builder-input';
    document.getElementById('quiz-submit-btn').onclick = () => {
      const val = inp.value.trim();
      if (!val) return;
      handleAnswer(val === qObj.a, qObj.a, inp);
    };
  }
}


// === PART WHOLE HANDLER ===
function setupPartWholeBuilder(qObj) {
  const dock = document.getElementById('pw-dock');
  const track = document.getElementById('pw-track');
  const input = document.getElementById('pw-answer-input');
  dock.innerHTML = '';
  
  // Reset track dropzones
  track.querySelectorAll('.pw-drop-zone').forEach(zone => {
    zone.innerHTML = '';
    zone.classList.remove('has-block');
  });
  
  input.value = '';
  input.className = 'builder-input';
  
  // Create Draggable Blocks
  shuffle(qObj.blocks).forEach((val, i) => {
    const block = document.createElement('div');
    block.className = 'drag-block';
    block.textContent = val;
    block.draggable = true;
    block.dataset.val = val;
    block.id = `block-pw-${i}`;
    
    // Drag events
    block.ondragstart = (e) => {
      Audio.click();
      block.classList.add('dragging');
      e.dataTransfer.setData('text/plain', block.id);
    };
    block.ondragend = () => block.classList.remove('dragging');
    dock.appendChild(block);
  });
  
  // Drop Zones mapping
  track.querySelectorAll('.pw-drop-zone').forEach(zone => {
    zone.ondragover = e => { e.preventDefault(); zone.classList.add('drag-over'); };
    zone.ondragleave = () => zone.classList.remove('drag-over');
    zone.ondrop = e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const blockId = e.dataTransfer.getData('text/plain');
      const block = document.getElementById(blockId);
      if (block && !zone.hasChildNodes()) {
        Audio.drop();
        zone.appendChild(block);
        zone.classList.add('has-block');
        block.classList.add('in-zone');
      }
    };
  });
  
  document.getElementById('pw-submit-btn').onclick = () => {
    const val = input.value.trim();
    if (!val) return;
    handleAnswer(val === qObj.a, qObj.a, input);
  };
}


// === COMPARISON HANDLER ===
function setupComparisonBuilder(qObj) {
  document.getElementById('comp-name-1').textContent = qObj.entity1;
  document.getElementById('comp-name-2').textContent = qObj.entity2;
  
  const dock = document.getElementById('comp-dock');
  dock.innerHTML = '';
  
  const z1a = document.getElementById('comp-drop-1a');
  const z2a = document.getElementById('comp-drop-2a');
  const z2b = document.getElementById('comp-drop-2b');
  [z1a, z2a, z2b].forEach(z => { z.innerHTML = ''; z.classList.remove('has-block'); });
  
  const input = document.getElementById('comp-answer-input');
  input.value = '';
  input.className = 'builder-input';
  
  // Needs baseVal twice (duplicate), and diffVal once 
  const buildBlocks = [
    { id: 'b1', val: qObj.baseVal, label: `$${qObj.baseVal}` },
    { id: 'b2', val: qObj.baseVal, label: `$${qObj.baseVal}` }, // the duplicate
    { id: 'b3', val: qObj.diffVal, label: `$${qObj.diffVal}` }
  ];
  
  shuffle(buildBlocks).forEach(b => {
    const block = document.createElement('div');
    block.className = 'drag-block';
    block.textContent = b.label;
    block.draggable = true;
    block.id = `block-comp-${b.id}`;
    block.ondragstart = (e) => { block.classList.add('dragging'); e.dataTransfer.setData('text/plain', block.id); };
    block.ondragend = () => block.classList.remove('dragging');
    dock.appendChild(block);
  });
  
  [z1a, z2a, z2b].forEach(zone => {
    zone.ondragover = e => { e.preventDefault(); zone.classList.add('drag-over'); };
    zone.ondragleave = () => zone.classList.remove('drag-over');
    zone.ondrop = e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const blockId = e.dataTransfer.getData('text/plain');
      const block = document.getElementById(blockId);
      if (block && !zone.hasChildNodes()) {
        Audio.drop();
        zone.appendChild(block);
        zone.classList.add('has-block');
        block.classList.add('in-zone');
      }
    };
  });
  
  document.getElementById('comp-submit-btn').onclick = () => {
    const val = input.value.trim();
    if (!val) return;
    handleAnswer(val === qObj.a, qObj.a, input);
  };
}


// === GUESS & CHECK HANDLER ===
function setupGuessCheckBuilder(qObj) {
  const p = qObj.params;
  const sA = document.getElementById('gc-slider-a');
  const sB = document.getElementById('gc-slider-b');
  const dCount = document.getElementById('gc-total-count');
  const dValue = document.getElementById('gc-total-value');
  const btn = document.getElementById('gc-submit-btn');
  const fill = document.getElementById('gc-progress-fill');
  
  document.getElementById('gc-label-a').textContent = `$${p.valA} notes`;
  document.getElementById('gc-label-b').textContent = `$${p.valB} notes`;
  document.getElementById('gc-count-target').textContent = p.targetCount;
  document.getElementById('gc-value-target').textContent = `$${p.targetValue}`;
  
  // init sliders
  sA.max = p.targetCount;
  sB.max = p.targetCount;
  sA.value = Math.floor(p.targetCount / 2);
  sB.value = p.targetCount - sA.value;
  
  function update() {
    const valA = parseInt(sA.value);
    const valB = parseInt(sB.value);
    document.getElementById('gc-val-a').textContent = valA;
    document.getElementById('gc-val-b').textContent = valB;
    
    const count = valA + valB;
    const value = (valA * p.valA) + (valB * p.valB);
    
    dCount.textContent = count;
    dValue.textContent = `$${value}`;
    
    const maxValIfAllA = p.targetCount * Math.max(p.valA, p.valB);
    const prog = (value / maxValIfAllA) * 100;
    fill.style.width = `${Math.min(100, prog)}%`;
    
    // Check states
    fill.className = 'gc-progress-fill ' + 
      (value === p.targetValue && count === p.targetCount ? 'matched' : (Math.abs(value-p.targetValue) < 10 ? 'close' : ''));
      
    if (value === p.targetValue && count === p.targetCount) {
      Audio.snap();
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }
  }
  
  sA.oninput = () => { Audio.click(); update(); };
  sB.oninput = () => { Audio.click(); update(); };
  update();
  
  btn.onclick = () => {
    // if button is enabled, it means they matched the values. The answer requires qty A.
    handleAnswer(true, qObj.a, null);
  };
}


// ==========================================
// FEEDBACK & PROGRESSION
// ==========================================

function handleAnswer(isCorrect, rightAnswer, el) {
  const sess = State.getSession();
  const lessonObj = getLesson(sess.currentModule, sess.currentLesson);
  const xpReward = lessonObj ? lessonObj.xpPerQuestion : 10;
  
  if (isCorrect) {
    Audio.correct();
    if (el) el.classList.add('correct');
    
    const newStreak = sess.sessionStreak + 1;
    State.updateSession({ 
      lessonCorrect: sess.lessonCorrect + 1,
      sessionStreak: newStreak 
    });
    
    State.recordAnswer(true);
    const { leveledUp } = State.addXP(xpReward);
    
    DOM.fbIcon.textContent = '⭐⭐⭐';
    DOM.fbText.textContent = newStreak >= 3 ? `${newStreak} IN A ROW! 🔥` : 'Correct!';
    DOM.fbText.className = 'feedback-text correct';
    DOM.fbDetail.textContent = 'Great job building the solution!';
    DOM.fbXp.textContent = `+${xpReward} XP`;
    DOM.fbXp.style.display = 'block';
    
    showFeedback();
    if (leveledUp) {
      setTimeout(() => showLevelUpModal(), 1500);
    }
  } else {
    Audio.incorrect();
    if (el) {
      el.classList.add('incorrect');
      setTimeout(() => el.classList.remove('incorrect'), 600);
    }
    
    State.updateSession({ sessionStreak: 0 });
    State.recordAnswer(false);
    
    DOM.fbIcon.textContent = '💡';
    DOM.fbText.textContent = 'Not quite!';
    DOM.fbText.className = 'feedback-text incorrect';
    DOM.fbDetail.textContent = `The correct answer was ${rightAnswer}.`;
    DOM.fbXp.style.display = 'none';
    
    showFeedback();
  }
  
  // check badges silently
  const newBadges = State.checkBadges();
  if (newBadges.length > 0) {
    setTimeout(() => { showToast('New Badge Earned! 🏆', 'achievement', 4000); Audio.achievement(); }, 1000);
  }
}

function showFeedback() {
  DOM.fbOverlay.style.display = 'flex';
}

function nextQuestion() {
  DOM.fbOverlay.style.display = 'none';
  const s = State.getSession();
  State.updateSession({ currentQuestionIndex: s.currentQuestionIndex + 1 });
  renderCurrentQuestion();
}

function finishLesson() {
  const s = State.getSession();
  // Mark complete
  State.completeLesson(s.currentModule, s.currentLesson, s.lessonCorrect, s.lessonTotal, s.sessionStreak);
  
  DOM.lessProgFill.style.width = `100%`;
  Audio.achievement();
  Confetti.burst();
  
  // Show End Modal
  openModal(
    '🎉',
    'Lesson Complete!',
    `You scored ${s.lessonCorrect} out of ${s.lessonTotal}.`,
    `<div>XP Earned: <b>${s.lessonCorrect * 10}</b></div><div>Best Streak: <b>${s.sessionStreak} 🔥</b></div>`
  );
  document.getElementById('modal-primary-btn').textContent = "Back to Module";
  document.getElementById('modal-primary-btn').onclick = () => {
    closeModal();
    navigate('module', s.currentModule);
  };
}


// ==========================================
// ASSIGNMENT MODE (100 QUESTIONS)
// ==========================================
// A simplified runner leveraging the same feedback mechanism

function startAssignment() {
  const questions = Generator.generate100Assignment();
  State.updateSession({
    assignmentQuestions: questions,
    assignmentIndex: 0,
    assignmentCorrect: 0,
    assignmentWrong: 0,
    assignmentStreak: 0
  });
  
  navigate('assignment');
  renderAssignmentQuestion();
}

function renderAssignmentQuestion() {
  const s = State.getSession();
  if (s.assignmentIndex >= s.assignmentQuestions.length) return finishAssignment();
  
  const qObj = s.assignmentQuestions[s.assignmentIndex];
  
  document.getElementById('assign-current').textContent = s.assignmentIndex + 1;
  document.getElementById('assign-progress-fill').style.width = `${(s.assignmentIndex/100)*100}%`;
  
  document.getElementById('assign-problem-text').innerHTML = qObj.q;
  
  // Update stats
  document.getElementById('assign-correct').textContent = s.assignmentCorrect;
  document.getElementById('assign-wrong').textContent = s.assignmentWrong;
  document.getElementById('assign-streak').textContent = `🔥 ${s.assignmentStreak}`;
  
  const total = s.assignmentCorrect + s.assignmentWrong;
  document.getElementById('assign-accuracy').textContent = total > 0 ? `${Math.round((s.assignmentCorrect/total)*100)}%` : '0%';
  
  const area = document.getElementById('assign-answer-area');
  area.innerHTML = '';
  
  if (qObj.choices) {
    const grid = document.createElement('div');
    grid.className = 'quiz-choices';
    qObj.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = c;
      btn.onclick = () => handleAssignAnswer(c === qObj.a, qObj.a, btn);
      grid.appendChild(btn);
    });
    area.appendChild(grid);
  } else {
    area.innerHTML = `
      <div class="quiz-input-row">
        <input type="text" class="builder-input" id="assign-inp" placeholder="Answer..." />
        <button class="btn btn-primary" id="assign-sub">Submit</button>
      </div>
    `;
    document.getElementById('assign-sub').onclick = () => {
      const v = document.getElementById('assign-inp').value;
      if (v) handleAssignAnswer(v === qObj.a, qObj.a, document.getElementById('assign-inp'));
    };
  }
}

function handleAssignAnswer(isCorrect, rightAns, el) {
  const s = State.getSession();
  
  if (isCorrect) {
    Audio.correct();
    if(el) el.classList.add('correct');
    State.updateSession({ 
      assignmentCorrect: s.assignmentCorrect + 1,
      assignmentStreak: s.assignmentStreak + 1
    });
    State.addXP(10);
    setTimeout(() => {
      State.updateSession({ assignmentIndex: s.assignmentIndex + 1 });
      renderAssignmentQuestion();
    }, 600);
  } else {
    Audio.incorrect();
    if(el) el.classList.add('incorrect');
    State.updateSession({ 
      assignmentWrong: s.assignmentWrong + 1,
      assignmentStreak: 0
    });
    // Flash correct answer temporarily
    showToast(`Sorry, it was: ${rightAns}`, 'warning', 2000);
    setTimeout(() => {
      State.updateSession({ assignmentIndex: s.assignmentIndex + 1 });
      renderAssignmentQuestion();
    }, 1500);
  }
}

function finishAssignment() {
  const s = State.getSession();
  Audio.achievement();
  Confetti.burst(150);
  
  const score = Math.round((s.assignmentCorrect / 100) * 100);
  State.update({ 
    assignmentsCompleted: State.get().assignmentsCompleted + 1,
    bestAssignmentScore: Math.max(score, State.get().bestAssignmentScore)
  });
  
  State.checkBadges();
  
  openModal(
    '💯',
    'Challenge Complete!',
    `You survived the 100 Question Challenge!`,
    `<div>Final Score: <b>${score}%</b></div><div>Correct: <b>${s.assignmentCorrect}</b></div>`
  );
  document.getElementById('modal-primary-btn').onclick = () => { closeModal(); navigate('dashboard'); };
}

// ==========================================
// MODALS
// ==========================================

function openModal(icon, title, text, statsHtml = '') {
  DOM.modalIcon.textContent = icon;
  DOM.modalTitle.textContent = title;
  DOM.modalText.textContent = text;
  DOM.modalStats.innerHTML = statsHtml;
  DOM.modalOverlay.style.display = 'flex';
}

function closeModal() {
  DOM.modalOverlay.style.display = 'none';
}

function showLevelUpModal() {
  Audio.levelUp();
  Confetti.burst();
  openModal(
    '🌟',
    `Level ${State.get().level}!`,
    'You leveled up! Keep learning to earn more badges.',
    ''
  );
}

// Start
init();
