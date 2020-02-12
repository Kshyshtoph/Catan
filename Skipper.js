class Skipper {
  constructor(players) {
    this.players = players;
    this.activePlayerIndex = 0;
    this.x = 475;
    this.y = 475;
    this.width = 100;
    this.height = 60;
    this.dice = new Dice();
  }
  skip = () => {
    this.activePlayerIndex++;
    if (this.activePlayerIndex == players.length) {
      this.activePlayerIndex = 0;
      currentRound++;
    }
    currentPlayer = players[this.activePlayerIndex];
    if (currentRound <= 2) {
      currentPlayer.freeRoad = true;
      currentPlayer.freeSettlement = true;
    }
    diceResult = board.dice.roll();
    board.hexes.forEach(hex => {
      hex.payResources();
    });
  };
  draw = () => {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}
