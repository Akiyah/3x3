import { Action } from './action.js';
import { Episode } from './episode.js';
import { Quality } from './quality.js';

function td(x, y) {
  const boardDiv = document.getElementById("board");
  const trDivs = boardDiv.getElementsByTagName("tr");
  const tdDivs = trDivs[y].getElementsByTagName("td");
  return tdDivs[x];
};

function refresh(env) {
  env.episode.state.mapPoints((action) => {
    td(action.x, action.y).innerText = env.episode.state.mark(action);
  });

  document.getElementById("winner").innerText = env.episode.state.winner();
}

function clear(env) {
  env.episode = new Episode();

  if (document.getElementById("player").value == "x") {
    const action = env.quality.findAction(env.episode.state, 0);
    env.episode.step(action);
  }
}

function click(env, x, y) {
  if (env.episode.state.winner()) {
    clear(env);
    refresh(env);
    return;
  }

  if (!env.episode.state.enable(new Action(x, y))) {
    return;
  }

  env.episode.step(new Action(x, y));
  if (env.episode.state.winner()) {
    refresh(env);
    return;
  }

  const action = env.quality.findAction(env.episode.state, 0);
  env.episode.step(action);
  refresh(env);
};

function initialize() {
  const env = {
    quality: new Quality(),
    episode: null
  };

  clear(env);
  env.episode.state.mapPoints((action) => {
    td(action.x, action.y).addEventListener("click", () => click(env, action.x, action.y));
  });

  const timer = setInterval(() => {
    for (let i = 0; i < 100; i++) {
      const episode = Episode.find(env.quality, 0.1);
      env.quality.train(episode);
    }
    document.getElementById("train_count").innerText = env.quality.trainCount;
    document.getElementById("q_table_count").innerText = env.quality.count();
    if (100 * 1000 <= env.quality.trainCount) {
      clearInterval(timer);
    }
  }, 100);
}

initialize();
