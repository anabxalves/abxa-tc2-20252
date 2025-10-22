const display = document.getElementById('timerDisplay');
const controlPanel = document.querySelector('.control-panel');
const allColumns = document.querySelectorAll('.mode-column');

let currentMode = 0;
let timerInterval;
let startTime = 0;
let totalElapsedTime = 0;
let isRunning = false;
let countdownTargetMs = 0;

function formatTime(ms) {
    ms = Math.max(0, ms);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    const pad = n => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}

function getInputValueMs(mode) {
    const inputH = document.getElementById(`input${mode}Hours`);
    const inputM = document.getElementById(`input${mode}Minutes`);
    const inputS = document.getElementById(`input${mode}Seconds`);

    if (!inputH || !inputM || !inputS) return 0;

    const h = parseInt(inputH.value) || 0;
    const m = parseInt(inputM.value) || 0;
    const s = parseInt(inputS.value) || 0;

    if (mode === 2) {
        return (h * 3600 + m * 60 + s) * 1000;
    } else if (mode === 3) {
        const now = new Date();
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s, 0);

        if (targetDate.getTime() < now.getTime()) {
            targetDate.setDate(targetDate.getDate() + 1);
        }
        return targetDate.getTime();
    }
    return 0;
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function updateTimer() {
    const currentTime = Date.now();
    let displayTime = 0;

    if (currentMode === 1) {
        displayTime = currentTime - startTime;
    } else if (currentMode === 2) {
        const timePassedSinceStart = currentTime - startTime;
        displayTime = countdownTargetMs - timePassedSinceStart;
    } else if (currentMode === 3) {
        displayTime = countdownTargetMs - currentTime;
    }

    totalElapsedTime = displayTime;
    display.textContent = formatTime(totalElapsedTime);

    if (currentMode !== 1 && totalElapsedTime <= 0) {
        handleReset();
        display.textContent = formatTime(0);
    }
}

function handleStart(mode) {
    if (isRunning && currentMode !== mode) {
        handleReset();
    }

    setActiveMode(mode);

    if (isRunning) {
        return;
    }

    if (mode === 1) {
        startTime = Date.now() - totalElapsedTime;
    } else if (mode === 2) {
        const durationMs = getInputValueMs(2);

        if (durationMs === 0) {
            alert("Set a duration (H:M:S) before starting Mode 2.");
            return;
        }

        countdownTargetMs = durationMs;
        startTime = Date.now() - (countdownTargetMs - totalElapsedTime);
    } else if (mode === 3) {
        countdownTargetMs = getInputValueMs(3);
    }

    isRunning = true;
    timerInterval = setInterval(updateTimer, 10);
}

function handleStop(mode) {
    if (currentMode !== mode || !isRunning) return;

    stopTimer();
}

function handleReset() {
    stopTimer();

    if (currentMode === 1) {
        totalElapsedTime = 0;
    } else if (currentMode === 2) {
        totalElapsedTime = getInputValueMs(2);
    } else if (currentMode === 3) {
        const targetMs = getInputValueMs(3);
        totalElapsedTime = Math.max(0, targetMs - Date.now());
    }

    display.textContent = formatTime(totalElapsedTime);
}

function setActiveMode(mode) {
    currentMode = mode;
    allColumns.forEach(column => {
        column.classList.remove('active-mode');
        if (parseInt(column.dataset.mode) === mode) {
            column.classList.add('active-mode');
        }
    });
}

function initialize() {
    const now = new Date();
    document.getElementById('input3Hours').value = String(now.getHours()).padStart(2, '0');
    document.getElementById('input3Minutes').value = String(now.getMinutes() + 1).padStart(2, '0');

    setActiveMode(1);
    handleReset();

    controlPanel.addEventListener('click', (e) => {
        const target = e.target;
        const action = target.dataset.action;
        const mode = parseInt(target.dataset.mode);

        if (mode && action) {
            if (isRunning && currentMode !== mode) {
                handleStop(currentMode);
            }

            if (action === 'start') {
                handleStart(mode);
            } else if (action === 'stop') {
                handleStop(mode);
            } else if (action === 'reset') {
                handleReset();
                setActiveMode(mode);
            }
        }
    });
}

initialize();