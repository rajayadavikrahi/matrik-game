/* =========================================================
   MINDRUSH
   Vanilla JavaScript Brain Game

   No libraries.
   No APIs.
   No backend.

   Everything is handled in this file.
========================================================= */


/* =========================================================
   1. GAME CONFIGURATION
========================================================= */

const GAME_CONFIG = {

    quick: {
        name: "Quick Math",
        icon: "⚡",
        time: 60,
        description: "Solve as many equations as possible."
    },

    snap: {
        name: "Mind Snap",
        icon: "🎯",
        time: 45,
        description: "Pick the correct answer."
    },

    rush: {
        name: "Number Rush",
        icon: "🚀",
        time: 30,
        description: "Build the longest streak."
    },

    memory: {
        name: "Memory Numbers",
        icon: "🧩",
        time: 45,
        description: "Remember number sequences."
    },

    practice: {
        name: "Practice Mode",
        icon: "📚",
        time: 999,
        description: "Practice without pressure."
    }

};


/* =========================================================
   2. GAME STATE
========================================================= */

let gameState = {

    active: false,

    mode: "quick",

    score: 0,

    correct: 0,

    wrong: 0,

    streak: 0,

    bestStreak: 0,

    lives: 3,

    questionNumber: 0,

    timeLeft: 60,

    totalTime: 60,

    timer: null,

    questionAnswered: false,

    currentAnswer: null,

    currentQuestion: null,

    memorySequence: "",

    memoryShowing: false,

    memoryTimeout: null

};


/* =========================================================
   3. PLAYER DATA
========================================================= */

let playerData = {

    gamesPlayed: 0,

    bestScore: 0,

    totalCorrect: 0,

    totalQuestions: 0,

    bestStreak: 0,

    currentStreak: 0,

    xp: 0,

    level: 1,

    lastPlayedDate: null

};


/* =========================================================
   4. DOM ELEMENTS
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


const quickPlayButton =
    document.getElementById("quickPlayButton");

const practiceButton =
    document.getElementById("practiceButton");

const profileButton =
    document.getElementById("profileButton");


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


const gameModeIcon =
    document.getElementById("gameModeIcon");

const gameModeTitle =
    document.getElementById("gameModeTitle");

const questionCounter =
    document.getElementById("questionCounter");

const question =
    document.getElementById("question");

const questionLabel =
    document.getElementById("questionLabel");

const gameScore =
    document.getElementById("gameScore");

const timerText =
    document.getElementById("timerText");

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
    document.querySelectorAll(".answer-option");


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

const gameCorrect =
    document.getElementById("gameCorrect");


/* =========================================================
   5. LOAD PLAYER DATA
========================================================= */

function loadPlayerData() {

    const savedData =
        localStorage.getItem("mindRushPlayer");

    if (savedData) {

        try {

            playerData =
                JSON.parse(savedData);

        } catch (error) {

            console.log(
                "Could not load saved player data."
            );

        }

    }

    updateHomeStats();

    updateProfile();

}


/* =========================================================
   6. SAVE PLAYER DATA
========================================================= */

function savePlayerData() {

    localStorage.setItem(
        "mindRushPlayer",
        JSON.stringify(playerData)
    );

}


/* =========================================================
   7. SCREEN NAVIGATION
========================================================= */

