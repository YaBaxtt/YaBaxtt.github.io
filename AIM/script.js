const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const levelDisplay = document.getElementById("level");
const recordsList = document.getElementById("records");

let score = 0;
let time = 15;
let level = 1;
let gameInterval, timerInterval;

function startGame() {
  score = 0;
  time = 15;
  level = 1;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = time;
  levelDisplay.textContent = level;
  gameArea.innerHTML = "";
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  gameInterval = setInterval(() => {
    createCircle();
  }, 1000);

  timerInterval = setInterval(() => {
    time--;
    timeDisplay.textContent = time;
    if (time <= 0) {
      endGame();
    }
    if (score >= level * 10) {
      level++;
      levelDisplay.textContent = level;
      clearInterval(gameInterval);
      gameInterval = setInterval(() => {
        createCircle();
      }, Math.max(300, 1000 - level * 100)); // ускорение
    }
  }, 1000);
}

function createCircle() {
  const circle = document.createElement("div");
  circle.classList.add("circle");

  const x = Math.random() * (gameArea.clientWidth - 50);
  const y = Math.random() * (gameArea.clientHeight - 50);

  circle.style.left = x + "px";
  circle.style.top = y + "px";

  circle.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;
    circle.remove();
  });

  gameArea.appendChild(circle);

  setTimeout(() => {
    if (circle.parentNode) {
      circle.remove();
    }
  }, 2000);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  alert("Игра окончена! Ваш результат: " + score);
  saveRecord(score);
  showRecords();
}

function saveRecord(score) {
  let records = JSON.parse(localStorage.getItem("bbaxtttRecords")) || [];
  records.push({ score: score, date: new Date().toLocaleString() });
  records.sort((a, b) => b.score - a.score);
  records = records.slice(0, 5); // топ-5
  localStorage.setItem("bbaxtttRecords", JSON.stringify(records));
}

function showRecords() {
  recordsList.innerHTML = "";
  let records = JSON.parse(localStorage.getItem("bbaxtttRecords")) || [];
  records.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.score} очков — ${r.date}`;
    recordsList.appendChild(li);
  });
}

showRecords();
startBtn.addEventListener("click", startGame);
