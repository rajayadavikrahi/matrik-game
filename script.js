/* =========================================================
   MINDRUSH
   Vanilla JavaScript Brain Game

   No libraries.
   No APIs.
   No backend.

   Everything is handled in this file.
========================================================= */

"use strict";


/* =========================================================
   1. CONSTANTS
========================================================= */

const STORAGE_KEY = "mindRushPlayer";

const OPTION_COUNT = 4;

const KEYBOARD_OPTIONS = ["1", "2", "3", "4"];

/*
    The reach-out time for Memory Numbers. Long enough
    to actually read ten digits, short enough that the
    rest of the round still fits inside 45 seconds.
*/

const MEMORY_SHOW_MS = 2200;

const URGENT_SECONDS = 10;


/* =========================================================
   2. GAME CONFIGURATION
========================================================= */

/*
    timed
        False means no clock. Practice is untimed.

    usesLives
        False means a wrong answer never ends the round.
*/

const GAME_CONFIG = {

    quick: {
        name: "Quick Math",
        icon: "⚡",
        time: 60,
        description: "Solve as many equations as possible.",
        timed: true,
        usesLives: true
    },

    snap: {
        name: "Mind Snap",
        icon: "🎯",
        time: 45,
        description: "Pick the correct answer.",
        timed: true,
        usesLives: true
    },

    rush: {
        name: "Number Rush",
        icon: "🚀",
        time: 30,
        description: "Build the longest streak.",
        timed: true,
        usesLives: true
    },

    memory: {
        name: "Memory Numbers",
        icon: "🧩",
        time: 45,
        description: "Remember number sequences.",
        timed: true,
        usesLives: true
    },

    practice: {
        name: "Practice Mode",
        icon: "📚",
        time: 0,
        description: "Practice without pressure.",
        timed: false,
        usesLives: false
    }

};


/* =========================================================
   3. GAME STATE
========================================================= */

function createGameState(mode) {

    const config = GAME_CONFIG[mode];

    return {

        active: true,

        mode: mode,

        timed: config.timed,

        usesLives: config.usesLives,

        score: 0,

        correct: 0,

        wrong: 0,

        streak: 0,

        bestStreak: 0,

        lives: 3,

        questionNumber: 0,

        timeLeft: config.time,

        totalTime: config.time,

        /*
            Absolute timestamp the round ends at.

            Deriving the remaining time from a deadline
            instead of subtracting a tenth of a second
            per tick means background tabs, throttled
            timers and floating point drift can no longer
            hand the player free seconds.
        */

        deadline: null,

        timer: null,

        questionAnswered: false,

        currentAnswer: null,

        currentQuestion: null,

        memorySequence: "",

        memoryShowing: false,

        memoryTimeout: null,

        nextQuestionTimeout: null

    };

}

let gameState = createGameState("quick");

gameState.active = false;


/* =========================================================
   4. PLAYER DATA
========================================================= */

const DEFAULT_PLAYER_DATA = {

    gamesPlayed: 0,

    bestScore: 0,

    totalCorrect: 0,

    totalQuestions: 0,

    bestStreak: 0,

    currentStreak: 0,

    xp: 0,

    level: 1,

    name: "Player",

    lastPlayedDate: null

};

let playerData = { ...DEFAULT_PLAYER_DATA };


/* =========================================================
   5. DOM ELEMENTS
========================================================= */

const homeScreen =
    document.getElementById("homeScreen");

const gameScreen =
    document.getElementById("gameScreen");

const resultScreen =
    document.getElementById("resultScreen");

const statsScreen =
    document.getElementById("statsScreen");

const profileScreen =
    document.getElementById("profileScreen");


const logoButton =
    document.getElementById("logoButton");

const quickPlayButton =
    document.getElementById("quickPlayButton");

const practiceButton =
    document.getElementById("practiceButton");

const profileButton =
    document.getElementById("profileButton");

const statsButton =
    document.getElementById("statsButton");

const navStreakButton =
    document.getElementById("navStreakButton");

const navStreak =
    document.getElementById("navStreak");


const gameBackButton =
    document.getElementById("gameBackButton");

const statsBackButton =
    document.getElementById("statsBackButton");

const profileBackButton =
    document.getElementById("profileBackButton");


const homeButton =
    document.getElementById("homeButton");

const playAgainButton =
    document.getElementById("playAgainButton");

const endSessionButton =
    document.getElementById("endSessionButton");


const gameModeIcon =
    document.getElementById("gameModeIcon");

const gameModeTitle =
    document.getElementById("gameModeTitle");

const questionCounter =
    document.getElementById("questionCounter");

const questionLabel =
    document.getElementById("questionLabel");

const question =
    document.getElementById("question");

const questionArea =
    document.getElementById("questionArea");

const gameCard =
    document.querySelector(".game-card");


const gameScore =
    document.getElementById("gameScore");


const timerContainer =
    document.getElementById("timerContainer");

const timerText =
    document.getElementById("timerText");

const timerBar =
    document.getElementById("timerBar");

const timerProgress =
    document.getElementById("timerProgress");


const inputArea =
    document.getElementById("inputArea");

const answerInput =
    document.getElementById("answerInput");

const submitAnswer =
    document.getElementById("submitAnswer");


const optionsArea =
    document.getElementById("optionsArea");

const answerOptions =
    Array.from(
        document.querySelectorAll(
            ".answer-option"
        )
    );


const memoryArea =
    document.getElementById("memoryArea");

const memoryNumber =
    document.getElementById("memoryNumber");

const memoryInstruction =
    document.getElementById("memoryInstruction");

const memoryInput =
    document.getElementById("memoryInput");

const memorySubmit =
    document.getElementById("memorySubmit");


const feedback =
    document.getElementById("feedback");


const gameStreak =
    document.getElementById("gameStreak");

const gameLives =
    document.getElementById("gameLives");

const gameLivesLabel =
    document.getElementById("gameLivesLabel");

const gameCorrect =
    document.getElementById("gameCorrect");


const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const finalScore =
    document.getElementById("finalScore");

