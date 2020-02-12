class Dice {
  constructor() {
    this.result = this.roll();
  }
  roll = () => {
    return Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
  };
  draw = () => {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillRect(10, 30, 30, 30);
    ctx.fillStyle = "black";
    this.result = this.roll();
    ctx.fillText(this.result, 10, 30);
  };
}
