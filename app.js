const simulationSpeedInput = document.getElementById('simulationSpeed');

const herbivoresCooperateInput = document.getElementById("herbivoreCoop");
const herbivoresSpeed = document.getElementById("herbivoreSpeed");
const herbivoresSightRadius = document.getElementById("herbivoreSightRadius");

const startSimulation = document.getElementById('startSimulation');

// Interchangeable properties
let simulationSpeed = Number(simulationSpeedInput.value);
const food = 20;
const initialHerbivores = 1;

const herbivoreProps = {
  cooperate: herbivoresCooperateInput.checked,
  movementSpeed: Number(herbivoresSpeed.value),
  sightRadius: Number(herbivoresSightRadius.value)
}

// Initiate
const graph = Graph([]);
const simulation = Simulation(herbivoreProps);
simulation.simulationSpeed = simulationSpeed;

function init() {
  const newHerbivoreProps = {
    cooperate: herbivoresCooperateInput.checked,
    movementSpeed: Number(herbivoresSpeed.value),
    sightRadius: Number(herbivoresSightRadius.value)
  }

  totalHerbivoresArray = [initialHerbivores];
  simulation.stop();
  simulation.herbivoreProps = newHerbivoreProps;
  document.getElementById("averageHerbivores").innerHTML = initialHerbivores;
  graph.clear();
  simulation.build(food, initialHerbivores).start();
}


// Input listeners
simulationSpeedInput.addEventListener("change", function(e) {
  simulation.simulationSpeed = Number(e.target.value);
})

startSimulation.addEventListener("click", function(e) {
  e.preventDefault();
  init();
})


// Output listners
function calculateMean(array) {
  let total = 0;
  let arrayLength = 0
  array.forEach(element => {
    total += element;
    arrayLength ++;
  });
  return total / arrayLength
}

// Fires at the end of every simulated day
let totalHerbivoresArray = [initialHerbivores];

simulation.registerListener(function(val) {
  graph.array.push(val);
  graph.draw();

  totalHerbivoresArray.push(val);
  document.getElementById("averageHerbivores").innerHTML = calculateMean(totalHerbivoresArray);
})