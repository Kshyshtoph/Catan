class Skipper {
  constructor(players) {
    this.players = players;
    this.activePlayerIndex = 0;
    this.x = 475;
    this.y = 475;
    this.width = 100;
    this.height = 60;
  }
  skip = () => {
    this.activePlayerIndex++;
    if (this.activePlayerIndex == players.length) {
      this.activePlayerIndex = 0;
    }
  };
  draw = () => {
    ctx.fillStyle = "green";
    ctx.fillRect(475, 475, 100, 80);
  };
}
