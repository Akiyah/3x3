import { Game } from './game.js';
import { State } from './state.js';

function td(x, y) {
  const boardDiv = document.getElementById("board");
  const trDivs = boardDiv.getElementsByTagName("tr");
  const tdDivs = trDivs[y].getElementsByTagName("td");
  return tdDivs[x];
};

function refresh(state) {
  [0, 1, 2].forEach(y => {
    [0, 1, 2].forEach(x => {
      td(x, y).innerText = state.mark([x, y]);
    });
  });

  document.getElementById("winner").innerText = state.winner();
}

function click(env, x, y) {
  if (env.state.winner()) {
    env.state = new State();
    refresh(env.state);
    return;
  }

  if (!env.state.enable([x, y])) {
    return;
  }

  env.state = env.state.step([x, y]);
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
    state: new State()
  };

  [0, 1, 2].forEach(y => {
    [0, 1, 2].forEach(x => {
      td(x, y).addEventListener("click", () => click(env, x, y))
    });
  });

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