const resultCorrect =
    document.getElementById("resultCorrect");

const resultWrong =
    document.getElementById("resultWrong");

const resultAccuracy =
    document.getElementById("resultAccuracy");

const resultBestStreak =
    document.getElementById("resultBestStreak");


const statsGames =
    document.getElementById("statsGames");

const statsBestScore =
    document.getElementById("statsBestScore");

const statsAccuracy =
    document.getElementById("statsAccuracy");

const statsBestStreak =
    document.getElementById("statsBestStreak");

const achievementText =
    document.getElementById("achievementText");


const profileName =
    document.getElementById("profileName");

const profileTagline =
    document.getElementById("profileTagline");

const profileAvatar =
    document.getElementById("profileAvatar");

const profileAvatarLarge =
    document.getElementById(
        "profileAvatarLarge"
    );

const profileLevel =
    document.getElementById("profileLevel");

const xpBar =
    document.getElementById("xpBar");

const xpProgress =
    document.getElementById("xpProgress");

const xpText =
    document.getElementById("xpText");


const homeGames =
    document.getElementById("homeGames");

const homeScore =
    document.getElementById("homeScore");

const homeAccuracy =
    document.getElementById("homeAccuracy");

const homeStreak =
    document.getElementById("homeStreak");


const confirmDialog =
    document.getElementById("confirmDialog");

const confirmCancel =
    document.getElementById("confirmCancel");

const confirmAccept =
    document.getElementById("confirmAccept");


/*
    Every screen switch, in one place, so Escape and
    the navbar agree on where "back" goes.
*/

const SCREENS = {
    home: homeScreen,
    game: gameScreen,
    result: resultScreen,
    stats: statsScreen,
    profile: profileScreen
};

let activeScreen = homeScreen;

let pendingConfirmAction = null;


/* =========================================================
   6. NUMBER HELPERS
========================================================= */

function randomNumber(min, max) {

    if (max < min) {

        return min;

    }

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}

function randomItem(array) {

    const index =
        Math.floor(
            Math.random() * array.length
        );

    return array[index];

}

function shuffle(array) {

    const newArray = [...array];

    for (
        let i = newArray.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            newArray[i],
            newArray[j]
        ] = [
            newArray[j],
            newArray[i]
        ];

    }

    return newArray;

}

function randomDigitString(length) {

    let digits = "";

    for (
        let i = 0;
        i < length;
        i++
    ) {

        digits +=
            randomNumber(0, 9);

    }

    return digits;

}


/* =========================================================
   7. STORAGE
   ========================================================== */

/*
    Reading and writing are both wrapped.

    localStorage access itself throws when storage is
    blocked, and it throws again in some private browsing
    modes, so the guard has to sit outside the JSON
    handling rather than inside it.
*/

function readStoredPlayer() {

    try {

        const raw =
            window.localStorage.getItem(
                STORAGE_KEY
            );

        if (!raw) {

            return null;

        }

        return JSON.parse(raw);

    } catch (error) {

        return null;

    }

}

function writeStoredPlayer() {

    try {

        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(playerData)
        );

        return true;

    } catch (error) {

        return false;

    }

}

function toCount(value) {

    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {

        return 0;

    }

    return Math.floor(number);

}

function xpRequiredForLevel(level) {

    return level * 100;

}

/*
    Rebuilds saved data field by field.

    Anything missing, negative, fractional or non-numeric
    falls back to its default, so a corrupt or
    hand-edited entry can never render as NaN on screen.
*/

function normalisePlayerData(raw) {

    const data = { ...DEFAULT_PLAYER_DATA };

    if (
        !raw ||
        typeof raw !== "object"
    ) {

        return data;

    }

    data.gamesPlayed =
        toCount(raw.gamesPlayed);

    data.bestScore =
        toCount(raw.bestScore);

    data.totalCorrect =
        toCount(raw.totalCorrect);

    data.totalQuestions =
        toCount(raw.totalQuestions);

    data.bestStreak =
        toCount(raw.bestStreak);

    data.currentStreak =
        toCount(raw.currentStreak);

    data.xp =
        toCount(raw.xp);

    data.level =
        Math.max(1, toCount(raw.level));

    if (
        typeof raw.name === "string" &&
        raw.name.trim() !== ""
    ) {

        data.name =
            raw.name
                .trim()
                .slice(0, 20);

    }

    if (
        typeof raw.lastPlayedDate ===
        "string"
    ) {

        data.lastPlayedDate =
            raw.lastPlayedDate;

    }

    /*
        Accuracy can never exceed 100 percent, so a
        correct count above the total is clamped.
    */

    if (
        data.totalCorrect >
        data.totalQuestions
    ) {

        data.totalCorrect =
            data.totalQuestions;

    }

    /*
        Repairs progress written by the old level-up
        loop, which reused a stale XP requirement and so
        could leave a level holding more XP than it took
        to earn.
    */

    let guard = 0;

    while (
        data.xp >= xpRequiredForLevel(data.level) &&
        guard < 1000
    ) {

        data.xp -= xpRequiredForLevel(data.level);

        data.level++;

        guard++;

    }

    return data;

}

function loadPlayerData() {

    playerData =
        normalisePlayerData(
            readStoredPlayer()
        );

    updateHomeStats();

    updateProfile();

}

function savePlayerData() {

    writeStoredPlayer();

}


/* =========================================================
   8. SCREEN NAVIGATION
========================================================= */

