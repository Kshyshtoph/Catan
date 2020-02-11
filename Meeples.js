class Settlement {
  constructor(player, id) {
    this.colour = player.colour;
    this.inPlay = false;
    this.id = id;
    this.width = 20;
    this.height = 20;
    this.x = 500;
    this.y = this.id * 50 + 100;
    this.active = false;
  }
  draw = () => {
    if (this.active && !this.inPlay) {
      ctx.fillStyle = "black";
      ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    }
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}
class City extends Settlement {
  constructor(player, id) {
    super(player, id);
    this.x = 550 - this.width / 2;
    this.y = this.id * 50 + 100;
  }
  draw = () => {
    ctx.beginPath();
    if (this.active && !this.inPlay) {
      ctx.fillStyle = "black";
      ctx.arc(
        550,
        this.y + this.height / 2,
        this.width / 2 + 2,
        0,
        2 * Math.PI
      );

      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  };
}
