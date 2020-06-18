
// Interchangeable properties
const gameSpeed = 3;
const food = 20;
const initalHerbivores = 5;


// Initial set up
const simulation = Simulation();
const graph = Graph([]);

simulation.registerListener(function(val) {
  graph.array.push(val);
  graph.draw();
})

function init() {
  simulation.build(food, initalHerbivores).start();
}

init();