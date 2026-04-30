// State management
let state = {
    total: 0,
    correct: 0,
    currentAnswer: 0
};

// DOM Elements
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const checkBtn = document.getElementById('check-btn');
const statTotal = document.getElementById('stat-total');
const statCorrect = document.getElementById('stat-correct');
const statPercent = document.getElementById('stat-percent');

// Settings Elements
const opAddition = document.getElementById('op-addition');
const opSubtraction = document.getElementById('op-subtraction');
const opMultiplication = document.getElementById('op-multiplication');
const opNegatives = document.getElementById('op-negatives');
const minValSelect = document.getElementById('min-val');
const maxValSelect = document.getElementById('max-val');

// Tab logic
const tabPractice = document.getElementById('tab-practice');
const tabSettings = document.getElementById('tab-settings');
const practiceView = document.getElementById('practice-view');
const settingsView = document.getElementById('settings-view');

const switchTab = (target) => {
    const isPractice = target === 'practice';
    tabPractice.classList.toggle('active', isPractice);
    tabSettings.classList.toggle('active', !isPractice);
    practiceView.classList.toggle('hidden', !isPractice);
    settingsView.classList.toggle('hidden', isPractice);
    if (isPractice) answerInput.focus();
};

tabPractice.addEventListener('click', () => switchTab('practice'));
tabSettings.addEventListener('click', () => switchTab('settings'));

function validateSelections() {
    if (!opAddition.checked && !opSubtraction.checked && !opMultiplication.checked) {
        opAddition.checked = true;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    validateSelections();

    const min = parseInt(minValSelect.value);
    const max = parseInt(maxValSelect.value);
    
    let firstNum = getRandomInt(min, max);
    let secondNum = getRandomInt(min, max);

    if (opNegatives.checked) {
        if (Math.random() > 0.5) firstNum *= -1;
        if (Math.random() > 0.5) secondNum *= -1;
    }

    const activeOps = [];
    if (opAddition.checked) activeOps.push('+');
    if (opSubtraction.checked) activeOps.push('-');
    if (opMultiplication.checked) activeOps.push('*');

    const sign = activeOps[Math.floor(Math.random() * activeOps.length)];

    if (sign === '+') {
        state.currentAnswer = firstNum + secondNum;
        questionText.textContent = `${firstNum} + ${secondNum} =`;
    } else if (sign === '-') {
        state.currentAnswer = firstNum - secondNum;
        questionText.textContent = `${firstNum} - ${secondNum} =`;
    } else {
        state.currentAnswer = firstNum * secondNum;
        questionText.textContent = `${firstNum} × ${secondNum} =`;
    }

    answerInput.value = "";
    answerInput.focus();
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    if (isNaN(userAnswer)) return;

    state.total++;
    const isCorrect = userAnswer === state.currentAnswer;
    
    if (isCorrect) {
        state.correct++;
        questionText.style.color = "var(--success-color)";
    } else {
        questionText.style.color = "var(--error-color)";
    }

    setTimeout(() => { 
        questionText.style.color = "var(--text-color)"; 
    }, 500);

    updateStats();
    generateQuestion();
}

function updateStats() {
    statTotal.textContent = state.total;
    statCorrect.textContent = state.correct;
    const percent = state.total === 0 ? 0 : (state.correct / state.total * 100);
    statPercent.textContent = percent.toFixed(2) + "%";
}

// Event Listeners
checkBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

[opAddition, opSubtraction, opMultiplication].forEach(el => {
    el.addEventListener('change', validateSelections);
});

// Initialize
generateQuestion();
updateStats();
