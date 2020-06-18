const simulationSpeedInput = document.getElementById('simulationSpeed')

// Interchangeable properties
let simulationSpeed = Number(simulationSpeedInput.value);
const food = 20;
const initalHerbivores = 5;


// Initial set up
const simulation = Simulation();
simulation.simulationSpeed = simulationSpeed;

const graph = Graph([]);

simulation.registerListener(function(val) {
  graph.array.push(val);
  graph.draw();
})

function init() {
  simulation.build(food, initalHerbivores).start();
}
init();

// Input listeners
simulationSpeedInput.addEventListener("change", function(e) {
  simulation.simulationSpeed = Number(e.target.value);
})