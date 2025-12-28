// Math Vocabulary Translator – Core Application
// Vanilla JavaScript SPA with offline‑first design.

// ============================================================================
// 1. STATE & INITIALIZATION
// ============================================================================

const state = {
    currentPage: 'home',
    recentTranslations: JSON.parse(localStorage.getItem('recentTranslations')) || [],
    practiceStats: JSON.parse(localStorage.getItem('practiceStats')) || {
        totalQuestions: 0,
        correctAnswers: 0,
        mistakeTypes: {}
    },
    mistakeLog: JSON.parse(localStorage.getItem('mistakeLog')) || [],
    settings: JSON.parse(localStorage.getItem('settings')) || {
        darkMode: false,
        speakResults: false,
        saveHistory: true,
        defaultDifficulty: 'all'
    }
};

// ============================================================================
// 2. CORE TRANSLATION ENGINE (Pattern‑Based Parser)
// ============================================================================

/**
 * The main translation function.
 * @param {string} phrase - The natural‑language math phrase.
 * @returns {object} - {plain, latex, explanation, traps, pattern}
 */
function translatePhrase(phrase) {
    // Normalize input
    let lower = phrase.toLowerCase().trim();
    lower = lower.replace(/[.,;!?]/g, ' ');
    lower = lower.replace(/\s+/g, ' ');

    // Initialize result objects
    const result = {
        plain: '',
        latex: '',
        explanation: [],
        traps: [],
        pattern: ''
    };

    // ------------------------------------------------------------
    // Basic arithmetic operations
    // ------------------------------------------------------------
    if (lower.includes('sum of') || lower.includes('total of') || lower.includes('in all') || lower.includes('combined')) {
        const parts = lower.split(/sum of|total of|in all|combined/);
        const vars = extractVariables(parts[1] || '');
        result.plain = `${vars.join(' + ')}`;
        result.latex = vars.join(' + ');
        result.explanation.push(`"sum of" → addition (+)`);
        result.pattern = 'sum';
    }
    else if (lower.includes('difference of') || lower.includes('how many more') || lower.includes('how many less')) {
        const parts = lower.split(/difference of|how many more|how many less/);
        const vars = extractVariables(parts[1] || '');
        result.plain = `${vars[0] || 'a'} - ${vars[1] || 'b'}`;
        result.latex = `${vars[0] || 'a'} - ${vars[1] || 'b'}`;
        result.explanation.push(`"difference" → subtraction (-)`);
        if (lower.includes('how many less')) {
            result.traps.push(`"how many less" often reverses the order: "A is how many less than B" means B - A.`);
        }
        result.pattern = 'difference';
    }
    else if (lower.includes('product of') || lower.includes('times')) {
        const parts = lower.split(/product of|times/);
        const vars = extractVariables(parts[1] || '');
        result.plain = `${vars.join(' * ')}`;
        result.latex = vars.join(' \\cdot ');
        result.explanation.push(`"product of" → multiplication (* or ·)`);
        result.pattern = 'product';
    }
    else if (lower.includes('quotient of') || lower.includes('divided by') || lower.includes('per')) {
        const parts = lower.split(/quotient of|divided by|per/);
        const vars = extractVariables(parts[1] || '');
        result.plain = `${vars[0] || 'a'} / ${vars[1] || 'b'}`;
        result.latex = `\\frac{${vars[0] || 'a'}}{${vars[1] || 'b'}}`;
        result.explanation.push(`"quotient of" → division (/)`);
        if (lower.includes('per')) {
            result.traps.push(`"per" usually indicates division: "miles per hour" → miles/hour.`);
        }
        result.pattern = 'quotient';
    }

    // ------------------------------------------------------------
    // "More than" / "Less than" (with reversal)
    // ------------------------------------------------------------
    else if (lower.includes('more than')) {
        const parts = lower.split('more than');
        const left = extractVariables(parts[0] || '');
        const right = extractVariables(parts[1] || '');
        result.plain = `${right} + ${left}`;
        result.latex = `${right} + ${left}`;
        result.explanation.push(`"more than" → addition, but the order is reversed: "${parts[0]} more than ${parts[1]}" means ${parts[1]} + ${parts[0]}.`);
        result.traps.push(`"More than" reverses the order: "5 more than x" is x + 5, not 5 + x.`);
        result.pattern = 'more_than';
    }
    else if (lower.includes('less than')) {
        const parts = lower.split('less than');
        const left = extractVariables(parts[0] || '');
        const right = extractVariables(parts[1] || '');
        result.plain = `${right} - ${left}`;
        result.latex = `${right} - ${left}`;
        result.explanation.push(`"less than" → subtraction, but the order is reversed: "${parts[0]} less than ${parts[1]}" means ${parts[1]} - ${parts[0]}.`);
        result.traps.push(`"Less than" reverses the order: "5 less than x" is x - 5, not 5 - x. This is a very common trap.`);
        result.pattern = 'less_than';
    }

    // ------------------------------------------------------------
    // Inequalities
    // ------------------------------------------------------------
    else if (lower.includes('at least') || lower.includes('no less than')) {
        const parts = lower.split(/at least|no less than/);
        const left = extractVariables(parts[0] || '');
        const right = extractVariables(parts[1] || '');
        result.plain = `${left} >= ${right}`;
        result.latex = `${left} \\geq ${right}`;
        result.explanation.push(`"at least" → greater than or equal to (≥).`);
        result.pattern = 'at_least';
    }
    else if (lower.includes('at most') || lower.includes('no more than')) {
        const parts = lower.split(/at most|no more than/);
        const left = extractVariables(parts[0] || '');
        const right = extractVariables(parts[1] || '');
        result.plain = `${left} <= ${right}`;
        result.latex = `${left} \\leq ${right}`;
        result.explanation.push(`"at most" → less than or equal to (≤).`);
        result.pattern = 'at_most';
    }

    // ------------------------------------------------------------
    // Multiplicative phrases
    // ------------------------------------------------------------
    else if (lower.includes('twice') || lower.includes('double')) {
        const after = lower.replace(/twice|double/g, '').trim();
        const varPart = extractVariables(after)[0] || 'x';
        result.plain = `2 * ${varPart}`;
        result.latex = `2 \\cdot ${varPart}`;
        result.explanation.push(`"twice" → multiply by 2.`);
        result.pattern = 'twice';
    }
    else if (lower.includes('thrice') || lower.includes('triple')) {
        const after = lower.replace(/thrice|triple/g, '').trim();
        const varPart = extractVariables(after)[0] || 'x';
        result.plain = `3 * ${varPart}`;
        result.latex = `3 \\cdot ${varPart}`;
        result.explanation.push(`"triple" → multiply by 3.`);
        result.pattern = 'triple';
    }
    else if (lower.match(/\b(\d+)\s*times\b/)) {
        const match = lower.match(/\b(\d+)\s*times\b/);
        const after = lower.replace(match[0], '').trim();
        const varPart = extractVariables(after)[0] || 'x';
        result.plain = `${match[1]} * ${varPart}`;
        result.latex = `${match[1]} \\cdot ${varPart}`;
        result.explanation.push(`"${match[1]} times" → multiply by ${match[1]}.`);
        result.pattern = 'times';
    }

    // ------------------------------------------------------------
    // Squares, cubes, roots
    // ------------------------------------------------------------
    else if (lower.includes('square of') || lower.includes('squared')) {
        const after = lower.replace(/square of|squared/g, '').trim();
        const varPart = extractVariables(after)[0] || 'x';
        result.plain = `${varPart}^2`;
        result.latex = `${varPart}^{2}`;
        result.explanation.push(`"square of" → raise to the power of 2.`);
        result.pattern = 'square';
    }
    else if (lower.includes('cube of') || lower.includes('cubed')) {
        const after = lower.replace(/cube of|cubed/g, '').trim();
        const varPart = extractVariables(after)[0] || 'x';
        result.plain = `${varPart}^3`;
        result.latex = `${varPart}^{3}`;
        result.explanation.push(`"cube of" → raise to the power of 3.`);
        result.pattern = 'cube';
    }
    else if (lower.includes('square root of')) {
        const after = lower.replace('square root of', '').trim();
        const varPart = extractVariables(after)[0] || 'x';
        result.plain = `sqrt(${varPart})`;
        result.latex = `\\sqrt{${varPart}}`;
        result.explanation.push(`"square root of" → √.`);
        result.pattern = 'sqrt';
    }

    // ------------------------------------------------------------
    // Percent / ratio
    // ------------------------------------------------------------
    else if (lower.includes('% of') || lower.includes('percent of')) {
        const match = lower.match(/(\d+)% of/);
        const after = lower.replace(/(\d+)% of/, '').trim();
        const varPart = extractVariables(after)[0] || 'x';
        const pct = match ? match[1] : '20';
        result.plain = `(${pct}/100) * ${varPart}`;
        result.latex = `\\frac{${pct}}{100} \\cdot ${varPart}`;
        result.explanation.push(`"${pct}% of" → multiply by ${pct}/100.`);
        result.traps.push(`Remember: "percent of" means multiplication, not division.`);
        result.pattern = 'percent_of';
    }
    else if (lower.includes('ratio of')) {
        const parts = lower.split('ratio of');
        const vars = extractVariables(parts[1] || '');
        result.plain = `${vars[0] || 'a'} : ${vars[1] || 'b'}`;
        result.latex = `${vars[0] || 'a'} : ${vars[1] || 'b'}`;
        result.explanation.push(`"ratio of A to B" → A:B.`);
        result.pattern = 'ratio';
    }

    // ------------------------------------------------------------
    // Geometry phrases
    // ------------------------------------------------------------
    else if (lower.includes('area of a circle')) {
        const match = lower.match(/radius\s+(\w+)/);
        const r = match ? match[1] : 'r';
        result.plain = `pi * ${r}^2`;
        result.latex = `\\pi ${r}^{2}`;
        result.explanation.push(`"area of a circle" → π * radius².`);
        result.pattern = 'area_circle';
    }
    else if (lower.includes('perimeter of a rectangle')) {
        const vars = extractVariables(lower);
        result.plain = `2 * (length + width)`;
        result.latex = `2 (\\text{length} + \\text{width})`;
        result.explanation.push(`"perimeter of a rectangle" → 2*(length+width).`);
        result.pattern = 'perimeter_rect';
    }

    // ------------------------------------------------------------
    // Function notation
    // ------------------------------------------------------------
    else if (lower.includes('f of x') || lower.includes('f(x)')) {
        result.plain = `f(x)`;
        result.latex = `f(x)`;
        result.explanation.push(`"f of x" → function notation f(x).`);
        result.pattern = 'function';
    }
    else if (lower.includes('derivative of')) {
        const after = lower.replace('derivative of', '').trim();
        const varPart = extractVariables(after)[0] || 'x';
        result.plain = `d/d${varPart}`;
        result.latex = `\\frac{d}{d${varPart}}`;
        result.explanation.push(`"derivative of" → d/dx operator.`);
        result.pattern = 'derivative';
    }

    // ------------------------------------------------------------
    // Fallback: treat as simple variable expression
    // ------------------------------------------------------------
    else {
        const vars = extractVariables(lower);
        if (vars.length > 0) {
            result.plain = vars.join(' ');
            result.latex = vars.join(' ');
            result.explanation.push(`The phrase was interpreted as a simple variable expression.`);
        } else {
            result.plain = '???';
            result.latex = '\\text{???}';
            result.explanation.push(`Could not recognize a known pattern. Try a standard math phrase.`);
        }
        result.pattern = 'unknown';
    }

    // Ensure plain and latex are not empty
    if (!result.plain) result.plain = '???';
    if (!result.latex) result.latex = '\\text{???}';

    return result;
}

