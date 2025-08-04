// 参加者情報・ルーム情報をローカルストレージから取得
let name = localStorage.getItem("playerName");
let room = localStorage.getItem("roomID");
let scores = JSON.parse(localStorage.getItem("scores")) || {};
let answered = [];
let usedQuestions = [];

// 画面にルームIDを表示
document.getElementById("roomDisplay").textContent = room;

// スコア初期化（初参加なら0点で登録）
scores[name] = scores[name] || 0;
localStorage.setItem("scores", JSON.stringify(scores));
renderPlayers();

// プレイヤー一覧と得点表示
function renderPlayers() {
  let html = "";
  for (let p in scores) {
    html += `${p}: ${scores[p]} 点 
      <button onclick="changeScore('${p}',1)">＋</button>
      <button onclick="changeScore('${p}',-1)">−</button><br>`;
  }
  document.getElementById("players").innerHTML = html;
}

// 得点の増減処理
function changeScore(p, delta) {
  scores[p] = (scores[p] || 0) + delta;
  localStorage.setItem("scores", JSON.stringify(scores));
  renderPlayers();
  checkWinner();
}

// クイズ開始（出題者が押す）
function startQuestion() {
  if (answered.length > 0) return alert("前の回答を判定してください");

  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      let pool = data.filter(q => !usedQuestions.includes(q.word));
      if (pool.length === 0) {
        usedQuestions = [];
        pool = data;
      }

      let q = pool[Math.floor(Math.random() * pool.length)];
      usedQuestions.push(q.word);

      // 出題者にのみ見えるアラート表示
      alert(`出題（出題者にのみ表示）: ${q.word}（ヒント: ${q.hint}）`);

      // 出題中を画面表示（出題者以外には中身は見えない）
      document.getElementById("question").textContent = "出題中...";
    });
}

// 回答ボタンを押した順に記録
function answer() {
  if (answered.includes(name)) return alert("すでに回答しています");
  answered.push(name);
  document.getElementById("answers").innerHTML = answered.join("<br>");
}

// 正解ボタンで回答者・出題者に1点加算
function correct() {
  if (answered.length === 0) return alert("回答者がいません");

  let correctUser = answered.shift();
  scores[correctUser] = (scores[correctUser] || 0) + 1;
  scores[name] = (scores[name] || 0) + 1;

  localStorage.setItem("scores", JSON.stringify(scores));
  renderPlayers();
  document.getElementById("answers").innerHTML = answered.join("<br>");
  document.getElementById("question").textContent = "";
  checkWinner();
}

// 不正解ボタンで次の回答者へ移行
function incorrect() {
  answered.shift();
  document.getElementById("answers").innerHTML = answered.join("<br>");
  if (answered.length === 0) {
    document.getElementById("question").textContent = "";
  }
}

// 優勝判定（10点に達したら勝利表示）
function checkWinner() {
  for (let p in scores) {
    if (scores[p] >= 10) {
      document.getElementById("winner").textContent = `${p} が10点達成！優勝🎉`;
    }
  }
}
