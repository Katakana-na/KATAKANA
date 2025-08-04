let name = localStorage.getItem("playerName");
let room = localStorage.getItem("roomID");
let scores = JSON.parse(localStorage.getItem("scores")) || {};
let answered = [];
let usedQuestions = [];

document.getElementById("roomDisplay").textContent = room;
scores[name] = scores[name] || 0;
localStorage.setItem("scores", JSON.stringify(scores));
renderPlayers();

function renderPlayers() {
  let html = "";
  for (let p in scores) {
    html += `${p}: ${scores[p]} 点 
      <button onclick="changeScore('${p}',1)">＋</button>
      <button onclick="changeScore('${p}',-1)">−</button><br>`;
  }
  document.getElementById("players").innerHTML = html;
}

function changeScore(p, delta) {
  scores[p] = (scores[p] || 0) + delta;
  localStorage.setItem("scores", JSON.stringify(scores));
  renderPlayers();
  checkWinner();
}

function startQuestion() {
  if (answered.length > 0) return alert("前の回答を判定してください");
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      let pool = data.filter(q => !usedQuestions.includes(q));
      if (pool.length === 0) {
        usedQuestions = [];
        pool = data;
      }
      let q = pool[Math.floor(Math.random() * pool.length)];
      usedQuestions.push(q);
      alert("出題（出題者にのみ表示）: " + q);
      document.getElementById("question").textContent = "出題中...";
    });
}

function answer() {
  if (answered.includes(name)) return alert("すでに回答しています");
  answered.push(name);
  document.getElementById("answers").innerHTML = answered.join("<br>");
}

function correct() {
  if (answered.length === 0) return alert("回答者がいません");
  let correctUser = answered.shift();
  scores[correctUser] = (scores[correctUser] || 0) + 1;
  scores[name] = (scores[name] || 0) + 1;
  document.getElementById("answers").innerHTML = answered.join("<br>");
  localStorage.setItem("scores", JSON.stringify(scores));
  renderPlayers();
  checkWinner();
  document.getElementById("question").textContent = "";
}

function incorrect() {
  answered.shift();
  document.getElementById("answers").innerHTML = answered.join("<br>");
  if (answered.length === 0) {
    document.getElementById("question").textContent = "";
  }
}

function checkWinner() {
  for (let p in scores) {
    if (scores[p] >= 10) {
      document.getElementById("winner").textContent = `${p}が10点達成！優勝🎉`;
    }
  }
}
