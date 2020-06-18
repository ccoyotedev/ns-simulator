
(function(global) {
  var c = document.getElementById("graphCanvas");
  c.width = document.body.clientWidth / 2;
  c.height = document.body.clientHeight / 2;
  var ctx = c.getContext("2d");

  window.addEventListener('resize', 
    function() {
      c.width = window.innerWidth / 2;
      c.height = window.innerHeight / 2;
    }
  )

  const Graph = function(array) {
    return new GraphClass(array);
  }
  
  class GraphClass {
    constructor(array) {
      this.array = array;
      this.padding = 30;
      this.xAxisLength =   c.width - 2 * this.padding;
      this.yAxisLength =   c.height - 2 * this.padding;
    }

    get xScale() {
      return this.xAxisLength / this.array.length;
    };

    get yScale() {
      return this.yAxisLength / Math.max(...this.array);
    };
    get origin() {
      return {x: this.padding, y: this.padding + this.yAxisLength};
    };

    drawAxis() {
      ctx.beginPath();
      ctx.moveTo(this.origin.x, this.padding);
      ctx.lineTo(this.origin.x, this.origin.y)
      ctx.lineTo(this.origin.x + this.xAxisLength, this.origin.y);
      ctx.strokeStyle = "black";
      ctx.stroke();

      // Draw x intervals
      this.array.forEach((item, key) => {
        ctx.beginPath();
        ctx.moveTo(this.origin.x + key * this.xScale, this.origin.y);
        ctx.lineTo(this.origin.x + key * this.xScale, this.origin.y + 10);
        ctx.strokeStyle = "black";
        ctx.stroke();
      })

      // Draw y intervals
      for (let i = 0; i < Math.max(...this.array); i++) {
        ctx.beginPath();
        ctx.moveTo(this.origin.x, this.origin.y - i * this.yScale);
        ctx.lineTo(this.origin.x - 10, this.origin.y - i * this.yScale);
        ctx.strokeStyle = "black";
        ctx.stroke();
      }
    };

    drawLine() {
      ctx.beginPath();
      ctx.moveTo(this.origin.x, this.origin.y)
      this.array.forEach((item, key) => {
        ctx.lineTo(this.origin.x + key * this.xScale, this.origin.y - item * this.yScale);
      })
      ctx.strokeStyle = "blue";
      ctx.stroke();
    };

    draw() {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, c.width, c.height);
      this.drawAxis();
      this.drawLine();
    }

    clear() {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, c.width, c.height);
      this.array = []
    }
  }

  global.Graph = Graph;

}(window))
