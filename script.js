var s = document.getElementById("simulation");
s.width = document.body.clientWidth / 2;
s.height = document.body.clientHeight;
var ctx = s.getContext("2d");

var mouse = {
  x: 0,
  y: 0
}

window.addEventListener('resize', 
  function() {
    s.width = window.innerWidth / 2;
    s.height = window.innerHeight;
  }
)

window.addEventListener('mousemove',
  function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
)

// window.addEventListener('click',
//   function() {
//     if (game.stopButton.isInside()) {
//       game.stop();
//       var graph = new Graph(game.herbivoreTotalArray);
//       graph.draw()
//     }
//   }
// )


function randomInteger(maxNumber) {
  return Math.floor(Math.random() * maxNumber);
}

function calculateXYDisplacement(theta, hyp) {
  let dx = hyp * Math.cos(theta);
  let dy = hyp * Math.sin(theta);
  return {dx: dx, dy: dy};
}

function calculateDistance(x1, y1, x2, y2) {
  let dx = Math.abs(x1 - x2);
  let dy = Math.abs(y1 - y2);
  return Math.sqrt(dx * dx + dy * dy);
}


function itemInRadius(x1, x2, y1, y2, radius) {
  if (
    (x1 > x2 - radius && x1 < x2 + radius)
    &&
    (y1 > y2 - radius && y1 < y2 + radius)
  ) {
    return true
  }
  return false
}



class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y,
    this.radius = radius,
    this.color = color || '#0000'
  }


  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
}

class Button {
  constructor() {
    this.x = s.width/2 - 75,
    this.y = s.height - 100,
    this.width = 150,
    this.height = 50
  }

  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  isInside() {
    return mouse.x > this.x && mouse.x < this.x+this.width && mouse.y < this.y+this.height && mouse.y > this.y
  }
}

class Plant extends Circle {
  constructor(x, y, id) {
    super(x, y, 5, "#00CC00");
    this.name = "plant";
    this.id = id;
    this.isEaten = false;
  }
}

class Herbivore extends Circle {
  constructor(x, y, id, angle, scope) {
    super(x, y, 10, "#1AA8F0");
    this.name = "herbivore";
    this.id = id;

    this.speed = 2 * gameSpeed;
    this.angle = angle;

    this.sightRadius = 100;
    this.eaten = 0;

    this.target = null;

    this.scope = scope || window;
  }

  moveRandomly() {
    const displacement = calculateXYDisplacement(this.angle, this.speed);
    if (this.x + displacement.dx > 0 + this.radius && this.x + displacement.dx < s.width - this.radius) {
      this.x += displacement.dx;
    } else {
      this.angle += Math.PI / 90
    }

    if (this.y + displacement.dy > 0 + this.radius && this.y + displacement.dy < s.height - this.radius) {
      this.y += displacement.dy;
    } else {
      this.angle += Math.PI / 90
    }
  }

  detectFood() {
    // If there exists a food item within sight radius, move towards it
    let target = this.scope.foodArray.find(item => item.isEaten === false && (calculateDistance(this.x, this.y, item.x, item.y) < this.sightRadius));
    if (target) {
      this.target = target;
    }
  }

  eatFood() {
    this.target.isEaten = true;
    this.eaten ++;
    this.target = null;
  }

  moveTowardsFood(food) {
    if (food.isEaten) {
      return this.target = null;
    }
    let dx = food.x - this.x;
    let dy = food.y - this.y;
    this.angle = Math.atan2(dy, dx);
    this.y += calculateXYDisplacement(this.angle, this.speed).dy;
    this.x += calculateXYDisplacement(this.angle, this.speed).dx;

    if (calculateDistance(this.x, this.y, food.x, food.y) < this.radius) {
      this.eatFood()
    }
  }

  pivotLeft() {
    this.angle -= (Math.PI / 180) * 4;
  }

  pivotRight() {
    this.angle += (Math.PI / 180) * 4;
  }

  update() {
    if (this.target) {
      this.moveTowardsFood(this.target)
    } else {
      this.detectFood();
      const randomlyMove = randomInteger(3);
      if (randomlyMove === 0) {
        this.pivotLeft();
      } else if (randomlyMove === 1) {
        this.pivotRight();
      }

      this.moveRandomly();
    }
    this.draw();
  }
}



function createRandomlyPlacedFood(id) {
  const x = randomInteger(s.width);
  const y = randomInteger(s.height);
  return new Plant(x, y, id)
}

function createRandomlyPlacedHerbivore(id, scope) {
  const wall = randomInteger(4);
  let x = 10;
  let y = 10;
  let angle = 0;
  switch(wall){
    case 0:
      y = randomInteger(s.height);
      break;
    case 1:
      x = s.width - 10;
      angle = Math.PI;
      y = randomInteger(s.height);
      break;
    case 2:
      x = randomInteger(s.width);
      angle = (Math.PI / 2);
      break;
    case 3:
      y = s.height - 10,
      x = randomInteger(s.width);
      angle = (Math.PI / 180) * 270;
      break;
  }

  return new Herbivore(x, y, id, angle, scope);
}


// Game State

class Simulation {
  constructor() {
    this.foodArray = [];
    this.herbivoreArray = [];
    this.time = 0;
    this.herbivoreTotalArray = [];

    // this.stopButton = new Button();
  }

  build(foodN, herbivoreN) {
    let foodArray = [];
    let herbivoreArray = [];
    for (let i = 0; i < foodN; i++) {
      foodArray.push(createRandomlyPlacedFood(i, this));
    }
    
    for (let i = 0; i < herbivoreN; i++) {
      herbivoreArray.push(createRandomlyPlacedHerbivore(i, this));
    }

    this.foodArray = foodArray;
    this.herbivoreArray = herbivoreArray;
    this.herbivoreTotalArray.push(herbivoreN);

    return this
  }

  animate() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, s.width, s.height);
    this.foodArray.forEach(item => {
      if (item.isEaten) {
        return
      }
      return item.draw()
    });
    this.herbivoreArray.forEach(item => item.update());
    this.time += 1/60;

    // this.stopButton.draw();

    if (this.time > 10 / gameSpeed) {
      this.stop();
      this.setNextDay();
    }
  }

  stop() {
    clearInterval(this.interval)
  }

  setNextDay() {
    let dead = 0;
    let live = 0;
    let offspring = 0;

    this.herbivoreArray.forEach((item) => {
      switch (true) {
        case (item.eaten <= 1):
          dead++;
          break;
        case (item.eaten === 2):
          live ++;
          break;
        case (item.eaten > 2):
          live++;
          offspring++;
          break;
      }
    })

    const totalHerbivores = live + offspring - dead;
    var graph = new Graph(game.herbivoreTotalArray);
    graph.draw()

    this.build(50, totalHerbivores).start();
  }

  start() {
    const that = this;
    this.time = 0;
    this.interval = setInterval(function() {
      that.animate()
    }, 1000/60)
  }
}

const gameSpeed = 2;

const game = new Simulation();

function init() {
  game.build(10, 5).start();
}

init();