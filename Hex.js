class Hex {
  constructor(colour, id, number, location, y, radius) {
    this.colour = colour[0];
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
      corner => new Marker(corner[0], corner[1])
    );
    this.roadMarkers = [];
    this.roadMarkers.push(
      new RoadMarker(
        (this.corners[0][0] + this.corners[this.corners.length - 1][0]) / 2,
        (this.corners[0][1] + this.corners[this.corners.length - 1][1]) / 2
      )
    );
    for (let i = 1; i < this.corners.length; i++) {
      this.roadMarkers.push(
        new RoadMarker(
          (this.corners[i - 1][0] + this.corners[i][0]) / 2,
          (this.corners[i - 1][1] + this.corners[i][1]) / 2,
          this.switchDirection(
            this.corners[i - 1][0],
            this.corners[i][0],
            this.corners[i - 1][1],
            this.corners[i][1]
          )
        )
      );
    }
  }
  switchDirection = (x1, x2, y1, y2) => {
    if (x1 > x2) {
      if (y1 > y2) {
        return 60;
      } else if (y1 < y2) {
        return 300;
      } else {
        return 180;
      }
    } else {
      if (y1 > y2) {
        return 120;
      } else if (y1 < y2) {
        return 240;
      } else {
        return 0;
      }
    }
  };
  draw = () => {
    const numberOfEdges = 6;
    ctx.fillStyle = this.colour;
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
}
