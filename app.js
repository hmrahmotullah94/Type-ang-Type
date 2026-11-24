// ===== TYPING JOB APP =====
// বাংলা ও ইংরেজি টাইপিং অনুশীলন PWA

'use strict';

// ===== SAMPLE TEXTS =====
const TEXTS = {
  bn: [
    'বাংলাদেশ একটি সুন্দর দেশ। এই দেশে অনেক নদী আছে। পদ্মা, মেঘনা এবং যমুনা এই দেশের প্রধান নদী। বাংলাদেশের মানুষ খুবই পরিশ্রমী এবং বন্ধুত্বপূর্ণ।',
    'আমাদের মাতৃভাষা বাংলা। ১৯৫২ সালের ২১ ফেব্রুয়ারি ভাষা আন্দোলনে শহীদরা তাঁদের জীবন দিয়ে এই ভাষাকে রক্ষা করেছেন। তাঁদের আত্মত্যাগ আমরা কখনো ভুলব না।',
    'বইয়ের মধ্যে আছে এক অনন্য জগৎ। জ্ঞান অর্জনের সেরা উপায় হলো বই পড়া। প্রতিদিন কিছুক্ষণ বই পড়ার অভ্যাস আমাদের চিন্তাশক্তি এবং মেধাকে শাণিত করে।',
    'টাইপিং একটি অত্যন্ত গুরুত্বপূর্ণ দক্ষতা। প্রতিদিন অনুশীলনের মাধ্যমে টাইপিং গতি এবং নির্ভুলতা উন্নত করা সম্ভব। ধৈর্য এবং একাগ্রতা সাফল্যের চাবিকাঠি।',
    'শিক্ষা জাতির মেরুদণ্ড। একটি শিক্ষিত জাতিই পারে দেশকে এগিয়ে নিয়ে যেতে। তাই আমাদের সকলের উচিত শিক্ষার প্রতি গুরুত্ব দেওয়া এবং জ্ঞান অর্জনে সচেষ্ট থাকা।',
    'প্রযুক্তির অগ্রগতি আমাদের জীবনকে অনেক সহজ করে তুলেছে। কম্পিউটার এবং ইন্টারনেট এখন আমাদের দৈনন্দিন জীবনের অপরিহার্য অংশ হয়ে উঠেছে।',
    'মানুষের জীবনে স্বাস্থ্যই সবচেয়ে বড় সম্পদ। সুস্বাস্থ্য বজায় রাখতে প্রতিদিন ব্যায়াম করা, পুষ্টিকর খাবার খাওয়া এবং পর্যাপ্ত ঘুমানো অত্যন্ত জরুরি।',
    'পরিবেশ রক্ষা আমাদের সকলের দায়িত্ব। গাছপালা কাটা বন্ধ করতে হবে এবং নতুন গাছ লাগাতে হবে। দূষণমুক্ত পরিবেশ গড়ে তোলা আমাদের ভবিষ্যৎ প্রজন্মের জন্য অপরিহার্য।'
  ],
  en: [
    'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. Typing practice helps improve your speed and accuracy over time.',
    'Consistency is the key to mastering any skill. Regular practice makes perfect. When you type every day, your fingers learn to find the right keys automatically.',
    'Technology has changed the way we communicate. With the internet, information travels at the speed of light. Learning to type faster can greatly increase your productivity.',
    'A good typist keeps their eyes on the screen, not on the keyboard. Touch typing is a skill that takes time to develop but pays off greatly in the long run.',
    'Bangladesh is a beautiful country located in South Asia. It has rich culture, history, and traditions. The people of Bangladesh are hardworking and hospitable.',
    'Reading books is one of the best habits you can develop. Books open up new worlds and expand your knowledge. A well-read person is better equipped to face life\'s challenges.',
    'Health is wealth, as the old saying goes. Exercise regularly, eat nutritious food, and get enough sleep. Taking care of your body is an investment in your future.',
    'The sun rises in the east and sets in the west. Every day brings new opportunities and challenges. Make the most of each moment and strive to become a better version of yourself.',
    'Programming is the art of telling a computer what to do. It requires logical thinking, patience, and creativity. Learning to code is one of the most valuable skills in today\'s digital world.'
  ]
};

