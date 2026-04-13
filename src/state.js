/* ============================================
   MathQuest — State Manager
   Handles app state, LocalStorage persistence, 
   progress tracking, and Web Audio API sounds
   ============================================ */

const STORAGE_KEY = 'mathquest_save_v1';

// ===== DEFAULT STATE =====
function createDefaultState() {
  return {
    // Player
    playerName: 'Explorer',
    level: 1,
    totalXP: 0,
    currentXP: 0,
    xpToNextLevel: 100,
    
    // Progress
    completedLessons: [],    // ['1-0', '1-1', '1-2', ...]
    lessonScores: {},        // { '1-0': { correct: 8, total: 10, bestStreak: 5 } }
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    currentStreak: 0,
    bestStreak: 0,
    
    // Assignments
    assignmentsCompleted: 0,
    bestAssignmentScore: 0,
    
    // Badges earned
    badges: [],
    
    // Settings
    soundEnabled: true,
    
    // Session (not persisted)
    _session: {
      currentView: 'dashboard',
      currentModule: null,
      currentLesson: null,
      currentQuestionIndex: 0,
      lessonQuestions: [],
      lessonCorrect: 0,
      lessonTotal: 0,
      sessionStreak: 0,
      assignmentQuestions: [],
      assignmentIndex: 0,
      assignmentCorrect: 0,
      assignmentWrong: 0,
      assignmentStreak: 0,
    }
  };
}

// ===== STATE SINGLETON =====
let _state = createDefaultState();
const _listeners = new Set();