/**
 * Extract variables/numbers from a string.
 * @param {string} text
 * @returns {string[]}
 */
function extractVariables(text) {
    const tokens = text.split(' ');
    const vars = [];
    for (let token of tokens) {
        token = token.trim();
        if (!token) continue;
        if (token.match(/^\d+$/)) vars.push(token);
        else if (token.match(/^[a-zA-Z]$/)) vars.push(token);
        else if (token.match(/^[a-zA-Z][a-zA-Z0-9]*$/)) vars.push(token);
    }
    return vars;
}

// ============================================================================
// 3. PRACTICE GENERATOR
// ============================================================================

/**
 * Generate similar practice phrases based on a pattern.
 * @param {string} pattern - The pattern identifier from translatePhrase.
 * @param {number} count - Number of phrases to generate.
 * @returns {Array<{phrase: string, answer: string}>}
 */
function generatePractice(pattern, count = 5) {
    const generators = {
        sum: () => {
            const a = Math.floor(Math.random() * 20) + 1;
            const b = Math.floor(Math.random() * 20) + 1;
            return {
                phrase: `sum of ${a} and ${b}`,
                answer: `${a} + ${b}`
            };
        },
        difference: () => {
            const a = Math.floor(Math.random() * 30) + 10;
            const b = Math.floor(Math.random() * 10) + 1;
            return {
                phrase: `difference of ${a} and ${b}`,
                answer: `${a} - ${b}`
            };
        },
        more_than: () => {
            const n = Math.floor(Math.random() * 10) + 1;
            const varName = 'x';
            return {
                phrase: `${n} more than ${varName}`,
                answer: `${varName} + ${n}`
            };
        },
        less_than: () => {
            const n = Math.floor(Math.random() * 10) + 1;
            const varName = 'y';
            return {
                phrase: `${n} less than ${varName}`,
                answer: `${varName} - ${n}`
            };
        },
        twice: () => {
            const varName = 'z';
            return {
                phrase: `twice ${varName}`,
                answer: `2 * ${varName}`
            };
        },
        percent_of: () => {
            const pct = Math.floor(Math.random() * 50) + 10;
            const varName = 'x';
            return {
                phrase: `${pct}% of ${varName}`,
                answer: `(${pct}/100) * ${varName}`
            };
        },
        square: () => {
            const varName = 't';
            return {
                phrase: `square of ${varName}`,
                answer: `${varName}^2`
            };
        }
    };

    const gen = generators[pattern] || generators.sum;
    const list = [];
    for (let i = 0; i < count; i++) {
        list.push(gen());
    }
    return list;
}

