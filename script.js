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
}

function judge(isCorrect) {
  if (answerOrder.length === 0) return;
  const answerer = answerOrder.shift();
  if (isCorrect) {
    scores[answerer] = (scores[answerer] || 0) + 1;
    scores[hostName] = (scores[hostName] || 0) + 1;
  }
  updateScores();
  checkWinner();
}

function updateScores() {
  const board = Object.entries(scores).map(([name, score]) => `${name}: ${score}点`);
  document.getElementById("scoreBoard").innerHTML = board.join("<br>");
}

function checkWinner() {
  for (let name in scores) {
    if (scores[name] >= 10) {
      document.getElementById("winnerArea").textContent = `${name}が優勝しました！🎉`;
    }
  }
}
