const gameSpeed = 3;
const food = 20

const simulation = Simulation();

function init() {
  simulation.build(food, 5).start();
}

init();