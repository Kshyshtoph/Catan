class Marker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.active = false;
    this.taken = false;
  }
  draw = () => {
    if (!this.taken) {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.x - 5, this.y - 5, this.width, this.height);
    }
  };
}