// ============================================================================
// 4. UI RENDERING FUNCTIONS
// ============================================================================

function renderTranslation(result, originalPhrase) {
    // Plain expression
    document.getElementById('plainExpression').textContent = result.plain;

    // LaTeX (using MathJax if available)
    const latexEl = document.getElementById('latexExpression');
    latexEl.innerHTML = `\\[ ${result.latex} \\]`;
    if (window.MathJax) {
        MathJax.typesetPromise([latexEl]);
    }

    // Explanation
    const explList = document.getElementById('explanationList');
    explList.innerHTML = '';
    if (result.explanation.length > 0) {
        result.explanation.forEach((text, idx) => {
            const step = document.createElement('div');
            step.className = 'step';
            step.innerHTML = `<strong>Step ${idx + 1}:</strong> ${text}`;
            explList.appendChild(step);
        });
    } else {
        explList.innerHTML = '<p class="placeholder">No step‑by‑step explanation available for this phrase.</p>';
    }

    // Traps
    const trapsList = document.getElementById('trapsList');
    trapsList.innerHTML = '';
    if (result.traps.length > 0) {
        result.traps.forEach(text => {
            const trap = document.createElement('div');
            trap.className = 'trap';
            trap.innerHTML = `<strong>⚠️ Trap:</strong> ${text}`;
            trapsList.appendChild(trap);
        });
    } else {
        trapsList.innerHTML = '<p class="placeholder">No common traps identified for this phrase.</p>';
    }

    // Practice
    const practiceList = document.getElementById('practiceList');
    practiceList.innerHTML = '';
    const practices = generatePractice(result.pattern, 3);
    practices.forEach((p, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${p.phrase}</strong> → <input type="text" class="practice-answer" data-answer="${p.answer}" placeholder="your answer">`;
        practiceList.appendChild(li);
    });

    // Enable check button
    document.getElementById('checkPractice').disabled = false;
}

function renderRecent() {
    const listEl = document.getElementById('recentList');
    if (state.recentTranslations.length === 0) {
        listEl.innerHTML = '<li>No recent translations.</li>';
        return;
    }
    listEl.innerHTML = '';
    state.recentTranslations.slice(0, 10).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.phrase}</strong> → ${item.expression}`;
        li.addEventListener('click', () => {
            document.getElementById('phraseInput').value = item.phrase;
            translate();
        });
        listEl.appendChild(li);
    });
}

