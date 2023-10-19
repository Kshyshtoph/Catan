class Hex {
  constructor(color, id, number, location, y, radius) {
    this.color = color;
    this.id = id;
    this.number = number ? number[0] : "";
    this.location = location;
    this.x = ((location[0] * 3) / 2) * radius;
    this.y = y;
    this.radius = radius;
    this.corners = [];
    for (let i = 0; i < 6; i++) {
      this.corners.push([
        Math.round(
          this.x + Math.cos(((360 / 6) * i * Math.PI) / 180) * this.radius
        ),
        Math.round(
          this.y - Math.sin(((360 / 6) * i * Math.PI) / 180) * this.radius
        )
      ]);
    }
    this.buildingMarkers = this.corners.map(
      corner => new BuildingMarker(corner[0], corner[1])
    );
    this.roadMarkers = [];
    for (let i = 0; i < this.corners.length - 1; i++) {
      const thisCorner = this.corners[i]
      const [thisX, thisY] = thisCorner
      const nextCorner = this.corners[i + 1]
      const [nextX, nextY] = nextCorner
      this.roadMarkers.push(
        new RoadMarker(
          (nextX + thisX) / 2,
          (thisY + nextY) / 2,
          this.switchDirection(
            nextCorner[0],
            thisCorner[0],
            nextCorner[1],
            thisCorner[1]
          )
        )
      );
    }
  }
  switchDirection = (x1, x2, y1, y2) => {
    if (x1 <= x2) {
      if (y1 !== y2) return 60;
      return 180;
    } else {
      if (y1 !== y2) return 120;
    }
    return 0;
  };
  draw = () => {
    const numberOfEdges = 6;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x + this.radius, this.y);
    ctx.font = "30px Arial";
    for (let i = 0; i < numberOfEdges; i++) {
      ctx.lineTo(
        this.x +
        Math.cos(((360 / numberOfEdges) * i * Math.PI) / 180) * this.radius,
        this.y -
        Math.sin(((360 / numberOfEdges) * i * Math.PI) / 180) * this.radius
      );
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(this.number, this.x - 15, this.y + 15);
  };
  drawBuildingMarkers = () => {
    this.buildingMarkers.forEach(marker => {
      marker.draw();
    });
  };
  drawRoadMarkers = () => {
    this.roadMarkers.forEach(marker => {
      marker.draw();
    });
  };
  payResources = () => {
    if (
      diceResult === this.number &&
      !(this.x === board.thief.x && this.y === board.thief.y)
    ) {
      resources = ["green", "lime", "brown", "gray", "yellow"]
      index = resources.findIndex(this.color)
      if (index === -1) return;
      this.buildingMarkers.forEach(marker => marker.pay(resources[index]))
    }
  };
}
