const simulationSpeedInput = document.getElementById('simulationSpeed')

// Interchangeable properties
let simulationSpeed = Number(simulationSpeedInput.value);
const food = 20;
const initialHerbivores = 5;

const herbivoreProps = {
  cooperate: true,
  movementSpeed: 2,
  sightRadius: 200
}


// Initial set up
const simulation = Simulation(herbivoreProps);
simulation.simulationSpeed = simulationSpeed;

const graph = Graph([]);

function init() {
  simulation.build(food, initialHerbivores).start();
}
init();


// Input listeners
simulationSpeedInput.addEventListener("change", function(e) {
  simulation.simulationSpeed = Number(e.target.value);
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