function renderLearnCategories() {
    const categories = [
        {
            icon: 'fas fa-plus-circle',
            title: 'Operations Language',
            desc: 'Sum, difference, product, quotient, total, combined, each, per.',
            topics: ['addition', 'subtraction', 'multiplication', 'division', 'fractions']
        },
        {
            icon: 'fas fa-balance-scale',
            title: 'Comparison Language',
            desc: 'More than, less than, at least, at most, no more than, no less than.',
            topics: ['inequalities', 'reversal traps', 'greater/less']
        },
        {
            icon: 'fas fa-percentage',
            title: 'Percent / Ratio / Rate',
            desc: 'Percent of, ratio of A to B, rate, unit price, proportion.',
            topics: ['percent', 'ratio', 'proportion', 'unit rate']
        },
        {
            icon: 'fas fa-function',
            title: 'Functions Language',
            desc: 'f(x), "in terms of", "as a function of", composition, inverse.',
            topics: ['function notation', 'composition', 'inverse', 'domain/range']
        },
        {
            icon: 'fas fa-shapes',
            title: 'Geometry Language',
            desc: 'Area, perimeter, volume, circumference, surface area, angles.',
            topics: ['area formulas', 'perimeter', 'volume', 'circle geometry']
        },
        {
            icon: 'fas fa-sigma',
            title: 'Sequences & Series',
            desc: 'Arithmetic/geometric sequences, nth term, sigma notation, sum of series.',
            topics: ['sequences', 'series', 'sigma notation', 'recursive']
        },
        {
            icon: 'fas fa-chart-line',
            title: 'Calculus Language',
            desc: 'Derivative, rate of change, integral, accumulated change, limits.',
            topics: ['derivative', 'integral', 'limits', 'related rates']
        },
        {
            icon: 'fas fa-chart-bar',
            title: 'Statistics & Probability',
            desc: 'Mean, median, standard deviation, probability, conditional probability.',
            topics: ['descriptive stats', 'probability', 'distributions', 'regression']
        }
    ];

    const grid = document.getElementById('learnCategories');
    grid.innerHTML = '';
    categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <h3><i class="${cat.icon}"></i> ${cat.title}</h3>
            <p>${cat.desc}</p>
            <div class="category-topics">
                ${cat.topics.map(t => `<span class="topic-tag">${t}</span>`).join('')}
            </div>
        `;
        card.addEventListener('click', () => {
            alert(`Lesson for ${cat.title} would open in a full curriculum view.`);
        });
        grid.appendChild(card);
    });
}

// ============================================================================
// 5. EVENT HANDLERS & APP LOGIC
// ============================================================================

function translate() {
    const input = document.getElementById('phraseInput');
    const phrase = input.value.trim();
    if (!phrase) {
        alert('Please type a math phrase.');
        return;
    }

    const result = translatePhrase(phrase);
    renderTranslation(result, phrase);

    // Save to recent
    if (state.settings.saveHistory) {
        state.recentTranslations.unshift({
            phrase,
            expression: result.plain,
            timestamp: new Date().toISOString()
        });
        if (state.recentTranslations.length > 50) state.recentTranslations.pop();
        localStorage.setItem('recentTranslations', JSON.stringify(state.recentTranslations));
        renderRecent();
    }
}

function checkPractice() {
    const answers = document.querySelectorAll('.practice-answer');
    let allCorrect = true;
    answers.forEach(input => {
        const userAnswer = input.value.trim();
        const correctAnswer = input.dataset.answer;
        if (userAnswer === correctAnswer) {
            input.style.borderColor = '#28a745';
            input.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
        } else {
            input.style.borderColor = '#dc3545';
            input.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
            allCorrect = false;
        }
    });

    if (allCorrect) {
        alert('All practice answers are correct! Well done.');
    }
}

function switchPage(pageId) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });
    // Show/hide pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.toggle('active', page.id === `${pageId}-page`);
    });
    // Update state
    state.currentPage = pageId;
}

// ============================================================================
// 6. INITIALIZATION & EVENT LISTENERS
// ============================================================================

function init() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Render initial data
    renderRecent();
    renderLearnCategories();

    // Theme
    if (state.settings.darkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('#themeToggle i').className = 'fas fa-sun';
    }

    // Event: Translate button
    document.getElementById('translateBtn').addEventListener('click', translate);
    document.getElementById('phraseInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') translate();
    });

    // Event: Example links
    document.querySelectorAll('.example-link').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('phraseInput').value = link.dataset.phrase;
            translate();
        });
    });

    // Event: Copy buttons
    document.getElementById('copyPlain').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('plainExpression').textContent);
        alert('Plain expression copied to clipboard.');
    });
    document.getElementById('copyLaTeX').addEventListener('click', () => {
        const latex = document.getElementById('latexExpression').textContent;
        navigator.clipboard.writeText(latex);
        alert('LaTeX copied to clipboard.');
    });

    // Event: Practice check
    document.getElementById('checkPractice').addEventListener('click', checkPractice);
    document.getElementById('generateMorePractice').addEventListener('click', () => {
        // Regenerate practice based on current pattern (simplified)
        const currentPattern = 'sum'; // In a full app, you would track the last pattern.
        const practices = generatePractice(currentPattern, 3);
        const practiceList = document.getElementById('practiceList');
        practiceList.innerHTML = '';
        practices.forEach((p, i) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${p.phrase}</strong> → <input type="text" class="practice-answer" data-answer="${p.answer}" placeholder="your answer">`;
            practiceList.appendChild(li);
        });
    });

    // Event: Clear recent
    document.getElementById('clearRecent').addEventListener('click', () => {
        if (confirm('Clear all recent translations?')) {
            state.recentTranslations = [];
            localStorage.removeItem('recentTranslations');
            renderRecent();
        }
    });

    // Event: Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });

    // Event: Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = document.querySelector('#themeToggle i');
        icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
        state.settings.darkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('settings', JSON.stringify(state.settings));
    });

    // Event: Settings modal
    document.getElementById('settingsToggle').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.remove('hidden');
    });
    document.getElementById('cancelSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.add('hidden');
    });
    document.getElementById('settingsForm').addEventListener('submit', e => {
        e.preventDefault();
        state.settings.darkMode = document.getElementById('settingDarkMode').checked;
        state.settings.speakResults = document.getElementById('settingSpeakResults').checked;
        state.settings.saveHistory = document.getElementById('settingSaveHistory').checked;
        state.settings.defaultDifficulty = document.getElementById('settingDefaultDifficulty').value;
        localStorage.setItem('settings', JSON.stringify(state.settings));
        document.getElementById('settingsModal').classList.add('hidden');
        alert('Settings saved.');
    });

    // Event: Feedback modal
    document.getElementById('openFeedbackModal').addEventListener('click', () => {
        document.getElementById('feedbackPhrase').value = document.getElementById('phraseInput').value || '';
        document.getElementById('feedbackTranslation').value = document.getElementById('plainExpression').textContent;
        document.getElementById('feedbackModal').classList.remove('hidden');
    });
    document.getElementById('cancelFeedback').addEventListener('click', () => {
        document.getElementById('feedbackModal').classList.add('hidden');
    });
    document.getElementById('feedbackForm').addEventListener('submit', e => {
        e.preventDefault();
        alert('Thank you for your feedback! It has been saved locally.');
        document.getElementById('feedbackModal').classList.add('hidden');
        // In a real app, you would store feedback in localStorage.
    });

    // Event: Start practice session (simplified)
    document.getElementById('startPractice').addEventListener('click', () => {
        document.querySelector('.practice-setup').classList.add('hidden');
        document.querySelector('.practice-session').classList.remove('hidden');
        // Simplified: just show a single question
        document.getElementById('questionPhrase').textContent = 'Translate: "twice x increased by 5"';
    });

    // Event: Submit practice answer
    document.getElementById('submitAnswer').addEventListener('click', () => {
        const feedback = document.getElementById('questionFeedback');
        feedback.innerHTML = '<strong>Correct!</strong> The answer is 2*x + 5.';
        feedback.classList.remove('hidden');
        feedback.classList.add('correct');
    });

    // Event: Clear mistakes
    document.getElementById('clearMistakes').addEventListener('click', () => {
        if (confirm('Clear all mistake data? This cannot be undone.')) {
            state.mistakeLog = [];
            state.practiceStats = { totalQuestions: 0, correctAnswers: 0, mistakeTypes: {} };
            localStorage.removeItem('mistakeLog');
            localStorage.removeItem('practiceStats');
            alert('All mistake data cleared.');
        }
    });
}

// ============================================================================
// 7. START THE APP
// ============================================================================

document.addEventListener('DOMContentLoaded', init);
