import { Game } from '../src/js/modules/game.js';

const game = new Game();

for (let j = 0; j < 10; j++) {
  let output = {};
  output["o"] = 0;
  output["x"] = 0;
  output["-"] = 0;
  output["null"] = 0;

  for (let i = 0; i < 10000; i++) {
    const episode = game.findEpisode(0.1);
    game.train(episode);

    const event = episode[episode.length-1];
    output[event.state.winner()]++;
  }
  console.log(output);
}

const episode = game.findEpisode(0);
console.log(episode);
episode.forEach((event) => {
  console.log(event.state.toString());
  console.log(event.action);
  console.log(game.quality.m(event.state));
});