// ===== STATE =====
const state = {
  lang: 'bn',
  mode: 'time',
  timeLimit: 60,
  targetText: '',
  typedText: '',
  startTime: null,
  timerInterval: null,
  timeLeft: 60,
  isRunning: false,
  isFinished: false,
  correctChars: 0,
  incorrectChars: 0,
  totalTyped: 0,
  customText: null,
  lbLang: 'bn'
};

// ===== DOM REFS =====
const $id = id => document.getElementById(id);
const textDisplay = $id('textDisplay');
const typingInput = $id('typingInput');
const timerDisplay = $id('timerDisplay');
const wpmDisplay = $id('wpmDisplay');
const accuracyDisplay = $id('accuracyDisplay');
const correctDisplay = $id('correctDisplay');
const errorDisplay = $id('errorDisplay');
const startBtn = $id('startBtn');
const resetBtn = $id('resetBtn');
const newTextBtn = $id('newTextBtn');
const resultModal = $id('resultModal');
const leaderboardModal = $id('leaderboardModal');
const offlineBanner = $id('offlineBanner');

// ===== INIT =====
function init() {
  loadTheme();
  loadLang();
  loadNewText();
  bindEvents();
  checkOffline();
}

// ===== EVENTS =====
function bindEvents() {
  // Language tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.lang = btn.dataset.lang;
      saveLang();
      resetAll();
      loadNewText();
    });
  });

  // Mode/Timer tabs
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      state.timeLimit = parseInt(btn.dataset.time || 60);
      resetAll();
    });
  });

  // Typing input
  typingInput.addEventListener('input', onInput);
  typingInput.addEventListener('keydown', e => {
    if (!state.isRunning && !state.isFinished && e.key.length === 1) startTyping();
  });
  typingInput.addEventListener('paste', e => e.preventDefault());

  // Buttons
  startBtn.addEventListener('click', startTyping);
  resetBtn.addEventListener('click', resetAll);
  newTextBtn.addEventListener('click', () => { resetAll(); loadNewText(); });

  // Custom text
  $id('customTextBtn').addEventListener('click', () => {
    $id('customTextPanel').classList.toggle('hidden');
  });
  $id('useCustomText').addEventListener('click', useCustomText);
  $id('cancelCustomText').addEventListener('click', () => {
    $id('customTextPanel').classList.add('hidden');
  });

  // Result modal
  $id('retryBtn').addEventListener('click', () => {
    resultModal.classList.add('hidden');
    resetAll();
  });
  $id('closeResultBtn').addEventListener('click', () => {
    resultModal.classList.add('hidden');
    resetAll();
  });

  // Leaderboard
  $id('leaderboardBtn').addEventListener('click', openLeaderboard);
  $id('closeLeaderboard').addEventListener('click', () => leaderboardModal.classList.add('hidden'));
  $id('clearScores').addEventListener('click', clearScores);
  document.querySelectorAll('.lb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.lbLang = tab.dataset.lb;
      renderLeaderboard();
    });
  });

  // Theme
  $id('themeToggle').addEventListener('click', toggleTheme);

  // Offline
  window.addEventListener('online', () => offlineBanner.classList.add('hidden'));
  window.addEventListener('offline', () => offlineBanner.classList.remove('hidden'));

  // URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('lang') === 'en') {
    document.querySelector('[data-lang="en"]').click();
  }
}

// ===== LOAD TEXT =====
function loadNewText() {
  if (state.customText) {
    state.targetText = state.customText;
  } else {
    const pool = TEXTS[state.lang];
    state.targetText = pool[Math.floor(Math.random() * pool.length)];
  }
  renderTextDisplay();
}

function renderTextDisplay() {
  textDisplay.innerHTML = '';
  for (let i = 0; i < state.targetText.length; i++) {
    const span = document.createElement('span');
    span.classList.add('char');
    span.textContent = state.targetText[i];
    if (i === 0) span.classList.add('current');
    textDisplay.appendChild(span);
  }
  typingInput.value = '';
  state.typedText = '';
}