function showScreen(screen) {

    if (!screen) {

        return;

    }

    document
        .querySelectorAll(".screen")
        .forEach(
            function(currentScreen) {

                currentScreen.classList.remove(
                    "active"
                );

            }
        );

    screen.classList.add("active");

    activeScreen = screen;

    /*
        Each screen carries tabindex="-1" so focus can be
        moved onto it. Without this, a screen reader
        keeps announcing the screen the player just left
        and the next Tab jumps back to the navbar.
    */

    screen.focus({ preventScroll: true });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   9. NAVBAR AVAILABILITY
========================================================= */

/*
    The navbar is reachable from every screen. During a
    round that used to mean the player could browse
    statistics while the clock kept running against them,
    so the game-owning controls are switched off until
    the round is resolved.
*/

const GAME_OWNED_NAV_CONTROLS = [
    logoButton,
    statsButton,
    navStreakButton,
    profileButton
];

function setNavEnabled(enabled) {

    GAME_OWNED_NAV_CONTROLS.forEach(
        function(control) {

            if (!control) {

                return;

            }

            control.disabled = !enabled;

        }
    );

    if (profileButton) {

        profileButton.setAttribute(
            "aria-disabled",
            String(!enabled)
        );

    }

}


/* =========================================================
   10. CONFIRMATION DIALOG
   ========================================================== */

/*
    A native <dialog> opened with showModal() supplies
    the focus trap, the Escape handling and the inert
    background, none of which a div overlay gets for
    free.
*/

function requestConfirmation(action) {

    pendingConfirmAction = action;

    if (
        typeof confirmDialog.showModal !==
        "function"
    ) {

        /*
            Very old browsers without <dialog>. The
            blocking prompt is still better than
            dropping the guard entirely.
        */

        const confirmed =
            window.confirm(
                "Are you sure you want to exit this game?"
            );

        pendingConfirmAction = null;

        if (confirmed) {

            action();

        }

        return;

    }

    confirmDialog.showModal();

    /*
        Focus lands on "Keep Playing" so a stray Enter
        cannot quit the round.
    */

    confirmCancel.focus();

}

function closeConfirmation() {

    pendingConfirmAction = null;

    if (confirmDialog.open) {

        confirmDialog.close();

    }

}

confirmDialog.addEventListener(
    "cancel",
    function(event) {

        event.preventDefault();

        closeConfirmation();

    }
);

confirmCancel.addEventListener(
    "click",
    function() {

        closeConfirmation();

    }
);

confirmAccept.addEventListener(
    "click",
    function() {

        const action =
            pendingConfirmAction;

        closeConfirmation();

        if (action) {

            action();

        }

    }
);


/* =========================================================
   11. START GAME
========================================================= */

function startGame(mode) {

    const config =
        GAME_CONFIG[mode];

    if (!config) {

        return;

    }

    stopTimer();

    clearMemoryTimeout();

    clearNextQuestionTimeout();

    gameState =
        createGameState(mode);

    setupGameInterface();

    setNavEnabled(false);

    showScreen(gameScreen);

    startTimer();

    nextQuestion();

}


/* =========================================================
   12. SETUP GAME INTERFACE
========================================================= */

function setupGameInterface() {

    const config =
        GAME_CONFIG[
            gameState.mode
        ];

    gameModeIcon.textContent =
        config.icon;

    gameModeTitle.textContent =
        config.name;

    questionCounter.textContent =
        "Question 1";

    gameScore.textContent = "0";

    gameStreak.textContent = "0";

    gameLives.textContent =
        config.usesLives
            ? "3"
            : "∞";

    gameLivesLabel.textContent =
        config.usesLives
            ? "❤️ Lives"
            : "No limit";

    gameCorrect.textContent = "0";

    timerText.textContent =
        config.timed
            ? config.time
            : "∞";

    timerProgress.style.width = "100%";

    timerBar.setAttribute(
        "aria-valuenow",
        "100"
    );

    timerContainer.classList.remove(
        "is-urgent"
    );

    clearFeedback();

    questionLabel.textContent = "";

    question.textContent = "";

    questionArea.classList.remove(
        "hidden"
    );

    inputArea.classList.add("hidden");

    optionsArea.classList.add("hidden");

    memoryArea.classList.add("hidden");

    unlockAnswerInputs();

    answerInput.value = "";

    memoryInput.value = "";

    resetAnswerOptions();

    /*
        Practice has neither a clock nor lives, so it
        needs an explicit way to finish and bank a run.
    */

    endSessionButton.classList.toggle(
        "hidden",
        config.timed
    );

}

function resetAnswerOptions() {

    answerOptions.forEach(
        function(button, index) {

            button.disabled = false;

            button.className =
                "answer-option";

            button.dataset.value = "";

            /*
                The visible content of an option is an
                aria-hidden shortcut badge plus an empty
                slot, so the button would otherwise have
                no accessible name at all. Until a value
                is dealt it is announced by position.
            */

            button.setAttribute(
                "aria-label",
                `Answer option ${index + 1}`
            );

            const value =
                button.querySelector(
                    ".option-value"
                );

            if (value) {

                value.textContent = "";

            }

        }
    );

}

function unlockAnswerInputs() {

    answerInput.disabled = false;

    submitAnswer.disabled = false;

    memoryInput.disabled = false;

    memorySubmit.disabled = false;

}

function lockAnswerInputs() {

    answerInput.disabled = true;

    submitAnswer.disabled = true;

    memoryInput.disabled = true;

    memorySubmit.disabled = true;

}


/* =========================================================
   13. TIMER
========================================================= */

function startTimer() {

    stopTimer();

    if (!gameState.timed) {

        timerText.textContent = "∞";

        timerProgress.style.width = "100%";

        return;

    }

    gameState.deadline =
        performance.now() +
        gameState.totalTime * 1000;

    gameState.timer =
        setInterval(
            tickTimer,
            100
        );

    updateTimerUI();

}

function tickTimer() {

    const remaining =
        (
            gameState.deadline -
            performance.now()
        ) / 1000;

    gameState.timeLeft =
        Math.max(0, remaining);

    updateTimerUI();

    if (gameState.timeLeft <= 0) {

        endGame();

    }

}

function stopTimer() {

    if (gameState.timer) {

        clearInterval(
            gameState.timer
        );

        gameState.timer = null;

    }

    gameState.deadline = null;

}

function updateTimerUI() {

    if (!gameState.timed) {

        return;

    }

    const seconds =
        Math.ceil(
            gameState.timeLeft
        );

    timerText.textContent =
        seconds;

    const percentage =
        (
            gameState.timeLeft /
            gameState.totalTime
        ) * 100;

    const clamped =
        Math.max(
            0,
            Math.min(100, percentage)
        );

    timerProgress.style.width =
        clamped + "%";

    timerBar.setAttribute(
        "aria-valuenow",
        String(Math.round(clamped))
    );

    timerContainer.classList.toggle(
        "is-urgent",
        gameState.timeLeft <= URGENT_SECONDS
    );

}


/* =========================================================
   14. QUESTION FACTORIES
   ========================================================== */

/*
    One factory per operation, shared by every mode.

    The subtraction factory caps the second operand at
    a - 1, which guarantees a - b stays positive. Three
    separate copies of the old generator used
    Math.max(0, a - b) and would happily show
    "8 - 12 = 0", which teaches the wrong answer.
*/

function makeAddition(maxValue) {

    const a =
        randomNumber(1, maxValue);

    const b =
        randomNumber(1, maxValue);

    return {
        text: `${a} + ${b}`,
        answer: a + b
    };

}

function makeSubtraction(maxValue) {

    const a =
        randomNumber(2, maxValue);

    const b =
        randomNumber(
            1,
            Math.max(1, a - 1)
        );

    return {
        text: `${a} - ${b}`,
        answer: a - b
    };

}

function makeMultiplication(maxFactor) {

    const a =
        randomNumber(2, maxFactor);

    const b =
        randomNumber(2, 12);

    return {
        text: `${a} × ${b}`,
        answer: a * b
    };

}

function makeDivision(maxQuotient) {

    const divisor =
        randomNumber(2, 10);

    const answer =
        randomNumber(2, maxQuotient);

    const dividend =
        divisor * answer;

    return {
        text: `${dividend} ÷ ${divisor}`,
        answer: answer
    };

}

function getDifficulty() {

    const level =
        Math.floor(
            gameState.questionNumber / 5
        );

    return Math.min(
        50,
        10 + level * 5
    );

}

function applyQuestion(questionData) {

    gameState.currentAnswer =
        questionData.answer;

    gameState.currentQuestion =
        questionData.text;

    question.textContent =
        questionData.text;

    showInputMode();

    setTimeout(
        function() {

            if (
                gameState.active &&
                !gameState.questionAnswered
            ) {

                answerInput.focus();

            }

        },
        50
    );

}


/* =========================================================
   15. QUICK MATH
========================================================= */

function createQuickMathQuestion() {

    const difficulty =
        getDifficulty();

    const operation =
        randomItem([
            "+",
            "-",
            "×",
            "÷"
        ]);

    let questionData;

    if (operation === "+") {

        questionData =
            makeAddition(difficulty);

    }

    else if (operation === "-") {

        questionData =
            makeSubtraction(
                difficulty + 10
            );

    }

    else if (operation === "×") {

        questionData =
            makeMultiplication(
                Math.min(15, difficulty)
            );

    }

    else {

        /*
            Division used to ignore the difficulty value
            entirely and always produce a two to ten
            quotient, so it never got harder.
        */

        questionData =
            makeDivision(
                Math.min(12, difficulty)
            );

    }

    questionLabel.textContent =
        "Solve this";

    applyQuestion(questionData);

}


/* =========================================================
   16. MIND SNAP
========================================================= */

function buildOptions(answer) {

    const options = [answer];

    const spread =
        Math.max(
            3,
            Math.round(answer * 0.3)
        );

    /*
        The old loop had no attempt cap, so an answer
        with a very small pool of valid neighbours could
        spin. The cap plus the filler below guarantee
        exactly four options every time.
    */

    let attempts = 0;

    while (
        options.length < OPTION_COUNT &&
        attempts < 200
    ) {

        attempts++;

        const offset =
            randomNumber(1, spread);

        const fake =
            Math.random() > 0.5
                ? answer + offset
                : answer - offset;

        if (
            fake >= 0 &&
            !options.includes(fake)
        ) {

            options.push(fake);

        }

    }

    let filler =
        answer + OPTION_COUNT;

    while (
        options.length < OPTION_COUNT
    ) {

        if (
            !options.includes(filler)
        ) {

            options.push(filler);

        }

        filler += 1;

    }

    return shuffle(options);

}

function createSnapQuestion() {

    hideInputMode();

    optionsArea.classList.remove(
        "hidden"
    );

    const difficulty =
        getDifficulty();

    const operation =
        randomItem([
            "+",
            "-",
            "×"
        ]);

    let questionData;

    if (operation === "+") {

        questionData =
            makeAddition(difficulty);

    }

    else if (operation === "-") {

        questionData =
            makeSubtraction(difficulty);

    }

    else {

        questionData =
            makeMultiplication(
                Math.min(15, difficulty)
            );

    }

    gameState.currentAnswer =
        questionData.answer;

    gameState.currentQuestion =
        questionData.text;

    question.textContent =
        questionData.text;

    questionLabel.textContent =
        "Choose the correct answer";

    const options =
        buildOptions(
            questionData.answer
        );

    answerOptions.forEach(
        function(button, index) {

            const value =
                options[index];

            button.dataset.value =
                String(value);

            /*
                Only the value slot is rewritten.
                Clearing the button wholesale would
                also delete the shortcut badge and
                leave the card without a number key.
            */

            const slot =
                button.querySelector(
                    ".option-value"
                );

            if (slot) {

                slot.textContent =
                    value;

            }

            /*
                The badge is hidden from assistive tech
                and the slot is empty markup, so the
                value has to be named explicitly.
            */

            button.setAttribute(
                "aria-label",
                `Answer option ${index + 1}: ${value}`
            );

            button.disabled = false;

            button.className =
                "answer-option";

        }
    );

}


/* =========================================================
   17. NUMBER RUSH
========================================================= */

function createRushQuestion() {

    const difficulty =
        getDifficulty();

    const maxValue =
        difficulty + 15;

    const operation =
        randomItem([
            "+",
            "-",
            "×"
        ]);

    let questionData;

    if (operation === "+") {

        questionData =
            makeAddition(maxValue);

    }

    else if (operation === "-") {

        questionData =
            makeSubtraction(maxValue);

    }

    else {

        questionData =
            makeMultiplication(
                Math.min(15, difficulty)
            );

    }

    questionLabel.textContent =
        "Keep your streak alive";

    applyQuestion(questionData);

}


/* =========================================================
   18. PRACTICE
========================================================= */

function createPracticeQuestion() {

    const operation =
        randomItem([
            "+",
            "-",
            "×"
        ]);

    let questionData;

    if (operation === "+") {

        questionData =
            makeAddition(50);

    }

    else if (operation === "-") {

        questionData =
            makeSubtraction(50);

    }

    else {

        questionData =
            makeMultiplication(12);

    }

    questionLabel.textContent =
        "Practice";

    applyQuestion(questionData);

}


/* =========================================================
   19. MEMORY NUMBERS
========================================================= */

function memoryLengthForQuestion(index) {

    /*
        Was 4 + floor(n / 2) capped at 10, which asked for
        ten digits inside a 45 second round. The climb is
        slower and the ceiling is lower.
    */

    return Math.min(
        4 +
        Math.floor(
            index / 3
        ),
        8
    );

}

function createMemoryQuestion() {

    hideInputMode();

    /*
        The equation area is hidden here. It used to keep
        whatever the previous mode had last rendered, so
        Memory Numbers opened under a stale "7 + 5".
    */

    questionArea.classList.add("hidden");

    memoryArea.classList.remove(
        "hidden"
    );

    const length =
        memoryLengthForQuestion(
            gameState.questionNumber
        );

    const sequence =
        randomDigitString(length);

    gameState.memorySequence =
        sequence;

    /*
        Storing the sequence as the answer keeps the
        generic wrong-answer message honest. It used to
        be left null here, which printed
        "Wrong! Answer: null".
    */

    gameState.currentAnswer =
        sequence;

    gameState.currentQuestion =
        sequence;

    gameState.memoryShowing =
        true;

    questionLabel.textContent =
        "Remember the digits";

    memoryNumber.textContent =
        sequence;

    memoryInstruction.textContent =
        `Memorise ${length} digits, then type them back.`;

    memoryInput.value = "";

    memoryInput.classList.add(
        "hidden"
    );

    memorySubmit.classList.add(
        "hidden"
    );

    clearMemoryTimeout();

    gameState.memoryTimeout =
        setTimeout(
            revealMemoryInput,
            MEMORY_SHOW_MS
        );

}

function revealMemoryInput() {

    /*
        The mask used to be a fixed six bullets whatever
        the length was, so a four digit sequence was shown
        as six and a ten digit one as six.
    */

    memoryNumber.textContent =
        "•".repeat(
            gameState.memorySequence.length
        );

    memoryInstruction.textContent =
        "Now type the number you saw";

    memoryInput.classList.remove(
        "hidden"
    );

    memorySubmit.classList.remove(
        "hidden"
    );

    gameState.memoryShowing =
        false;

    memoryInput.focus();

}

function clearMemoryTimeout() {

    if (gameState.memoryTimeout) {

        clearTimeout(
            gameState.memoryTimeout
        );

        gameState.memoryTimeout =
            null;

    }

}


/* =========================================================
   20. NEXT QUESTION
========================================================= */

function showInputMode() {

    questionArea.classList.remove(
        "hidden"
    );

    inputArea.classList.remove(
        "hidden"
    );

    optionsArea.classList.add(
        "hidden"
    );

    memoryArea.classList.add(
        "hidden"
    );

}

function hideInputMode() {

    inputArea.classList.add(
        "hidden"
    );

    submitAnswer.disabled = true;

}

function clearNextQuestionTimeout() {

    if (gameState.nextQuestionTimeout) {

        clearTimeout(
            gameState.nextQuestionTimeout
        );

        gameState.nextQuestionTimeout =
            null;

    }

}

function queueNextQuestion(delay) {

    clearNextQuestionTimeout();

    gameState.nextQuestionTimeout =
        setTimeout(
            function() {

                if (!gameState.active) {

                    return;

                }

                /*
                    Without this the round advanced one
                    last time after the last life was
                    spent, briefly showing a fresh question
                    behind the results screen.
                */

                if (
                    gameState.lives <= 0 &&
                    gameState.usesLives
                ) {

                    return;

                }

                nextQuestion();

            },
            delay
        );

}

function nextQuestion() {

    if (!gameState.active) {

        return;

    }

    gameState.questionNumber++;

    gameState.questionAnswered =
        false;

    questionCounter.textContent =
        `Question ${gameState.questionNumber}`;

    clearFeedback();

    unlockAnswerInputs();

    answerInput.value = "";

    memoryInput.value = "";

    const mode =
        gameState.mode;

    if (mode === "quick") {

        createQuickMathQuestion();

    }

    else if (mode === "snap") {

        createSnapQuestion();

    }

    else if (mode === "rush") {

        createRushQuestion();

    }

    else if (mode === "memory") {

        createMemoryQuestion();

    }

    else {

        createPracticeQuestion();

    }

}


/* =========================================================
   21. SUBMIT TYPED ANSWER
   ========================================================== */

function parseAnswer(value) {

    const digits =
        value.replace(/\D/g, "");

    if (digits === "") {

        return null;

    }

    const number =
        Number(digits);

    if (!Number.isFinite(number)) {

        return null;

    }

    return number;

}

function submitCurrentAnswer() {

    if (!gameState.active) {

        return;

    }

    if (gameState.questionAnswered) {

        return;

    }

    const value =
        parseAnswer(answerInput.value);

    if (value === null) {

        showFeedback(
            "Type an answer first.",
            "wrong"
        );

        answerInput.focus();

        return;

    }

    checkAnswer(value);

}

function checkAnswer(answer) {

    if (gameState.questionAnswered) {

        return;

    }

    gameState.questionAnswered =
        true;

    lockAnswerInputs();

    if (
        Number(answer) ===
        Number(gameState.currentAnswer)
    ) {

        handleCorrect();

    }

    else {

        handleWrong();

    }

    queueNextQuestion(
        gameState.timed
            ? 650
            : 500
    );

}


/* =========================================================
   22. CORRECT ANSWER
========================================================= */

function handleCorrect() {

    gameState.correct++;

    gameState.streak++;

    if (
        gameState.streak >
        gameState.bestStreak
    ) {

        gameState.bestStreak =
            gameState.streak;

    }

    let points = 10;

    points +=
        Math.min(
            gameState.streak * 2,
            30
        );

    if (
        gameState.timed &&
        gameState.timeLeft > 0
    ) {

        points +=
            Math.floor(
                gameState.timeLeft / 10
            );

    }

    gameState.score +=
        points;

    updateGameUI();

    showFeedback(
        `Correct! +${points} points`,
        "correct"
    );

    playCorrectSound();

    addXP(5);

}

function handleWrong(detail) {

    gameState.wrong++;

    gameState.streak = 0;

    /*
        Only the modes that actually have lives spend
        them. Practice kept decrementing here, which
        drifted the counter away from the number the
        state was created with.
    */

    if (gameState.usesLives) {

        gameState.lives--;

    }

    updateGameUI();

    /*
        The detail argument lets Memory Numbers say
        which number it was without the caller also
        writing its own message. Previously the memory
        handler printed "Wrong! It was 4931" and then
        the shared handler immediately overwrote it with
        "Wrong! Answer: null".
    */

    showFeedback(
        detail
            ? `Wrong! ${detail}`
            : `Wrong! Answer: ${gameState.currentAnswer}`,
        "wrong"
    );

    playWrongSound();

    shakeGameCard();

    if (
        gameState.lives <= 0 &&
        gameState.usesLives
    ) {

        setTimeout(
            endGame,
            650
        );

    }

}

function shakeGameCard() {

    if (!gameCard) {

        return;

    }

    gameCard.classList.remove(
        "shake"
    );

    /*
        Reading layout forces the class change to be
        observed, so two wrong answers in quick
        succession both animate.
    */

    void gameCard.offsetWidth;

    gameCard.classList.add(
        "shake"
    );

    setTimeout(
        function() {

            gameCard.classList.remove(
                "shake"
            );

        },
        320
    );

}


/* =========================================================
   23. MEMORY ANSWER
   ========================================================== */

function submitMemoryAnswer() {

    if (!gameState.active) {

        return;

    }

    if (gameState.memoryShowing) {

        return;

    }

    if (gameState.questionAnswered) {

        return;

    }

    const answer =
        memoryInput.value.trim();

    if (answer === "") {

        showFeedback(
            "Type the number first.",
            "wrong"
        );

        memoryInput.focus();

        return;

    }

    gameState.questionAnswered =
        true;

    lockAnswerInputs();

    if (
        answer ===
        gameState.memorySequence
    ) {

        handleCorrect();

    }

    else {

        handleWrong(
            `It was ${gameState.memorySequence}`
        );

    }

    queueNextQuestion(700);

}


/* =========================================================
   24. OPTION ANSWER
   ========================================================== */

function selectOption(button) {

    if (!gameState.active) {

        return;

    }

    if (gameState.questionAnswered) {

        return;

    }

    const selected =
        Number(
            button.dataset.value
        );

    const answer =
        Number(gameState.currentAnswer);

    gameState.questionAnswered =
        true;

    /*
        The value is read from the dataset rather than
        from the button text, because the button now also
        holds the shortcut badge. Parsing textContent
        would have turned the badge into the answer.
    */

    answerOptions.forEach(
        function(currentButton) {

            currentButton.disabled =
                true;

            currentButton.classList.remove(
                "correct"
            );

            currentButton.classList.remove(
                "wrong"
            );

            const value =
                Number(
                    currentButton.dataset.value
                );

            if (value === answer) {

                currentButton.classList.add(
                    "correct"
                );

            }

            else if (
                currentButton === button
            ) {

                currentButton.classList.add(
                    "wrong"
                );

            }

        }
    );

    if (selected === answer) {

        handleCorrect();

    }

    else {

        handleWrong();

    }

    queueNextQuestion(700);

}


/* =========================================================
   25. FEEDBACK
   ========================================================== */

function clearFeedback() {

    feedback.textContent = "";

    feedback.className =
        "feedback";

}

function showFeedback(
    message,
    type
) {

    feedback.textContent =
        message;

    feedback.className =
        `feedback ${type}`;

}

function updateGameUI() {

    gameScore.textContent =
        gameState.score;

    gameStreak.textContent =
        gameState.streak;

    gameLives.textContent =
        gameState.usesLives
            ? Math.max(
                    0,
                    gameState.lives
                )
            : "∞";

    /*
        Practice is endless, so a draining counter
        read as a failure the player never actually
        made. It now mirrors the untimed clock, which
        already shows an infinity sign.
    */

    gameLivesLabel.textContent =
        gameState.usesLives
            ? "❤️ Lives"
            : "No limit";

    gameCorrect.textContent =
        gameState.correct;

}


/* =========================================================
   26. END GAME
   ========================================================== */

function endGame() {

    if (!gameState.active) {

        return;

    }

    gameState.active =
        false;

    stopTimer();

    clearMemoryTimeout();

    clearNextQuestionTimeout();

    unlockAnswerInputs();

    bankResult();

    setNavEnabled(true);

    showResults();

}

function abandonGame() {

    gameState.active =
        false;

    stopTimer();

    clearMemoryTimeout();

    clearNextQuestionTimeout();

    unlockAnswerInputs();

    setNavEnabled(true);

    showScreen(SCREENS.home);

}

function bankResult() {

    playerData.gamesPlayed++;

    playerData.totalCorrect +=
        gameState.correct;

    playerData.totalQuestions +=
        gameState.correct +
        gameState.wrong;

    if (
        gameState.score >
        playerData.bestScore
    ) {

        playerData.bestScore =
            gameState.score;

    }

    if (
        gameState.bestStreak >
        playerData.bestStreak
    ) {

        playerData.bestStreak =
            gameState.bestStreak;

    }

    updateDailyStreak();

    /*
        One write per finished round instead of one per
        answered question.
    */

    savePlayerData();

}

function showResults() {

    const total =
        gameState.correct +
        gameState.wrong;

    const accuracy =
        total > 0
            ? Math.round(
                (
                    gameState.correct /
                    total
                ) * 100
            )
            : 0;

    finalScore.textContent =
        gameState.score;

    resultCorrect.textContent =
        gameState.correct;

    resultWrong.textContent =
        gameState.wrong;

    resultAccuracy.textContent =
        accuracy + "%";

    resultBestStreak.textContent =
        gameState.bestStreak;

    if (accuracy >= 90) {

        resultTitle.textContent =
            "Excellent! 🧠";

        resultMessage.textContent =
            "Your brain was absolutely flying.";

    }

    else if (accuracy >= 70) {

        resultTitle.textContent =
            "Great job! 🔥";

        resultMessage.textContent =
            "You are getting faster.";

    }

    else if (accuracy >= 50) {

        resultTitle.textContent =
            "Nice work! 💪";

        resultMessage.textContent =
            "Keep practicing and your score will rise.";

    }

    else {

        resultTitle.textContent =
            "Keep going! 🚀";

        resultMessage.textContent =
            "Every question makes you better.";

    }

    updateHomeStats();

    updateStatsScreen();

    updateProfile();

    showScreen(SCREENS.result);

}


/* =========================================================
   27. DAILY STREAK
   ========================================================== */

/*
    Local calendar day, not UTC.

    toISOString() was used before, which reports the
    UTC date. For anyone west of Greenwich that
    mislabels the day near midnight, so a streak could
    break or double for no reason.
*/

function localDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

function isStreakAlive() {

    if (
        playerData.currentStreak <= 0 ||
        !playerData.lastPlayedDate
    ) {

        return false;

    }

    const today =
        localDateKey(
            new Date()
        );

    if (
        playerData.lastPlayedDate ===
        today
    ) {

        return true;

    }

    const yesterday =
        new Date();

    yesterday.setDate(
        yesterday.getDate() - 1
    );

    return (
        playerData.lastPlayedDate ===
        localDateKey(yesterday)
    );

}

function updateDailyStreak() {

    const today =
        localDateKey(
            new Date()
        );

    if (
        playerData.lastPlayedDate ===
        today
    ) {

        return;

    }

    const yesterday =
        new Date();

    yesterday.setDate(
        yesterday.getDate() - 1
    );

    playerData.currentStreak =
        playerData.lastPlayedDate ===
        localDateKey(yesterday)
            ? playerData.currentStreak + 1
            : 1;

    playerData.lastPlayedDate =
        today;

}


/* =========================================================
   28. XP AND LEVEL
   ========================================================== */

function addXP(amount) {

    playerData.xp +=
        amount;

    /*
        The requirement is recalculated every pass.
        The old loop hoisted it out of the while, so it
        never grew with the level: one call could jump
        from level 1 straight past level 3 while still
        charging the flat level 1 cost.
    */

    let guard = 0;

    while (
        playerData.xp >=
            xpRequiredForLevel(
                playerData.level
            ) &&
        guard < 1000
    ) {

        playerData.xp -=
            xpRequiredForLevel(
                playerData.level
            );

        playerData.level++;

        guard++;

    }

    updateProfile();

}

function describeTagline() {

    const played =
        playerData.gamesPlayed;

    if (played === 0) {

        return "Brain training enthusiast";

    }

    if (played < 5) {

        return "Just getting started";

    }

    if (played < 25) {

        return "Building momentum";

    }

    if (played < 100) {

        return "Sharpening your mind";

    }

    return "Brain training master";

}

function updateProfile() {

    const level =
        playerData.level;

    const required =
        xpRequiredForLevel(level);

    const initial =
        playerData.name
            .charAt(0)
            .toUpperCase() ||
        "P";

    profileName.textContent =
        playerData.name;

    profileTagline.textContent =
        describeTagline();

    profileAvatar.textContent =
        initial;

    profileAvatarLarge.textContent =
        initial;

    profileLevel.textContent =
        level;

    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                (
                    playerData.xp /
                    required
                ) * 100
            )
        );

    xpProgress.style.width =
        percentage + "%";

    xpBar.setAttribute(
        "aria-valuenow",
        String(Math.round(percentage))
    );

    xpText.textContent =
        `${playerData.xp} / ${required} XP`;

    updateStreakDisplay();

}