export const State = {
  get() { return _state; },
  
  getSession() { return _state._session; },
  
  update(changes) {
    Object.assign(_state, changes);
    this._notify();
    this.save();
  },
  
  updateSession(changes) {
    Object.assign(_state._session, changes);
    this._notify();
  },
  
  save() {
    try {
      const toSave = { ..._state };
      delete toSave._session;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  },
  
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        _state = { ...createDefaultState(), ...parsed, _session: createDefaultState()._session };
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
      _state = createDefaultState();
    }
  },
  
  reset() {
    _state = createDefaultState();
    localStorage.removeItem(STORAGE_KEY);
    this._notify();
  },
  
  subscribe(fn) {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  },
  
  _notify() {
    _listeners.forEach(fn => fn(_state));
  },
  
  // ===== PROGRESS HELPERS =====
  
  addXP(amount) {
    let xp = _state.currentXP + amount;
    let totalXP = _state.totalXP + amount;
    let level = _state.level;
    let xpNeeded = _state.xpToNextLevel;
    let leveledUp = false;
    
    while (xp >= xpNeeded) {
      xp -= xpNeeded;
      level++;
      xpNeeded = Math.floor(xpNeeded * 1.4);
      leveledUp = true;
    }
    
    this.update({
      currentXP: xp,
      totalXP: totalXP,
      level: level,
      xpToNextLevel: xpNeeded,
    });
    
    return { leveledUp, newLevel: level };
  },
  
  recordAnswer(correct) {
    const updates = {
      totalQuestionsAnswered: _state.totalQuestionsAnswered + 1,
    };
    
    if (correct) {
      updates.totalCorrect = _state.totalCorrect + 1;
      updates.currentStreak = _state.currentStreak + 1;
      if (updates.currentStreak > _state.bestStreak) {
        updates.bestStreak = updates.currentStreak;
      }
    } else {
      updates.currentStreak = 0;
    }
    
    this.update(updates);
  },
  
  completeLesson(moduleId, lessonIndex, correct, total, streak) {
    const key = `${moduleId}-${lessonIndex}`;
    const completedLessons = [..._state.completedLessons];
    if (!completedLessons.includes(key)) {
      completedLessons.push(key);
    }
    
    const lessonScores = { ..._state.lessonScores };
    const prev = lessonScores[key];
    if (!prev || correct > prev.correct) {
      lessonScores[key] = { correct, total, bestStreak: streak };
    }
    
    this.update({ completedLessons, lessonScores });
  },
  
  isLessonCompleted(moduleId, lessonIndex) {
    return _state.completedLessons.includes(`${moduleId}-${lessonIndex}`);
  },
  
  isLessonUnlocked(moduleId, lessonIndex) {
    if (lessonIndex === 0) return true;
    return this.isLessonCompleted(moduleId, lessonIndex - 1);
  },
  
  getModuleProgress(moduleId, totalLessons) {
    let completed = 0;
    for (let i = 0; i < totalLessons; i++) {
      if (this.isLessonCompleted(moduleId, i)) completed++;
    }
    return completed;
  },
  
  getAccuracy() {
    if (_state.totalQuestionsAnswered === 0) return 0;
    return Math.round((_state.totalCorrect / _state.totalQuestionsAnswered) * 100);
  },
  
  // ===== BADGE SYSTEM =====
  earnBadge(badgeId) {
    if (!_state.badges.includes(badgeId)) {
      const badges = [..._state.badges, badgeId];
      this.update({ badges });
      return true; // newly earned
    }
    return false;
  },
  
  hasBadge(badgeId) {
    return _state.badges.includes(badgeId);
  },
  
  checkBadges() {
    const newBadges = [];
    const s = _state;
    
    // First Steps - complete 1 lesson
    if (s.completedLessons.length >= 1 && !this.hasBadge('first_steps')) {
      if (this.earnBadge('first_steps')) newBadges.push('first_steps');
    }
    // Number Ninja - complete all Module 1 (Primary 1 — 14 lessons)
    if (this.getModuleProgress(1, 14) >= 14 && !this.hasBadge('number_ninja')) {
      if (this.earnBadge('number_ninja')) newBadges.push('number_ninja');
    }
    // Block Builder - complete 5 builder lessons
    if (s.completedLessons.length >= 5 && !this.hasBadge('block_builder')) {
      if (this.earnBadge('block_builder')) newBadges.push('block_builder');
    }
    // Streak Master - 10 streak
    if (s.bestStreak >= 10 && !this.hasBadge('streak_master')) {
      if (this.earnBadge('streak_master')) newBadges.push('streak_master');
    }
    // Perfectionist - 100% on a lesson
    for (const key of Object.keys(s.lessonScores)) {
      const sc = s.lessonScores[key];
      if (sc.correct === sc.total && !this.hasBadge('perfectionist')) {
        if (this.earnBadge('perfectionist')) newBadges.push('perfectionist');
      }
    }
    // Century - answer 100 questions
    if (s.totalQuestionsAnswered >= 100 && !this.hasBadge('century')) {
      if (this.earnBadge('century')) newBadges.push('century');
    }
    // Scholar - reach level 5
    if (s.level >= 5 && !this.hasBadge('scholar')) {
      if (this.earnBadge('scholar')) newBadges.push('scholar');
    }
    // Challenge Champion - complete 100-question assignment with 80%+
    if (s.bestAssignmentScore >= 80 && !this.hasBadge('challenge_champion')) {
      if (this.earnBadge('challenge_champion')) newBadges.push('challenge_champion');
    }
    // Fire Streak - 20 streak
    if (s.bestStreak >= 20 && !this.hasBadge('fire_streak')) {
      if (this.earnBadge('fire_streak')) newBadges.push('fire_streak');
    }
    // Math Master - complete all modules (P1=14, G3=17, Middle=6, Upper=7)
    if (this.getModuleProgress(1, 14) >= 14 && 
        this.getModuleProgress(2, 17) >= 17 && 
        this.getModuleProgress(3, 6) >= 6 && 
        this.getModuleProgress(4, 7) >= 7 &&
        !this.hasBadge('math_master')) {
      if (this.earnBadge('math_master')) newBadges.push('math_master');
    }
    
    return newBadges;
  }
};

