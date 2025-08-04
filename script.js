let questions = [];
let usedQuestions = new Set();
let answerOrder = [];
let scores = {};
let currentQuestion = null;
let questionActive = false;

const hostName = localStorage.getItem("nickname") || "ホスト";
const roomID = localStorage.getItem("roomId") || "未設定";
document.getElementById("hostName").textContent = hostName;
document.getElementById("roomID").textContent = roomID;

fetch("questions.json")
  .then(res => res.json())
  .then(data => questions = data);

const showQuestionBtn = document.getElementById("showQuestionBtn");
showQuestionBtn.addEventListener("click", () => {
  if (questionActive) return;

  let unused = questions.filter(q => !usedQuestions.has(q.question));
  if (unused.length === 0) {
    alert("すべての問題を出題しました！");
    return;
  }

  const random = unused[Math.floor(Math.random() * unused.length)];
  currentQuestion = random.question;
  usedQuestions.add(currentQuestion);
  answerOrder = [];
  updateAnswerOrder();

  alert(`出題：\n${currentQuestion}`); // 出題者にだけ表示
  document.getElementById("questionArea").textContent = "問題が表示されました（出題者にのみ）";

  questionActive = true;
  showQuestionBtn.disabled = true;
});

function recordAnswer() {
  const name = prompt("あなたの名前を入力してください");
  if (!name) return;

  if (!scores[name]) {
    scores[name] = 0;
    addToScoreTable(name);
  }

  answerOrder.push(name);
  updateAnswerOrder();
}

function updateAnswerOrder() {
  const display = answerOrder.length > 0 ? answerOrder.join(" → ") : "なし";
  document.getElementById("answerOrder").textContent = "回答順：" + display;
}

function judge(isCorrect) {
  if (!questionActive || answerOrder.length === 0) return;

  const answerer = answerOrder.shift();
  if (isCorrect) {
    scores[answerer]++;
    scores[hostName] = (scores[hostName] || 0) + 1;
  }

  updateScores();
  updateAnswerOrder();
  checkWinner();

  questionActive = false;
  showQuestionBtn.disabled = false;
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
      document.getElementById("winnerArea").textContent = `${name} が優勝しました！🎉`;
    }
  }
}
