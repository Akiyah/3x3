import { Episode } from './episode.js';
import { Quality } from './quality.js';
import { State } from './state.js';

function td(action) {
  const boardDiv = document.getElementById("board");
  const trDivs = boardDiv.getElementsByTagName("tr");
  const tdDivs = trDivs[action.y].getElementsByTagName("td");
  return tdDivs[action.x];
};

function refresh(env) {
  env.episode.state.mapPoints((action) => {
    td(action).innerText = env.episode.state.mark(action);
  });

  document.getElementById("winner").innerText = env.episode.state.winner();
}

function clear(env) {
  env.episode = new Episode(State);

  if (document.getElementById("player").value == "x") {
    const action = env.quality.findAction(env.episode.state, 0);
    env.episode.step(action);
  }
}

function click(env, action) {
  if (env.episode.state.winner()) {
    clear(env);
    refresh(env);
    return;
  }

  if (!env.episode.state.enable(action)) {
    return;
  }

  env.episode.step(action);
  if (env.episode.state.winner()) {
    refresh(env);
    return;
  }

  const action1 = env.quality.findAction(env.episode.state, 0);
  env.episode.step(action1);
  refresh(env);
};

function initialize() {
  const env = { quality: new Quality(), episode: null };

  clear(env);
  env.episode.state.mapPoints((action) => {
    td(action).addEventListener("click", () => click(env, action));
  });

  const timer = setInterval(() => {
    for (let i = 0; i < 100; i++) {
      const episode = Episode.find(State, env.quality, 0.1);
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