function accuracyFromTotals() {

    if (
        playerData.totalQuestions <= 0
    ) {

        return 0;

    }

    return Math.round(
        (
            playerData.totalCorrect /
            playerData.totalQuestions
        ) * 100
    );

}

function updateStreakDisplay() {

    const shown =
        isStreakAlive()
            ? playerData.currentStreak
            : 0;

    homeStreak.textContent =
        `${shown} days`;

    navStreak.textContent =
        shown;

}

function updateHomeStats() {

    homeGames.textContent =
        playerData.gamesPlayed;

    homeScore.textContent =
        playerData.bestScore;

    homeAccuracy.textContent =
        accuracyFromTotals() + "%";

    updateStreakDisplay();

}


/* =========================================================
   29. STATS SCREEN
   ========================================================== */

function updateStatsScreen() {

    statsGames.textContent =
        playerData.gamesPlayed;

    statsBestScore.textContent =
        playerData.bestScore;

    statsAccuracy.textContent =
        accuracyFromTotals() + "%";

    statsBestStreak.textContent =
        playerData.bestStreak;

    achievementText.textContent =
        describeAchievement();

}

function describeAchievement() {

    if (
        playerData.gamesPlayed >= 100
    ) {

        return "🏆 Century Player — 100 games completed!";

    }

    if (
        playerData.bestScore >= 1000
    ) {

        return "⭐ Score Master — 1000+ points!";

    }

    if (
        playerData.bestStreak >= 20
    ) {

        return "🔥 Streak Master — 20 correct answers in a row!";

    }

    if (
        playerData.gamesPlayed >= 10
    ) {

        return "🎮 Getting Serious — 10 games completed!";

    }

    if (
        playerData.gamesPlayed >= 1
    ) {

        return "🌱 First Step — keep playing to unlock more.";

    }

    return "Play your first game to unlock achievements.";

}


