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
    this.markers = this.corners.map(corner => new Marker(corner[0], corner[1]));
  }
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
  drawMarkers = () => {
    this.markers.forEach(marker => {
      marker.draw();
    });
  };
}
