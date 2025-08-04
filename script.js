const nickname = localStorage.getItem("nickname");
const roomId = new URLSearchParams(location.search).get("roomId");

const players = new Set();
const answerOrder = [];
let isQuestionActive = false;

window.addEventListener("DOMContentLoaded", () => {
  if (!nickname) {
    alert("名前が設定されていません。room.htmlに戻ります");
    window.location.href = "room.html";
    return;
  }

  players.add(nickname);
  updatePlayerList();

  document.getElementById("startQuestion").addEventListener("click", () => {
    if (isQuestionActive) return;
    startQuestion();
  });

  document.getElementById("answerBtn").addEventListener("click", () => {
    if (!isQuestionActive || answerOrder.includes(nickname)) return;
    answerOrder.push(nickname);
    updateAnswerOrder();
  });

  document.getElementById("judgeCorrect").addEventListener("click", () => {
    endQuestion();
  });

  document.getElementById("judgeIncorrect").addEventListener("click", () => {
    endQuestion();
  });
});

function updatePlayerList() {
  const container = document.getElementById("playerList");
  container.innerHTML = `<h2>参加者</h2><ul>${[...players].map(p => `<li>${p}</li>`).join("")}</ul>`;
}

function updateAnswerOrder() {
  const container = document.getElementById("answerOrder");
  container.innerHTML = `<h2>回答順</h2><ol>${answerOrder.map(name => `<li>${name}</li>`).join("")}</ol>`;
}

function startQuestion() {
  isQuestionActive = true;
  answerOrder.length = 0;
  updateAnswerOrder();
  document.getElementById("questionArea").innerText = "出題：『富士山の高さは何メートル？』";
}

function endQuestion() {
  isQuestionActive = false;
  document.getElementById("questionArea").innerText = "出題終了";
}