// ===== START TYPING =====
function startTyping() {
  if (state.isRunning || state.isFinished) return;
  state.isRunning = true;
  state.startTime = Date.now();
  typingInput.disabled = false;
  typingInput.focus();
  startBtn.classList.add('hidden');
  resetBtn.classList.remove('hidden');

  if (state.mode === 'time') {
    state.timeLeft = state.timeLimit;
    updateTimerDisplay();
    state.timerInterval = setInterval(tick, 1000);
  } else {
    timerDisplay.textContent = '∞';
  }
}

function tick() {
  state.timeLeft--;
  updateTimerDisplay();
  if (state.timeLeft <= 0) finish();
}

function updateTimerDisplay() {
  timerDisplay.textContent = state.timeLeft;
  if (state.timeLeft <= 10) timerDisplay.style.color = 'var(--error)';
  else timerDisplay.style.color = '';
}

// ===== INPUT HANDLER =====
function onInput(e) {
  if (!state.isRunning) return;
  const val = typingInput.value;
  state.typedText = val;
  updateChars(val);
  updateStats();

  // Words mode: finish when all typed
  if (state.mode === 'words' && val.length >= state.targetText.length) {
    finish();
  }
}

function updateChars(typed) {
  const chars = textDisplay.querySelectorAll('.char');
  let correct = 0, incorrect = 0;

  chars.forEach((span, i) => {
    span.classList.remove('correct', 'incorrect', 'current');
    if (i < typed.length) {
      if (typed[i] === state.targetText[i]) {
        span.classList.add('correct');
        correct++;
      } else {
        span.classList.add('incorrect');
        incorrect++;
      }
    } else if (i === typed.length) {
      span.classList.add('current');
    }
  });
  state.correctChars = correct;
  state.incorrectChars = incorrect;
  state.totalTyped = typed.length;
}

function updateStats() {
  const elapsed = (Date.now() - state.startTime) / 60000; // minutes
  const wpm = elapsed > 0 ? Math.round((state.correctChars / 5) / elapsed) : 0;
  const accuracy = state.totalTyped > 0
    ? Math.round((state.correctChars / state.totalTyped) * 100)
    : 100;

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy;
  correctDisplay.textContent = state.correctChars;
  errorDisplay.textContent = state.incorrectChars;

  // Pulse effect
  wpmDisplay.closest('.stat-item').classList.remove('pulse');
  void wpmDisplay.closest('.stat-item').offsetWidth;
  wpmDisplay.closest('.stat-item').classList.add('pulse');
}

// ===== FINISH =====
function finish() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.isRunning = false;
  state.isFinished = true;
  typingInput.disabled = true;

  const elapsed = (Date.now() - state.startTime) / 60000;
  const wpm = elapsed > 0 ? Math.round((state.correctChars / 5) / elapsed) : 0;
  const accuracy = state.totalTyped > 0
    ? Math.round((state.correctChars / state.totalTyped) * 100)
    : 100;
  const timeUsed = Math.round((Date.now() - state.startTime) / 1000);
  const score = Math.round(wpm * (accuracy / 100) * 10);

  showResult({ wpm, accuracy, timeUsed, score, errors: state.incorrectChars, words: Math.round(state.correctChars / 5) });
  saveScore({ wpm, accuracy, score, lang: state.lang, date: new Date().toLocaleDateString('bn-BD') });
}

// ===== RESULT MODAL =====
function showResult({ wpm, accuracy, timeUsed, score, errors, words }) {
  $id('finalWpm').textContent = wpm;
  $id('finalAccuracy').textContent = accuracy + '%';
  $id('finalTime').textContent = timeUsed + 's';
  $id('finalScore').textContent = score;
  $id('finalErrors').textContent = errors;
  $id('finalWords').textContent = words;

  // Performance rating
  let label, stars;
  if (wpm >= 60 && accuracy >= 95) { label = '🌟 অসাধারণ!'; stars = '⭐⭐⭐⭐⭐'; }
  else if (wpm >= 40 && accuracy >= 90) { label = '🎉 চমৎকার!'; stars = '⭐⭐⭐⭐'; }
  else if (wpm >= 25 && accuracy >= 80) { label = '👍 ভালো!'; stars = '⭐⭐⭐'; }
  else if (wpm >= 15) { label = '💪 চেষ্টা চালিয়ে যাও!'; stars = '⭐⭐'; }
  else { label = '🌱 অনুশীলন করতে থাকো!'; stars = '⭐'; }

  $id('perfLabel').textContent = label;
  $id('perfStars').textContent = stars;
  resultModal.classList.remove('hidden');
}

