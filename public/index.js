import { Game } from '../src/js/modules/game.js';
import { State } from '../src/js/modules/state.js';

const game = new Game();

let count = 0;
const timer = setInterval(() => {
  for (let i = 0; i < 1000; i++) {
    const episode = game.findEpisode(0.1);
    game.train(episode);
  }
  count++;
  console.log(count);
  document.getElementById("count").innerText = `learn ${count * 1000} episodes.`;
  if (count > 1000) {
    clearInterval(timer);
    console.log("clear");
  }
}, 1000);

function mark(x, y) {
  const boardDiv = document.getElementById("board");
  const trDivs = boardDiv.getElementsByTagName("tr");
  const tdDivs = trDivs[y].getElementsByTagName("td");
  const mark = tdDivs[x].innerText;
  return mark == "" ? "_" : mark;
};

function setMark(x, y, mark) {
  const boardDiv = document.getElementById("board");
  const trDivs = boardDiv.getElementsByTagName("tr");
  const tdDivs = trDivs[y].getElementsByTagName("td");
  tdDivs[x].innerText = mark;
};

function marks() {
  return [
    [mark(0, 0), mark(1, 0), mark(2, 0)],
    [mark(0, 1), mark(1, 1), mark(2, 1)],
    [mark(0, 2), mark(1, 2), mark(2, 2)]
  ]
};

let winner = null;

function result(w) {
  winner = w;
  const resultDiv = document.getElementById("result");

  if (w == null) {
    resultDiv.innerText = "";
    setMark(0, 0, "");
    setMark(1, 0, "");
    setMark(2, 0, "");
    setMark(0, 1, "");
    setMark(1, 1, "");
    setMark(2, 1, "");
    setMark(0, 2, "");
    setMark(1, 2, "");
    setMark(2, 2, "");
    return;
  }

  if (w == "-") {
    resultDiv.innerText = "Draw";
    return;
  }

  resultDiv.innerText = w + " win";
}

function move(e, x, y) {
  console.log([x, y]);
  if (winner) {
    result(null);
    return;
  }

  const state0 = new State(marks());
  const state1 = state0.step([x, y]);
  setMark(x, y, "o");
  console.log(state1);
  if (state1.winner()) {
    console.log(state1.winner());
    result(state1.winner());
    return;
  }

  const action1 = game.findAction(state1, 0);
  const state2 = state1.step(action1);
  setMark(action1[0], action1[1], "x");

  console.log(state2);
  if (state2.winner()) {
    console.log(state2.winner());
    result(state2.winner());
    return;
  }
};

const boardDiv = document.getElementById("board");
const trDivs = boardDiv.getElementsByTagName("tr");
const tdDivs0 = trDivs[0].getElementsByTagName("td");
const tdDivs1 = trDivs[1].getElementsByTagName("td");
const tdDivs2 = trDivs[2].getElementsByTagName("td");

tdDivs0[0].addEventListener("click", (e) => move(e, 0, 0));
tdDivs0[1].addEventListener("click", (e) => move(e, 1, 0));
tdDivs0[2].addEventListener("click", (e) => move(e, 2, 0));
tdDivs1[0].addEventListener("click", (e) => move(e, 0, 1));
tdDivs1[1].addEventListener("click", (e) => move(e, 1, 1));
tdDivs1[2].addEventListener("click", (e) => move(e, 2, 1));
tdDivs2[0].addEventListener("click", (e) => move(e, 0, 2));
tdDivs2[1].addEventListener("click", (e) => move(e, 1, 2));
tdDivs2[2].addEventListener("click", (e) => move(e, 2, 2));