function showScreen(screen) {

    const screens = document.querySelectorAll(
        ".screen"
    );

    screens.forEach(function(currentScreen) {

        currentScreen.classList.remove(
            "active"
        );

    });

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   8. RANDOM NUMBER
========================================================= */

function randomNumber(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


/* =========================================================
   9. RANDOM ITEM FROM ARRAY
========================================================= */

function randomItem(array) {

    const index =
        Math.floor(
            Math.random() * array.length
        );

    return array[index];

}


/* =========================================================
   10. SHUFFLE ARRAY
========================================================= */

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


/* =========================================================
   11. START GAME
========================================================= */

function startGame(mode) {

    stopTimer();

    clearTimeout(
        gameState.memoryTimeout
    );

    const config =
        GAME_CONFIG[mode];

    gameState = {

        active: true,

        mode: mode,

        score: 0,

        correct: 0,

        wrong: 0,

        streak: 0,

        bestStreak: 0,

        lives: 3,

        questionNumber: 0,

        timeLeft: config.time,

        totalTime: config.time,

        timer: null,

        questionAnswered: false,

        currentAnswer: null,

        currentQuestion: null,

        memorySequence: "",

        memoryShowing: false,

        memoryTimeout: null

    };

    setupGameInterface();

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

    gameLives.textContent = "3";

    gameCorrect.textContent = "0";

    timerText.textContent =
        gameState.timeLeft;

    timerProgress.style.width = "100%";

    feedback.textContent = "";

    feedback.className =
        "feedback";


    inputArea.classList.add("hidden");

    optionsArea.classList.add("hidden");

    memoryArea.classList.add("hidden");

    answerInput.value = "";

    memoryInput.value = "";

}


/* =========================================================
   13. START TIMER
========================================================= */

function startTimer() {

    stopTimer();

    if (
        gameState.mode === "practice"
    ) {

        timerText.textContent =
            "∞";

        timerProgress.style.width =
            "100%";

        return;

    }

    gameState.timer =
        setInterval(function() {

            gameState.timeLeft -= 0.1;

            if (
                gameState.timeLeft <= 0
            ) {

                gameState.timeLeft = 0;

                updateTimerUI();

                endGame();

                return;

            }

            updateTimerUI();

        }, 100);

}


/* =========================================================
   14. STOP TIMER
========================================================= */

function stopTimer() {

    if (gameState.timer) {

        clearInterval(
            gameState.timer
        );

        gameState.timer = null;

    }

}


/* =========================================================
   15. UPDATE TIMER
========================================================= */

function updateTimerUI() {

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

    timerProgress.style.width =
        Math.max(
            0,
            percentage
        ) + "%";

}


/* =========================================================
   16. NEXT QUESTION
========================================================= */

function nextQuestion() {

    if (!gameState.active) {

        return;

    }

    gameState.questionNumber++;

    gameState.questionAnswered =
        false;

    questionCounter.textContent =
        `Question ${gameState.questionNumber}`;

    feedback.textContent = "";

    feedback.className =
        "feedback";

    answerInput.value = "";

    memoryInput.value = "";


    if (gameState.mode === "quick") {

        createQuickMathQuestion();

    }

    else if (
        gameState.mode === "snap"
    ) {

        createSnapQuestion();

    }

    else if (
        gameState.mode === "rush"
    ) {

        createRushQuestion();

    }

    else if (
        gameState.mode === "memory"
    ) {

        createMemoryQuestion();

    }

    else if (
        gameState.mode === "practice"
    ) {

        createPracticeQuestion();

    }

}


/* =========================================================
   17. QUICK MATH QUESTION
========================================================= */

function createQuickMathQuestion() {

    showInputMode();

    const difficulty =
        getDifficulty();

    const operation =
        randomItem([
            "+",
            "-",
            "×",
            "÷"
        ]);

    let a;

    let b;

    let answer;


    if (operation === "+") {

        a = randomNumber(
            5,
            difficulty
        );

        b = randomNumber(
            5,
            difficulty
        );

        answer = a + b;

    }


    else if (
        operation === "-"
    ) {

        a = randomNumber(
            10,
            difficulty + 10
        );

        b = randomNumber(
            1,
            a
        );

        answer = a - b;

    }


    else if (
        operation === "×"
    ) {

        a = randomNumber(
            2,
            Math.min(15, difficulty)
        );

        b = randomNumber(
            2,
            12
        );

        answer = a * b;

    }


    else {

        b = randomNumber(
            2,
            10
        );

        answer = randomNumber(
            2,
            10
        );

        a = b * answer;

    }


    gameState.currentAnswer =
        answer;

    gameState.currentQuestion =
        `${a} ${operation} ${b}`;

    question.textContent =
        gameState.currentQuestion;

    questionLabel.textContent =
        "Solve this";


    setTimeout(function() {

        answerInput.focus();

    }, 50);

}


/* =========================================================
   18. SNAP QUESTION
========================================================= */

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

    let a =
        randomNumber(
            2,
            difficulty
        );

    let b =
        randomNumber(
            2,
            12
        );

    let answer;


    if (operation === "+") {

        answer = a + b;

    }

    else if (
        operation === "-"
    ) {

        if (b > a) {

            [a, b] = [b, a];

        }

        answer = a - b;

    }

    else {

        answer = a * b;

    }


    gameState.currentAnswer =
        answer;

    gameState.currentQuestion =
        `${a} ${operation} ${b}`;

    question.textContent =
        gameState.currentQuestion;

    questionLabel.textContent =
        "Choose the correct answer";


    let options = [
        answer
    ];


    while (
        options.length < 4
    ) {

        const difference =
            randomNumber(
                1,
                Math.max(5, Math.floor(answer * 0.25))
            );

        const fake =
            Math.random() > 0.5
                ? answer + difference
                : answer - difference;


        if (
            fake >= 0 &&
            !options.includes(fake)
        ) {

            options.push(fake);

        }

    }


    options =
        shuffle(options);


    answerOptions.forEach(
        function(button, index) {

            button.textContent =
                options[index];

            button.className =
                "answer-option";

            button.disabled = false;

        }
    );

}


/* =========================================================
   19. NUMBER RUSH QUESTION
========================================================= */

function createRushQuestion() {

    showInputMode();

    const difficulty =
        getDifficulty();

    const a =
        randomNumber(
            10,
            difficulty + 15
        );

    const b =
        randomNumber(
            2,
            12
        );

    const operations = [
        "+",
        "-",
        "×"
    ];

    const operation =
        randomItem(operations);

    let answer;


    if (operation === "+") {

        answer = a + b;

    }

    else if (
        operation === "-"
    ) {

        answer =
            Math.max(
                0,
                a - b
            );

    }

    else {

        answer = a * b;

    }


    gameState.currentAnswer =
        answer;

    gameState.currentQuestion =
        `${a} ${operation} ${b}`;

    question.textContent =
        gameState.currentQuestion;

    questionLabel.textContent =
        "Keep your streak alive";

}


/* =========================================================
   20. PRACTICE QUESTION
========================================================= */

function createPracticeQuestion() {

    showInputMode();

    const a =
        randomNumber(
            1,
            50
        );

    const b =
        randomNumber(
            1,
            30
        );

    const operation =
        randomItem([
            "+",
            "-",
            "×"
        ]);

    let answer;


    if (operation === "+") {

        answer = a + b;

    }

    else if (
        operation === "-"
    ) {

        answer =
            Math.max(
                0,
                a - b
            );

    }

    else {

        answer = a * b;

    }


    gameState.currentAnswer =
        answer;

    gameState.currentQuestion =
        `${a} ${operation} ${b}`;

    question.textContent =
        gameState.currentQuestion;

    questionLabel.textContent =
        "Practice";

}


/* =========================================================
   21. MEMORY QUESTION
========================================================= */

function createMemoryQuestion() {

    hideInputMode();

    memoryArea.classList.remove(
        "hidden"
    );

    const length =
        Math.min(
            4 +
            Math.floor(
                gameState.questionNumber / 2
            ),

            10
        );


    let sequence = "";

    for (
        let i = 0;
        i < length;
        i++
    ) {

        sequence +=
            randomNumber(0, 9);

    }


    gameState.memorySequence =
        sequence;

    gameState.memoryShowing =
        true;

    memoryNumber.textContent =
        sequence;

    memoryInstruction.textContent =
        "Remember this number...";


    memoryInput.classList.add(
        "hidden"
    );

    memorySubmit.classList.add(
        "hidden"
    );


    gameState.memoryTimeout =
        setTimeout(function() {

            memoryNumber.textContent =
                "••••••";

            memoryInstruction.textContent =
                "Now enter the number";

            memoryInput.classList.remove(
                "hidden"
            );

            memorySubmit.classList.remove(
                "hidden"
            );

            memoryInput.focus();

            gameState.memoryShowing =
                false;

        }, 1800);

}


/* =========================================================
   22. SHOW INPUT MODE
========================================================= */

function showInputMode() {

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


/* =========================================================
   23. HIDE INPUT MODE
========================================================= */

function hideInputMode() {

    inputArea.classList.add(
        "hidden"
    );

}


/* =========================================================
   24. GET DIFFICULTY
========================================================= */

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


/* =========================================================
   25. SUBMIT TEXT ANSWER
========================================================= */

function submitCurrentAnswer() {

    if (
        !gameState.active
    ) {

        return;

    }

    if (
        gameState.questionAnswered
    ) {

        return;

    }

    const value =
        Number(
            answerInput.value
        );


    if (
        answerInput.value.trim() === ""
    ) {

        showFeedback(
            "Type an answer first.",
            "wrong"
        );

        return;

    }


    checkAnswer(
        value
    );

}


/* =========================================================
   26. CHECK ANSWER
========================================================= */

function checkAnswer(answer) {

    if (
        gameState.questionAnswered
    ) {

        return;

    }

    gameState.questionAnswered =
        true;


    const correct =
        Number(answer) ===
        Number(gameState.currentAnswer);


    if (correct) {

        handleCorrect();

    }

    else {

        handleWrong();

    }


    setTimeout(
        function() {

            if (
                gameState.active
            ) {

                nextQuestion();

            }

        },

        gameState.mode === "practice"
            ? 500
            : 650

    );

}


/* =========================================================
   27. CORRECT ANSWER
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


    let points =
        10;


    /*
        Streak bonus
    */

    points +=
        Math.min(
            gameState.streak * 2,
            30
        );


    /*
        Speed bonus
    */

    if (
        gameState.mode !== "practice" &&
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


    /*
        Add XP
    */

    addXP(
        5
    );

}


/* =========================================================
   28. WRONG ANSWER
========================================================= */

function handleWrong() {

    gameState.wrong++;

    gameState.streak = 0;

    gameState.lives--;


    updateGameUI();


    showFeedback(
        `Wrong! Answer: ${gameState.currentAnswer}`,
        "wrong"
    );


    playWrongSound();


    /*
        Shake game card
    */

    const card =
        document.querySelector(
            ".game-card"
        );

    card.classList.add(
        "shake"
    );


    setTimeout(function() {

        card.classList.remove(
            "shake"
        );

    }, 300);


    /*
        End if no lives
    */

    if (
        gameState.lives <= 0 &&
        gameState.mode !== "practice"
    ) {

        setTimeout(
            endGame,
            500
        );

    }

}


/* =========================================================
   29. MEMORY ANSWER
========================================================= */

function submitMemoryAnswer() {

    if (
        gameState.memoryShowing
    ) {

        return;

    }

    if (
        gameState.questionAnswered
    ) {

        return;

    }


    const answer =
        memoryInput.value.trim();


    if (!answer) {

        showFeedback(
            "Enter the number.",
            "wrong"
        );

        return;

    }


    gameState.questionAnswered =
        true;


    if (
        answer ===
        gameState.memorySequence
    ) {

        handleCorrect();

    }

    else {

        showFeedback(
            `Wrong! It was ${gameState.memorySequence}`,
            "wrong"
        );

        handleWrong();

    }


    setTimeout(
        function() {

            if (
                gameState.active
            ) {

                nextQuestion();

            }

        },

        700
    );

}


/* =========================================================
   30. OPTION ANSWER
========================================================= */

function selectOption(button) {

    if (
        gameState.questionAnswered
    ) {

        return;

    }


    const selected =
        Number(
            button.textContent
        );


    answerOptions.forEach(
        function(currentButton) {

            currentButton.disabled =
                true;

        }
    );


    gameState.questionAnswered =
        true;


    if (
        selected ===
        gameState.currentAnswer
    ) {

        button.classList.add(
            "correct"
        );

        handleCorrect();

    }

    else {

        button.classList.add(
            "wrong"
        );


        answerOptions.forEach(
            function(currentButton) {

                if (
                    Number(
                        currentButton.textContent
                    ) ===
                    gameState.currentAnswer
                ) {

                    currentButton.classList.add(
                        "correct"
                    );

                }

            }
        );


        handleWrong();

    }


    setTimeout(
        function() {

            if (
                gameState.active
            ) {

                nextQuestion();

            }

        },

        700
    );

}


/* =========================================================
   31. FEEDBACK
========================================================= */

function showFeedback(
    message,
    type
) {

    feedback.textContent =
        message;

    feedback.className =
        `feedback ${type}`;

}


/* =========================================================
   32. UPDATE GAME UI
========================================================= */

function updateGameUI() {

    gameScore.textContent =
        gameState.score;

    gameStreak.textContent =
        gameState.streak;

    gameLives.textContent =
        gameState.lives;

    gameCorrect.textContent =
        gameState.correct;

}


/* =========================================================
   33. END GAME
========================================================= */

function endGame() {

    if (
        !gameState.active
    ) {

        return;

    }


    gameState.active =
        false;


    stopTimer();

    clearTimeout(
        gameState.memoryTimeout
    );


    /*
        Save player statistics
    */

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

    savePlayerData();

    showResults();

}


/* =========================================================
   34. SHOW RESULTS
========================================================= */

function showResults() {

    const total =
        gameState.correct +
        gameState.wrong;


    let accuracy = 0;


    if (total > 0) {

        accuracy =
            Math.round(
                (
                    gameState.correct /
                    total
                ) * 100
            );

    }


    document.getElementById(
        "finalScore"
    ).textContent =
        gameState.score;


    document.getElementById(
        "resultCorrect"
    ).textContent =
        gameState.correct;


    document.getElementById(
        "resultWrong"
    ).textContent =
        gameState.wrong;


    document.getElementById(
        "resultAccuracy"
    ).textContent =
        accuracy + "%";


    document.getElementById(
        "resultBestStreak"
    ).textContent =
        gameState.bestStreak;


    /*
        Result message
    */

    const resultTitle =
        document.getElementById(
            "resultTitle"
        );

    const resultMessage =
        document.getElementById(
            "resultMessage"
        );


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

    showScreen(resultScreen);

}


/* =========================================================
   35. DAILY STREAK
========================================================= */

function updateDailyStreak() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


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


    const yesterdayString =
        yesterday
            .toISOString()
            .split("T")[0];


    if (
        playerData.lastPlayedDate ===
        yesterdayString
    ) {

        playerData.currentStreak++;

    }

    else {

        playerData.currentStreak =
            1;

    }


    playerData.lastPlayedDate =
        today;


    savePlayerData();

}


/* =========================================================
   36. ADD XP
========================================================= */

function addXP(amount) {

    playerData.xp += amount;


    const requiredXP =
        playerData.level * 100;


    while (
        playerData.xp >=
        requiredXP
    ) {

        playerData.xp -=
            requiredXP;

        playerData.level++;

    }


    savePlayerData();

    updateProfile();

}


/* =========================================================
   37. UPDATE PROFILE
========================================================= */

function updateProfile() {

    const level =
        playerData.level;


    document.getElementById(
        "profileLevel"
    ).textContent =
        level;


    const required =
        level * 100;


    const percentage =
        (
            playerData.xp /
            required
        ) * 100;


    document.getElementById(
        "xpProgress"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "xpText"
    ).textContent =
        `${playerData.xp} / ${required} XP`;


    document.getElementById(
        "navStreak"
    ).textContent =
        playerData.currentStreak;

}


/* =========================================================
   38. UPDATE HOME STATS
========================================================= */

function updateHomeStats() {

    document.getElementById(
        "homeGames"
    ).textContent =
        playerData.gamesPlayed;


    document.getElementById(
        "homeScore"
    ).textContent =
        playerData.bestScore;


    let accuracy = 0;


    if (
        playerData.totalQuestions > 0
    ) {

        accuracy =
            Math.round(
                (
                    playerData.totalCorrect /
                    playerData.totalQuestions
                ) * 100
            );

    }


    document.getElementById(
        "homeAccuracy"
    ).textContent =
        accuracy + "%";


    document.getElementById(
        "homeStreak"
    ).textContent =
        `${playerData.currentStreak} days`;


    document.getElementById(
        "navStreak"
    ).textContent =
        playerData.currentStreak;

}


/* =========================================================
   39. UPDATE STATS SCREEN
========================================================= */

function updateStatsScreen() {

    document.getElementById(
        "statsGames"
    ).textContent =
        playerData.gamesPlayed;


    document.getElementById(
        "statsBestScore"
    ).textContent =
        playerData.bestScore;


    let accuracy = 0;


    if (
        playerData.totalQuestions > 0
    ) {

        accuracy =
            Math.round(
                (
                    playerData.totalCorrect /
                    playerData.totalQuestions
                ) * 100
            );

    }


    document.getElementById(
        "statsAccuracy"
    ).textContent =
        accuracy + "%";


    document.getElementById(
        "statsBestStreak"
    ).textContent =
        playerData.bestStreak;


    /*
        Achievements
    */

    const achievementText =
        document.getElementById(
            "achievementText"
        );


    if (
        playerData.gamesPlayed >= 100
    ) {

        achievementText.textContent =
            "🏆 Century Player — 100 games completed!";

    }

    else if (
        playerData.bestScore >= 1000
    ) {

        achievementText.textContent =
            "⭐ Score Master — 1000+ points!";

    }

    else if (
        playerData.bestStreak >= 20
    ) {

        achievementText.textContent =
            "🔥 Streak Master — 20 correct answers!";

    }

    else if (
        playerData.gamesPlayed >= 10
    ) {

        achievementText.textContent =
            "🎮 Getting Serious — 10 games completed!";

    }

    else if (
        playerData.gamesPlayed >= 1
    ) {

        achievementText.textContent =
            "🌱 First Step — keep playing to unlock more.";

    }

    else {

        achievementText.textContent =
            "Play your first game to unlock achievements.";

    }

}


/* =========================================================
   40. SOUND EFFECTS
========================================================= */

function createBeep(
    frequency,
    duration
) {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            return;

        }


        const context =
            new AudioContext();


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.connect(
            gain
        );

        gain.connect(
            context.destination
        );


        oscillator.frequency.value =
            frequency;


        oscillator.type =
            "sine";


        gain.gain.setValueAtTime(
            0.08,
            context.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime +
            duration
        );


        oscillator.start();

        oscillator.stop(
            context.currentTime +
            duration
        );

    }

    catch (error) {

        console.log(
            "Audio unavailable."
        );

    }

}