/* =========================================================
   30. SOUND
   ========================================================== */

/*
    One AudioContext for the whole page.

    A new context was built for every single beep, and
    browsers cap how many live contexts a document may
    hold, so the sound used to die partway through a
    round. A suspended context is resumed instead, which
    also satisfies the autoplay policy after the first
    real tap.
*/

let audioContext = null;

function getAudioContext() {

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {

        return null;

    }

    try {

        if (
            !audioContext ||
            audioContext.state === "closed"
        ) {

            audioContext =
                new AudioContextClass();

        }

        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }

        return audioContext;

    } catch (error) {

        return null;

    }

}

function playTone(
    frequency,
    duration,
    volume
) {

    const context =
        getAudioContext();

    if (!context) {

        return;

    }

    try {

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();

        const now =
            context.currentTime;

        oscillator.connect(gain);

        gain.connect(
            context.destination
        );

        oscillator.type =
            "sine";

        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );

        gain.gain.setValueAtTime(
            volume,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );

        oscillator.start(now);

        oscillator.stop(
            now + duration
        );

    } catch (error) {

        /*
            Audio is decoration. A failure here must
            never interrupt a round.
        */

    }

}

function playCorrectSound() {

    playTone(700, 0.12, 0.08);

}

function playWrongSound() {

    playTone(180, 0.15, 0.08);

}


