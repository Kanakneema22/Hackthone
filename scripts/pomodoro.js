// Element references
const timer = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const ledIndicator = document.getElementById("led-indicator");
const timerStatus = document.getElementById("timer-status");

// Pomodoro settings
const WORK_MIN = 25;
const SHORT_BREAK_MIN = 5;
const LONG_BREAK_MIN = 15;
const POMODOROS_BEFORE_LONG_BREAK = 4;

// Timer state
let intervalId = null;
let timeLeft = WORK_MIN * 60;
let pomodoroCount = 0;
let isRunning = false;
let currentMode = "work"; // "work", "short-break", "long-break"

// Utility: Show SweetAlert message
function showAlert(message) {
  Swal.fire({
    title: message,
    icon: "info",
    confirmButtonText: "OK",
  });
}

// Update timer display
function updateDisplay(secondsLeft) {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  minutes.textContent = String(m).padStart(2, "0");
  seconds.textContent = String(s).padStart(2, "0");
}

// Set mode: work / short-break / long-break
function setMode(mode) {
  currentMode = mode;
  switch (mode) {
    case "work":
      timeLeft = WORK_MIN * 60;
      ledIndicator.style.backgroundColor = "green";
      ledIndicator.style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.5)";
      timer.classList.add("pomodoro-animation");
      timer.classList.remove("break-animation");
      timerStatus.textContent = "Work Session";
      timerStatus.style.color = "green";
      break;
    case "short-break":
      timeLeft = SHORT_BREAK_MIN * 60;
      ledIndicator.style.backgroundColor = "orange";
      ledIndicator.style.boxShadow = "0 0 10px rgba(255, 165, 0, 0.7)";
      timer.classList.add("break-animation");
      timer.classList.remove("pomodoro-animation");
      timerStatus.textContent = "Short Break";
      timerStatus.style.color = "orange";
      break;
    case "long-break":
      timeLeft = LONG_BREAK_MIN * 60;
      ledIndicator.style.backgroundColor = "blue";
      ledIndicator.style.boxShadow = "0 0 10px rgba(0, 0, 255, 0.7)";
      timer.classList.add("break-animation");
      timer.classList.remove("pomodoro-animation");
      timerStatus.textContent = "Long Break";
      timerStatus.style.color = "blue";
      break;
  }
  updateDisplay(timeLeft);
  startButton.disabled = false;
  stopButton.disabled = true;
}

// Start or resume timer
function startPomodoro() {
  if (isRunning) return;
  isRunning = true;
  startButton.disabled = true;
  stopButton.disabled = false;

  intervalId = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalId);
      isRunning = false;
      handleTimerEnd();
      return;
    }
    timeLeft--;
    updateDisplay(timeLeft);
  }, 1000);
}

// Pause timer
function stopPomodoro() {
  if (!isRunning) return;
  clearInterval(intervalId);
  isRunning = false;
  startButton.disabled = false;
  stopButton.disabled = true;
}

// Reset timer and cycle
function resetPomodoro() {
  clearInterval(intervalId);
  isRunning = false;
  pomodoroCount = 0;
  setMode("work");
  startButton.disabled = false;
  stopButton.disabled = true;
}

// What happens when timer ends
function handleTimerEnd() {
  showAlert(
    currentMode === "work"
      ? "Work session complete! Time for a break."
      : "Break over! Time to work."
  );

  if (currentMode === "work") {
    pomodoroCount++;
    if (pomodoroCount % POMODOROS_BEFORE_LONG_BREAK === 0) {
      setMode("long-break");
    } else {
      setMode("short-break");
    }
  } else {
    setMode("work");
  }
  startPomodoro();
}

// Initial setup
setMode("work");
stopButton.disabled = true;

// Event listeners
startButton.addEventListener("click", startPomodoro);
stopButton.addEventListener("click", stopPomodoro);
resetButton.addEventListener("click", resetPomodoro);