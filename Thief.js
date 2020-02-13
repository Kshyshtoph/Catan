class Thief {
  constructor() {
    this.x = 25;
    this.y = 25;
    this.isSet = false;
  }
  draw = () => {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 25, 0, (2 * Math.PI) / 180, true);
    ctx.fill();
  };
}
