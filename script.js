const nickname = localStorage.getItem("nickname");
const roomId = new URLSearchParams(location.search).get("roomId");

const players = new Map(); // 名前 → 得点
const answerOrder = [];
let isQuestionActive = false;
let questions = [];
let currentQuestion = null;

window.addEventListener("DOMContentLoaded", () => {
  if (!nickname) {
    alert("名前が設定されていません。room.htmlに戻ります");
    window.location.href = "room.html";
    return;
  }

  if (!players.has(nickname)) {
    players.set(nickname, 0);
  }

  updatePlayerList();
  updateScoreBoard();

  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      questions = data;
    });

  document.getElementById("startQuestion").addEventListener("click", () => {
    if (isQuestionActive || questions.length === 0) return;
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    alert(`出題：『${currentQuestion.question}』`);
    startQuestion(currentQuestion.question);
  });

  document.getElementById("answerBtn").addEventListener("click", () => {
    if (!isQuestionActive || answerOrder.includes(nickname)) return;
    answerOrder.push(nickname);
    updateAnswerOrder();
  });

  document.getElementById("judgeCorrect").addEventListener("click", () => {
    if (!isQuestionActive) return;
    const first = answerOrder[0];
    if (first && players.has(first)) {
      players.set(first, players.get(first) + 1);
    }
    endQuestion();
  });

  document.getElementById("judgeIncorrect").addEventListener("click", () => {
    endQuestion();
  });
});

function updatePlayerList() {
  const container = document.getElementById("playerList");
  container.innerHTML = `<h2>参加者</h2><ul>${[...players.keys()].map(p => `<li>${p}</li>`).join("")}</ul>`;
}

function updateScoreBoard() {
  const container = document.getElementById("scoreBoard");
  container.innerHTML = `<h2>得点</h2><ul>${[...players.entries()].map(([name, score]) => `<li>${name}: ${score}点</li>`).join("")}</ul>`;
}

function updateAnswerOrder() {
  const container = document.getElementById("answerOrder");
  container.innerHTML = `<h2>回答順</h2><ol>${answerOrder.map(name => `<li>${name}</li>`).join("")}</ol>`;
}

function startQuestion(text) {
  isQuestionActive = true;
  answerOrder.length = 0;
  updateAnswerOrder();
  document.getElementById("questionArea").innerText = `出題：『${text}』`;
}

function endQuestion() {
  isQuestionActive = false;
  document.getElementById("questionArea").innerText = "出題終了";
  updateScoreBoard();
}
