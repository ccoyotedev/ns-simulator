var g = document.getElementById("graph");
g.width = document.body.clientWidth / 2;
g.height = document.body.clientHeight / 2;
var gCtx = g.getContext("2d");

class Graph {
  constructor(array) {
    this.array = array;
    this.padding = 20;
    this.xAxisLength = g.width - 2 * this.padding;
    this.yAxisLength = g.height - 2 * this.padding;
  }

  get xScale() {
    return this.xAxisLength / this.array.length;
  }

  get yScale() {
    return this.yAxisLength / Math.max(...this.array);
  }

  get origin() {
    return {x: this.padding, y: this.padding + this.yAxisLength};
  }

  drawAxis() {
    gCtx.beginPath();
    gCtx.moveTo(this.origin.x, this.padding);
    gCtx.lineTo(this.origin.x, this.origin.y)
    gCtx.lineTo(this.origin.x + this.xAxisLength, this.origin.y);
    gCtx.strokeStyle = "black";
    gCtx.stroke();

    // Draw x intervals
    this.array.forEach((item, key) => {
      gCtx.beginPath();
      gCtx.moveTo(this.origin.x + key * this.xScale, this.origin.y);
      gCtx.lineTo(this.origin.x + key * this.xScale, this.origin.y + 10);
      gCtx.strokeStyle = "black";
      gCtx.stroke();
    })

    // Draw y intervals
    for (let i = 0; i < Math.max(...this.array); i++) {
      gCtx.beginPath();
      gCtx.moveTo(this.origin.x, this.origin.y - i * this.yScale);
      gCtx.lineTo(this.origin.x - 10, this.origin.y - i * this.yScale);
      gCtx.strokeStyle = "black";
      gCtx.stroke();
    }


  }

  drawLine() {
    gCtx.beginPath();
    gCtx.moveTo(this.origin.x, this.origin.y)
    this.array.forEach((item, key) => {
      gCtx.lineTo(this.origin.x + key * this.xScale, this.origin.y - item * this.yScale);
    })
    gCtx.strokeStyle = "blue";
    gCtx.stroke();
  }

  draw() {
    gCtx.fillStyle = 'white';
    gCtx.fillRect(0, 0, g.width, g.height);
    this.drawAxis();
    this.drawLine();
  }
}

const graph = new Graph([]);