/* =========================================================
   41. CORRECT SOUND
========================================================= */

function playCorrectSound() {

    createBeep(
        700,
        0.12
    );

}


/* =========================================================
   42. WRONG SOUND
========================================================= */

function playWrongSound() {

    createBeep(
        180,
        0.15
    );

}


/* =========================================================
   43. KEYBOARD ENTER
========================================================= */

answerInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            submitCurrentAnswer();

        }

    }
);


/* =========================================================
   44. MEMORY ENTER
========================================================= */

memoryInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            submitMemoryAnswer();

        }

    }
);


/* =========================================================
   45. SUBMIT BUTTON
========================================================= */

submitAnswer.addEventListener(
    "click",
    function() {

        submitCurrentAnswer();

    }
);


/* =========================================================
   46. MEMORY SUBMIT
========================================================= */

memorySubmit.addEventListener(
    "click",
    function() {

        submitMemoryAnswer();

    }
);


/* =========================================================
   47. ANSWER OPTIONS
========================================================= */

answerOptions.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                selectOption(
                    button
                );

            }
        );

    }
);


/* =========================================================
   48. MODE CARDS
========================================================= */

const modeCards =
    document.querySelectorAll(
        ".mode-card"
    );


modeCards.forEach(
    function(card) {

        card.addEventListener(
            "click",
            function() {

                const mode =
                    card.dataset.mode;

                startGame(mode);

            }
        );

    }
);