/* =========================================================
   31. INPUT SANITISING
   ========================================================== */

/*
    The fields are type="text" so that Memory Numbers can
    hold a leading zero and so the mouse wheel cannot
    quietly rewrite a typed answer. That makes it our job
    to reject anything that is not a digit.
*/

function filterToDigits(input) {

    const original =
        input.value;

    const cleaned =
        original.replace(/\D/g, "");

    if (cleaned === original) {

        return;

    }

    const removed =
        original.length -
        cleaned.length;

    input.value = cleaned;

    const caret =
        Math.max(
            0,
            (input.selectionStart ??
                cleaned.length) - removed
        );

    input.setSelectionRange(
        caret,
        caret
    );

}

answerInput.addEventListener(
    "input",
    function() {

        filterToDigits(answerInput);

    }
);

memoryInput.addEventListener(
    "input",
    function() {

        filterToDigits(memoryInput);

    }
);

answerInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            submitCurrentAnswer();

        }

    }
);

memoryInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            submitMemoryAnswer();

        }

    }
);


/* =========================================================
   32. KEYBOARD NAVIGATION
   ========================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.defaultPrevented) {

            return;

        }

        if (
            event.metaKey ||
            event.ctrlKey ||
            event.altKey
        ) {

            return;

        }

        /*
            While the dialog is open it owns Escape, so
            the handler below stays out of the way.
        */

        if (confirmDialog.open) {

            return;

        }

        const focused =
            document.activeElement;

        const isTyping =
            focused &&
            (
                focused.tagName ===
                    "INPUT" ||
                focused.tagName ===
                    "TEXTAREA"
            );

        if (event.key === "Escape") {

            event.preventDefault();

            if (isTyping) {

                focused.blur();

                return;

            }

            navigateBack();

            return;

        }

        if (!gameState.active) {

            return;

        }

        /*
            Digits belong to the field while the player
            is typing in it.
        */

        if (isTyping) {

            return;

        }

        if (
            !KEYBOARD_OPTIONS.includes(
                event.key
            )
        ) {

            return;

        }

        if (
            optionsArea.classList.contains(
                "hidden"
            )
        ) {

            return;

        }

        const button =
            answerOptions[
                Number(event.key) - 1
            ];

        if (!button || button.disabled) {

            return;

        }

        event.preventDefault();

        selectOption(button);

    }
);

