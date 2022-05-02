import { Episode } from './episode.js';
import { Quality } from './quality.js';
import { State } from './state.js';
import { RandomThreeState } from './random_three_state.js';
import { ThreeState } from './three_state.js';

function createState() {
  const url = window.location.href;
  const regex = new RegExp("[?&]type=([^&#]*)");
  const results = regex.exec(url);
  if (results) {
    if (results[1] == "State") {
      return new State();
    }
    if (results[1] == "RandomThreeState") {
      return new RandomThreeState();
    }
    if (results[1] == "ThreeState") {
      return new ThreeState();
    }
  }
  return new State();
}

function td(action) {
  const boardDiv = document.getElementById("board");
  const trDivs = boardDiv.getElementsByTagName("tr");
  const tdDivs = trDivs[action.y].getElementsByTagName("td");
  return tdDivs[action.x];
};

function refresh(env) {
  const state = env.episode.state;
  state.mapPoints((action) => {
    td(action).innerHTML = state.mark(action) + '<div>' + env.quality.updateCount(state, action) + '</div>';
    if (state.orders) {
      const order = state.orders[action.y][action.x];
      if (order != 0) {
        td(action).style.fontSize = `${25 + 25 * order / 6}px`
      }
    }
    const q = env.quality.get(state, action);
    if (q == 0) {
      td(action).style.backgroundColor = `rgb(255, 255, 255)`;
    }
    if (0 < q) {
      td(action).style.backgroundColor = `rgb(${255 * (1 - q)}, 255, 255)`;
    }
    if (q < 0) {
      td(action).style.backgroundColor = `rgb(255, ${255 * (1 + q)}, 255)`;
    }
  });

  document.getElementById("winner").innerText = state.winner();
}

function refreshWithDelay(env, delay) {
  setTimeout(() => {
    refresh(env);
  }, delay);
}

function clear(env) {
  env.initialState = createState();
  env.episode = new Episode(env.initialState);

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
  refresh(env);
  if (env.episode.state.winner()) {
    return;
  }

  const action1 = env.quality.findAction(env.episode.state, 0);
  env.episode.step(action1);
  refreshWithDelay(env, 1000);
};

const env = { quality: new Quality(), episode: null, initialState: null };

clear(env);
refresh(env);
env.episode.state.mapPoints((action) => {
  td(action).addEventListener("click", () => click(env, action));
});

const timer = setInterval(() => {
  for (let i = 0; i < 100; i++) {
    const episode = Episode.find(env.initialState, env.quality, 0.1);
    env.quality.train(episode);
  }
  document.getElementById("train_count").innerText = env.quality.trainCount;
  document.getElementById("q_table_count").innerText = env.quality.qTableCount();
  if (1000 * 1000 <= env.quality.trainCount) {
    clearInterval(timer);
  }
}, 100);
