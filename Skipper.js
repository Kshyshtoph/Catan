class Skipper {
  constructor(players) {
    this.players = players;
    this.activePlayerIndex = 0;
    this.x = 475;
    this.y = 475;
    this.size = 100;
    this.dice = new Dice();
  }
  trade = () => {
    this.activePlayerIndex++;
    if (this.activePlayerIndex == players.length) {
      this.activePlayerIndex = 0;
    }
    currentPlayer = players[this.activePlayerIndex];
  };
  skip = () => {
    if (board.thief.isSet) {
      this.activePlayerIndex++;
      if (this.activePlayerIndex == players.length) {
        this.activePlayerIndex = 0;
        currentRound++;
      }
      currentPlayer = players[this.activePlayerIndex];
      if (currentRound <= 2) {
        currentPlayer.freeRoads = 1;
        currentPlayer.freeSettlement = true;
      }
      if (currentRound > 2) {
        diceResult = board.dice.roll();
        if (diceResult === 7) {
          board.thief.isSet = false;
          board.thief.x = 25;
          board.thief.y = 25;
        }
      }
      board.hexes.forEach(hex => {
        hex.payResources();
      });
    }
  };
  draw = () => {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  };
}