// ===== RESET =====
function resetAll() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.isRunning = false;
  state.isFinished = false;
  state.startTime = null;
  state.correctChars = 0;
  state.incorrectChars = 0;
  state.totalTyped = 0;
  state.typedText = '';
  state.timeLeft = state.timeLimit;

  typingInput.disabled = false;
  typingInput.value = '';
  timerDisplay.textContent = state.mode === 'time' ? state.timeLimit : '∞';
  timerDisplay.style.color = '';
  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '100';
  correctDisplay.textContent = '0';
  errorDisplay.textContent = '0';

  startBtn.classList.remove('hidden');
  resetBtn.classList.add('hidden');
  renderTextDisplay();
}

// ===== CUSTOM TEXT =====
function useCustomText() {
  const txt = $id('customTextInput').value.trim();
  if (!txt || txt.length < 10) {
    alert('অনুগ্রহ করে কমপক্ষে ১০ অক্ষরের টেক্সট দিন।');
    return;
  }
  state.customText = txt;
  $id('customTextPanel').classList.add('hidden');
  resetAll();
  loadNewText();
}

// ===== LEADERBOARD =====
function saveScore({ wpm, accuracy, score, lang, date }) {
  const key = `tj_scores_${lang}`;
  const scores = JSON.parse(localStorage.getItem(key) || '[]');
  scores.push({ wpm, accuracy, score, date });
  scores.sort((a, b) => b.score - a.score);
  scores.splice(10); // top 10
  localStorage.setItem(key, JSON.stringify(scores));
}

function openLeaderboard() {
  state.lbLang = state.lang;
  document.querySelectorAll('.lb-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.lb === state.lbLang);
  });
  renderLeaderboard();
  leaderboardModal.classList.remove('hidden');
}

function renderLeaderboard() {
  const key = `tj_scores_${state.lbLang}`;
  const scores = JSON.parse(localStorage.getItem(key) || '[]');
  const list = $id('leaderboardList');
  if (!scores.length) {
    list.innerHTML = '<p class="empty-msg">এখনো কোনো স্কোর নেই। টাইপিং শুরু করুন!</p>';
    return;
  }
  const rankClass = ['gold', 'silver', 'bronze'];
  const rankEmoji = ['🥇', '🥈', '🥉'];
  list.innerHTML = scores.map((s, i) => `
    <div class="lb-entry">
      <span class="lb-rank ${rankClass[i] || ''}">${i < 3 ? rankEmoji[i] : (i + 1)}</span>
      <div class="lb-data">
        <div class="lb-wpm">${s.wpm} WPM</div>
        <div class="lb-meta">নির্ভুলতা: ${s.accuracy}% &nbsp;|&nbsp; ${s.date}</div>
      </div>
      <span class="lb-score">${s.score} pts</span>
    </div>
  `).join('');
}

function clearScores() {
  if (!confirm('সব স্কোর মুছে ফেলবেন?')) return;
  localStorage.removeItem(`tj_scores_${state.lbLang}`);
  renderLeaderboard();
}

// ===== THEME =====
function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? '' : 'dark';
  $id('themeToggle').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('tj_theme', isDark ? 'light' : 'dark');
}

function loadTheme() {
  const theme = localStorage.getItem('tj_theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    $id('themeToggle').textContent = '☀️';
  }
}

// ===== LANG PREFERENCE =====
function saveLang() { localStorage.setItem('tj_lang', state.lang); }
function loadLang() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang') || localStorage.getItem('tj_lang') || 'bn';
  state.lang = lang;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// ===== OFFLINE CHECK =====
function checkOffline() {
  if (!navigator.onLine) offlineBanner.classList.remove('hidden');
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
