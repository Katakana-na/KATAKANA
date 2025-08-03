let questions = [];
let usedQuestions = new Set();
let answerOrder = [];
let scores = {};
let currentQuestion = null;

const hostName = localStorage.getItem("nickname");
const roomID = localStorage.getItem("roomId");
document.getElementById("hostName").textContent = hostName;
document.getElementById("roomID").textContent = roomID;

fetch("questions.json")
  .then(res => res.json())
  .then(data => questions = data);

document.getElementById("showQuestionBtn").addEventListener("click", () => {
  let unused = questions.filter(q => !usedQuestions.has(q.question));
  if (unused.length === 0) {
    alert("すべての問題を出題しました！");
    return;
  }
  const random = unused[Math.floor(Math.random() * unused.length)];
  currentQuestion = random.question;
  usedQuestions.add(currentQuestion);
  document.getElementById("questionArea").textContent = currentQuestion;
  answerOrder = [];
  document.getElementById("answerOrder").textContent = "";
});

function recordAnswer() {
  const name = prompt("あなたの名前を入力してください");
  if (!name) return;
  answerOrder.push(name);
  document.getElementById("answerOrder").textContent = "回答順：" + answerOrder.join(" → ");
  if (!scores[name]) {
    scores[name] = 0;
    addToScoreTable(name);
  }
}

function judge(isCorrect) {
  if (answerOrder.length === 0) return;
  const answerer = answerOrder.shift();
  if (isCorrect) {
    scores[answerer]++;
    scores[hostName] = scores[hostName] || 0;
    scores[hostName]++;
  }
  updateScores();
  checkWinner();
  document.getElementById("answerOrder").textContent = "回答順：" + answerOrder.join(" → ");
}

function addToScoreTable(name) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${name}</td>
    <td id="score-${name}">0</td>
    <td><button onclick="adjustScore('${name}', 1)">＋</button></td>
    <td><button onclick="adjustScore('${name}', -1)">−</button></td>
  `;
  document.getElementById("scoreBody").appendChild(row);
}

function adjustScore(name, delta) {
  scores[name] = (scores[name] || 0) + delta;
  if (scores[name] < 0) scores[name] = 0;
  updateScores();
  checkWinner();
}

function updateScores() {
  for (let name in scores) {
    const cell = document.getElementById(`score-${name}`);
    if (cell) cell.textContent = scores[name];
  }
}

function checkWinner() {
  for (let name in scores) {
    if (scores[name] >= 10) {
      document.getElementById("winnerArea").textContent = `${name}が優勝しました！🎉`;
    }
  }
}