/* =========================================================
   49. QUICK PLAY
========================================================= */

quickPlayButton.addEventListener(
    "click",
    function() {

        startGame(
            "quick"
        );

    }
);


/* =========================================================
   50. PRACTICE
========================================================= */

practiceButton.addEventListener(
    "click",
    function() {

        startGame(
            "practice"
        );

    }
);


/* =========================================================
   51. EXIT GAME
========================================================= */

gameBackButton.addEventListener(
    "click",
    function() {

        const confirmed =
            window.confirm(
                "Are you sure you want to exit this game?"
            );


        if (confirmed) {

            gameState.active =
                false;

            stopTimer();

            clearTimeout(
                gameState.memoryTimeout
            );

            showScreen(
                homeScreen
            );

        }

    }
);


/* =========================================================
   52. PLAY AGAIN
========================================================= */

playAgainButton.addEventListener(
    "click",
    function() {

        startGame(
            gameState.mode
        );

    }
);


/* =========================================================
   53. HOME BUTTON
========================================================= */

homeButton.addEventListener(
    "click",
    function() {

        showScreen(
            homeScreen
        );

    }
);


/* =========================================================
   54. PROFILE
========================================================= */

profileButton.addEventListener(
    "click",
    function() {

        updateProfile();

        showScreen(
            profileScreen
        );

    }
);


