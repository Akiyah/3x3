import { Game } from './game.js';
import { State } from './state.js';
import { Action } from './action.js';

function td(x, y) {
  const boardDiv = document.getElementById("board");
  const trDivs = boardDiv.getElementsByTagName("tr");
  const tdDivs = trDivs[y].getElementsByTagName("td");
  return tdDivs[x];
};

function refresh(state) {
  [0, 1, 2].forEach(y => {
    [0, 1, 2].forEach(x => {
      td(x, y).innerText = state.mark(new Action(x, y));
    });
  });

  document.getElementById("winner").innerText = state.winner();
}

function clear(env) {
  env.state = new State();

  if (document.getElementById("player").value == "x") {
    const action = env.game.findAction(env.state, 0);
    env.state = env.state.step(action);
  }
}

function click(env, x, y) {
  if (env.state.winner()) {
    clear(env);
    refresh(env.state);
    return;
  }

  if (!env.state.enable(new Action(x, y))) {
    return;
  }

  env.state = env.state.step(new Action(x, y));
  if (env.state.winner()) {
    refresh(env.state);
    return;
  }

  const action = env.game.findAction(env.state, 0);
  env.state = env.state.step(action);
  refresh(env.state);
};

function initialize() {
  const env = {
    game: new Game(),
    state: null
  };

  [0, 1, 2].forEach(y => {
    [0, 1, 2].forEach(x => {
      td(x, y).addEventListener("click", () => click(env, x, y))
    });
  });
  clear(env);

  const timer = setInterval(() => {
    for (let i = 0; i < 100; i++) {
      const episode = env.game.findEpisode(0.1);
      env.game.train(episode);
    }
    document.getElementById("train_count").innerText = env.game.trainCount;
    document.getElementById("q_table_count").innerText = env.game.quality.count();
    if (100 * 1000 <= env.game.trainCount) {
      clearInterval(timer);
    }
  }, 100);
}

initialize();
