import { Game } from './game.js';
import { State } from './state.js';

const game = new Game();

let count = 0;
const timer = setInterval(() => {
  for (let i = 0; i < 100; i++) {
    const episode = game.findEpisode(0.1);
    game.train(episode);
    count++;
  }
  document.getElementById("count").innerText = `learn ${count} episodes.`;
  if (100 * 1000 <= count) {
    clearInterval(timer);
  }
}, 100);

function td(x, y) {
  const boardDiv = document.getElementById("board");
  const trDivs = boardDiv.getElementsByTagName("tr");
  const tdDivs = trDivs[y].getElementsByTagName("td");
  return tdDivs[x];
};

function mark(x, y) {
  const mark = td(x, y).innerText;
  return mark == "" ? "_" : mark;
};

function setMark(x, y, mark) {
  td(x, y).innerText = mark;
};

function marks() {
  return [
    [mark(0, 0), mark(1, 0), mark(2, 0)],
    [mark(0, 1), mark(1, 1), mark(2, 1)],
    [mark(0, 2), mark(1, 2), mark(2, 2)]
  ]
};

function currentState() {
  return new State(marks());
};

function clear() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerText = "";
  [0, 1, 2].forEach(y => {
    [0, 1, 2].forEach(x => {
      setMark(x, y, "");
    });
  });
};

let winner = null;

function result(w) {
  winner = w;
  const resultDiv = document.getElementById("result");

  if (w == null) {
    clear();
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

[0, 1, 2].forEach(y => {
  [0, 1, 2].forEach(x => {
    td(x, y).addEventListener("click", (e) => move(e, x, y))
  });
});