/* =========================================================
   55. PROFILE BACK
========================================================= */

profileBackButton.addEventListener(
    "click",
    function() {

        showScreen(
            homeScreen
        );

    }
);


/* =========================================================
   56. STATS BUTTON
========================================================= */

/*
   Create a Stats button dynamically
   because we want to keep the navbar clean.
*/

const statsNavigation =
    document.createElement(
        "button"
    );


statsNavigation.textContent =
    "Stats";


statsNavigation.className =
    "secondary-button";


statsNavigation.style.padding =
    "9px 15px";


document.querySelector(
    ".nav-right"
).insertBefore(
    statsNavigation,
    profileButton
);


statsNavigation.addEventListener(
    "click",
    function() {

        updateStatsScreen();

        showScreen(
            statsScreen
        );

    }
);


/* =========================================================
   57. STATS BACK
========================================================= */

statsBackButton.addEventListener(
    "click",
    function() {

        showScreen(
            homeScreen
        );

    }
);


/* =========================================================
   58. TAB VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    function() {

        /*
            If the player switches tabs during a game,
            we don't pause the game.

            This keeps the timer behaving like a real
            timed challenge.
        */

        if (
            document.hidden &&
            gameState.active
        ) {

            console.log(
                "Game continues while tab is hidden."
            );

        }

    }
);


/* =========================================================
   59. INITIALIZE
========================================================= */

loadPlayerData();


/* =========================================================
   60. WELCOME MESSAGE
========================================================= */

console.log(
    "🧠 MindRush loaded successfully."
);

console.log(
    "Built with vanilla HTML, CSS and JavaScript."
);

console.log(
    "No libraries. No APIs."
);




















































































#gfgfgfgfgggfgfdsassaadssdaadasddddddaaaagzxzx`zfgfgdasdadadaddadasddsdadfgfvbghghghxccxzgzxssaassasasx`zx`zaefwesdsadasdewewerwdwwrewrewrrwerrwerwrwfgsgsfggdggsgfdgerttrwwtwerttrwrtrtwtwrtrfsdfvxcvfdsfressfjhfhfjhsuheururtuifjfjshiuierjfghksijkjhiiouiuuouiuwoerujfjfskoiurjkjfigkjfhjghriuruierioehv nx`zzxxzx`z`xz`