function navigateBack() {

    if (gameState.active) {

        requestConfirmation(
            abandonGame
        );

        return;

    }

    if (activeScreen !== SCREENS.home) {

        showScreen(SCREENS.home);

    }

}


/* =========================================================
   33. EVENT WIRING
   ========================================================== */

function on(element, handler) {

    if (element) {

        element.addEventListener(
            "click",
            handler
        );

    }

}

on(
    quickPlayButton,
    function() {

        startGame("quick");

    }
);

on(
    practiceButton,
    function() {

        startGame("practice");

    }
);

on(
    logoButton,
    function() {

        showScreen(SCREENS.home);

    }
);

on(
    statsButton,
    function() {

        updateStatsScreen();

        showScreen(SCREENS.stats);

    }
);

on(
    navStreakButton,
    function() {

        updateStatsScreen();

        showScreen(SCREENS.stats);

    }
);

on(
    profileButton,
    function() {

        updateProfile();

        showScreen(SCREENS.profile);

    }
);

on(
    statsBackButton,
    function() {

        showScreen(SCREENS.home);

    }
);

on(
    profileBackButton,
    function() {

        showScreen(SCREENS.home);

    }
);

on(
    homeButton,
    function() {

        showScreen(SCREENS.home);

    }
);

on(
    playAgainButton,
    function() {

        startGame(gameState.mode);

    }
);

on(
    endSessionButton,
    function() {

        endGame();

    }
);

on(
    gameBackButton,
    function() {

        requestConfirmation(
            abandonGame
        );

    }
);

on(submitAnswer, submitCurrentAnswer);

on(memorySubmit, submitMemoryAnswer);

document
    .querySelectorAll(".mode-card")
    .forEach(
        function(card) {

            card.addEventListener(
                "click",
                function() {

                    startGame(
                        card.dataset.mode
                    );

                }
            );

        }
    );

answerOptions.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                selectOption(button);

            }
        );

    }
);


/* =========================================================
   34. INITIALISE
   ========================================================== */

loadPlayerData();

setNavEnabled(true);

activeScreen = homeScreen;