// ===== BADGE DEFINITIONS =====
export const BADGES = [
  { id: 'first_steps', name: 'First Steps', icon: '👣', desc: 'Complete your first lesson' },
  { id: 'block_builder', name: 'Block Builder', icon: '🧱', desc: 'Complete 5 lessons' },
  { id: 'number_ninja', name: 'Number Ninja', icon: '🥷', desc: 'Complete Module 1' },
  { id: 'streak_master', name: 'Streak Master', icon: '🔥', desc: 'Get a 10-answer streak' },
  { id: 'fire_streak', name: 'On Fire!', icon: '💥', desc: 'Get a 20-answer streak' },
  { id: 'perfectionist', name: 'Perfectionist', icon: '💎', desc: 'Score 100% on any lesson' },
  { id: 'century', name: 'Century Club', icon: '💯', desc: 'Answer 100 questions total' },
  { id: 'scholar', name: 'Scholar', icon: '🎓', desc: 'Reach Level 5' },
  { id: 'challenge_champion', name: 'Challenge Champion', icon: '🏅', desc: '80%+ on 100-Question Challenge' },
  { id: 'math_master', name: 'Math Master', icon: '👑', desc: 'Complete ALL modules' },
];

// ===== WEB AUDIO ENGINE =====
let _audioCtx = null;

function getAudioCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _audioCtx;
}

export const Audio = {
  _enabled: true,
  
  init() {
    // Create audio context on first user interaction
    document.addEventListener('click', () => {
      if (!_audioCtx) getAudioCtx();
    }, { once: true });
  },
  
  setEnabled(val) {
    this._enabled = val;
  },
  
  _playTone(freq, duration, type = 'sine', volume = 0.15) {
    if (!this._enabled || !_audioCtx) return;
    try {
      const ctx = getAudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) { /* ignore audio errors */ }
  },
  
  click() {
    this._playTone(800, 0.08, 'sine', 0.08);
  },
  
  correct() {
    this._playTone(523, 0.15, 'sine', 0.12);
    setTimeout(() => this._playTone(659, 0.15, 'sine', 0.12), 100);
    setTimeout(() => this._playTone(784, 0.2, 'sine', 0.12), 200);
  },
  
  incorrect() {
    this._playTone(300, 0.2, 'triangle', 0.1);
    setTimeout(() => this._playTone(250, 0.3, 'triangle', 0.1), 150);
  },
  
  levelUp() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 0.25, 'sine', 0.12), i * 120);
    });
  },
  
  achievement() {
    const notes = [784, 988, 1175, 1319, 1568];
    notes.forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 0.3, 'sine', 0.1), i * 100);
    });
  },
  
  drop() {
    this._playTone(440, 0.1, 'sine', 0.1);
  },
  
  snap() {
    this._playTone(660, 0.08, 'square', 0.06);
    setTimeout(() => this._playTone(880, 0.08, 'square', 0.06), 50);
  }
};

// ===== CONFETTI =====
export const Confetti = {
  canvas: null,
  ctx: null,
  particles: [],
  animating: false,
  
  init() {
    this.canvas = document.getElementById('confetti-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this._resize();
    window.addEventListener('resize', () => this._resize());
  },
  
  _resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },
  
  burst(count = 80) {
    const colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#a855f7', '#22d3ee'];
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: Math.random() * -18 - 5,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1,
        decay: Math.random() * 0.015 + 0.008,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }
    
    if (!this.animating) {
      this.animating = true;
      this._animate();
    }
  },
  
  _animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravity
      p.rotation += p.rotSpeed;
      p.life -= p.decay;
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      
      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.restore();
    }
    
    if (this.particles.length > 0) {
      requestAnimationFrame(() => this._animate());
    } else {
      this.animating = false;
    }
  }
};

// ===== TOAST NOTIFICATIONS =====
export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const icons = { success: '✅', warning: '⚠️', info: 'ℹ️', achievement: '🏆' };
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
