(function(global) {
  var c = document.getElementById("simulationCanvas");
  c.width = document.body.clientWidth / 2;
  c.height = document.body.clientHeight;
  var ctx = c.getContext("2d");

  window.addEventListener('resize', 
    function() {
      c.width = window.innerWidth / 2;
      c.height = window.innerHeight;
    }
  )

  function randomInteger(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
  }

  class Entity {
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

  class Plant extends Entity {
    constructor(x, y, id) {
      super(x, y, 5, "#00CC00");
      this.name = "plant";
      this.id = id;
      this.isEaten = false;
    }
  }

  class Herbivore extends Entity {
    constructor(x, y, id, angle, scope, speed) {
      super(x, y, 10, "#1AA8F0");
      this.name = "herbivore";
      this.id = id;

      this.speed = speed;
      this.angle = angle;

      this.sightRadius = 100;
      this.eaten = 0;

      this.target = null;

      this.scope = scope || window;
    }

    moveRandomly() {
      const displacement = calculateXYDisplacement(this.angle, this.speed);
      if (this.x + displacement.dx > this.radius && this.x + displacement.dx < c.width - this.radius) {
        this.x += displacement.dx;
      } else {
        this.angle += Math.PI / 45
      }

      if (this.y + displacement.dy > this.radius && this.y + displacement.dy < c.height - this.radius) {
        this.y += displacement.dy;
      } else {
        this.angle += Math.PI / 45
      }
    }

    detectFood() {
      // If there exists a food item within sight radius, move towards it
      let target = this.scope.foodArray.find(
        item => item.isEaten === false &&
        (calculateDistance(this.x, this.y, item.x, item.y) < this.sightRadius)
      );
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
    const x = randomInteger(c.width);
    const y = randomInteger(c.height);
    return new Plant(x, y, id)
  }

  function createRandomlyPlacedHerbivore(id, scope, simulationSpeed) {
    const wall = randomInteger(4);
    let x = 10;
    let y = 10;
    let angle = 0;
    let speed = 2 * simulationSpeed;

    switch(wall){
      case 0:
        y = randomInteger(c.height);
        break;
      case 1:
        x = c.width - 10;
        angle = Math.PI;
        y = randomInteger(c.height);
        break;
      case 2:
        x = randomInteger(c.width);
        angle = (Math.PI / 2);
        break;
      case 3:
        y = c.height - 10,
        x = randomInteger(c.width);
        angle = (Math.PI / 180) * 270;
        break;
    }

    return new Herbivore(x, y, id, angle, scope, speed);
  }

  const Simulation = function() {
    return new SimulationInit();
  }

  class SimulationInit {
    constructor() {
      this.foodArray = [];
      this.herbivoreArray = [];
      this.time = 0;
      this.totalHerbivoresArray = [];
    }

    build(foodN, herbivoreN) {
      let foodArray = [];
      let herbivoreArray = [];
      for (let i = 0; i < foodN; i++) {
        foodArray.push(createRandomlyPlacedFood(i, this));
      }
      
      for (let i = 0; i < herbivoreN; i++) {
        herbivoreArray.push(createRandomlyPlacedHerbivore(i, this, this.internalSimulationSpeed));
      }

      this.foodArray = foodArray;
      this.herbivoreArray = herbivoreArray;

      return this
    };

    // Listeners for day completion
    totalHerbivoresArrayListener(val) {};

    set totalHerbivores(value) {
      this.totalHerbivoresArray.push(value);
      this.totalHerbivoresArrayListener(value);
    };

    registerListener(listener) {
      this.totalHerbivoresArrayListener = listener
    };

    // Listener for simulationSpeed update
    set simulationSpeed(value) {
      this.internalSimulationSpeed = value;
      this.herbivoreArray.forEach(item => item.speed = 2 * value);
    }

    animate() {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, c.width, c.height);
      this.foodArray.forEach(item => {
        if (item.isEaten) {
          return
        }
        return item.draw()
      });
      this.herbivoreArray.forEach(item => item.update());
      this.time += 1/60;

      // this.stopButton.draw();
      if (this.time > 10 / this.internalSimulationSpeed) {
        this.stop();
        this.setNextDay();
      }
    };

    stop() {
      clearInterval(this.interval)
    };

    setNextDay() {
      let dead = 0;
      let live = 0;
      let offspring = 0;

      this.herbivoreArray.forEach((item) => {
        switch (true) {
          case (item.eaten === 0):
            dead++;
            break;
          case (item.eaten === 1):
            live ++;
            break;
          case (item.eaten > 1):
            live++;
            offspring++;
            break;
        }
      });

      const totalHerbivores = live + offspring - dead;
      this.totalHerbivores = totalHerbivores;

      this.build(food, totalHerbivores).start();
    };

    start() {
      const that = this;
      this.time = 0;
      this.interval = setInterval(function() {
        that.animate()
      }, 1000/60)
    }
  };

  global.Simulation = Simulation;

}(window))