class Settlement {
  constructor(player, id) {
    this.colour = player.colour;
    this.inPlay = false;
    this.id = id;
    this.type = "settlement";
    this.size = 20;
    this.x = 500;
    this.y = this.id * 40 + 25;
    this.initialX = 500;
    this.initialY = this.y;
    this.active = false;
  }
  draw = () => {
    if (this.active && !this.inPlay) {
      ctx.fillStyle = "black";
      ctx.fillRect(this.x - 2, this.y - 2, this.size + 4, this.size + 4);
    }
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  };
}
class City extends Settlement {
  constructor(player, id) {
    super(player, id);
    this.x = 550 - this.size / 2;
    this.type = "city";
    this.y = this.id * 40 + 25;
  }
  draw = () => {
    ctx.beginPath();
    if (this.active && !this.inPlay) {
      ctx.fillStyle = "black";
      ctx.arc(
        550,
        this.y + this.size / 2,
        this.size / 2 + 2,
        0,
        2 * Math.PI
      );

      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.arc(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  };
}
class Road {
  constructor(player, id) {
    this.colour = player.colour;
    this.neighbours = [];
    this.inPlay = false;
    this.type = "road";
    this.id = id;
    this.size = 25;
    this.x = 475 + (this.id % 3) * 30;
    this.y = Math.floor(this.id / 3) * 40 + 250;
    this.active = false;
    this.direction = 45;
  }
  draw = () => {
    if (this.active) {
      ctx.fillStyle = "black";
      ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
      ctx.rotate((this.direction * Math.PI) / 180);
      ctx.fillRect(
        -this.size / 2 - 2,
        -this.size / 6 - 2,
        this.size + 4,
        this.size / 3 + 4
      );
      ctx.rotate((-this.direction * Math.PI) / 180);
      ctx.translate(-this.x - this.size / 2, -this.y - this.size / 2);
    }
    ctx.fillStyle = this.colour;
    ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
    ctx.rotate((this.direction * Math.PI) / 180);
    ctx.fillRect(-this.size / 2, -this.size / 6, this.size, this.size / 3);
    ctx.rotate((-this.direction * Math.PI) / 180);
    ctx.translate(-this.x - this.size / 2, -this.y - this.size / 2);
  };
}
