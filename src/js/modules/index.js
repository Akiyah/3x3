import { Game } from './game.js';
import { State } from './state.js';

function td(x, y) {
  const boardDiv = document.getElementById("board");
  const trDivs = boardDiv.getElementsByTagName("tr");
  const tdDivs = trDivs[y].getElementsByTagName("td");
  return tdDivs[x];
};

function setMark(x, y, mark) {
  td(x, y).innerText = mark;
};

function refreshMarks(state) {
  [0, 1, 2].forEach(y => {
    [0, 1, 2].forEach(x => {
      setMark(x, y, state.mark([x, y]));
    });
  });
}

function refreshResult(state) {
  const winnerSpan = document.getElementById("winner");
  winnerSpan.innerText = state.winner();
}

function lastState(states) {
  return states[states.length - 1];
}

function refresh(states) {
  refreshMarks(lastState(states));
  refreshResult(lastState(states));
}

function clear(states) {
  states.splice(0);
  states.push(new State());
}

function click(game, states, x, y) {
  if (lastState(states).winner()) {
    clear(states);
    refresh(states);
    return;
  }

  let state = lastState(states);
  if (!state.enable([x, y])) {
    return;
  }

  state = state.step([x, y]);
  states.push(state);
  if (state.winner()) {
    refresh(states);
    return;
  }

  const action = game.findAction(state, 0);
  state = state.step(action);
  states.push(state);
  refresh(states);
};

function initialize() {
  const game = new Game();
  const states = [];

  [0, 1, 2].forEach(y => {
    [0, 1, 2].forEach(x => {
      td(x, y).addEventListener("click", () => click(game, states, x, y))
    });
  });
  clear(states);

  let episodes = 0;
  const timer = setInterval(() => {
    for (let i = 0; i < 100; i++) {
      const episode = game.findEpisode(0.1);
      game.train(episode);
      episodes++;
    }
    document.getElementById("episodes").innerText = episodes;
    document.getElementById("q_table_count").innerText = game.quality.count();
    if (100 * 1000 <= episodes) {
      clearInterval(timer);
    }
  }, 100);
}

initialize();
