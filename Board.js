class Board {
  constructor(boardRadius, hexRadius) {
    this.numbers = [];
    this.colours = [
      "lime",
      "lime",
      "lime",
      "lime",
      "green",
      "green",
      "green",
      "green",
      "gray",
      "gray",
      "gray",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "brown",
      "brown",
      "brown",
      "burlywood"
    ];
    this.hexes = [];
    this.boardRadius = boardRadius;
    this.hexRadius = hexRadius;
    this.hexHeight = hexRadius * Math.sqrt(3);
    this.dice = new Dice();
    this.thief = new Thief();
  }
  pushNubers = () => {
    for (let i = 2; i <= 12; i++) {
      this.numbers.push(i);
    }
    for (let i = 3; i <= 11; i++) {
      this.numbers.push(i);
    }
    this.numbers.forEach((number, index) => {
      if (number === 7) {
        this.numbers.splice(index, 1);
      }
    });
  };
  createHexes = () => {
    let grow = 1;
    let currentId = 0;
    let count = this.boardRadius;
    const diagonal = this.boardRadius * 2 - 1;
    for (let i = 1; i <= diagonal; i++) {
      if (i >= this.boardRadius) {
        grow = -1;
      }
      for (let j = 1; j <= count; j++) {
        const colour = this.colours.splice(
          Math.floor(Math.random() * this.colours.length),
          1
        );
        if (colour[0] === "burlywood") {
          this.thief.x = ((i * 3) / 2) * hexRadius;
          this.thief.y =
            j * this.hexHeight + ((diagonal - count) / 2) * this.hexHeight;
          this.thief.isSet = true;
        }
        const number =
          colour[0] !== "burlywood"
            ? this.numbers.splice(
                Math.floor(Math.random() * this.numbers.length),
                1
              )
            : null;
        this.hexes.push(
          new Hex(
            colour,
            currentId,
            number,
            [i, j],
            j * this.hexHeight + ((diagonal - count) / 2) * this.hexHeight,
            hexRadius
          )
        );
        currentId++;
      }
      count += grow;
    }
  };
  drawHexes = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 450, 600);
    this.hexes.forEach(hex => {
      hex.draw();
    });
    if (currentRound > 2) {
      this.dice.draw(diceResult);
    }
  };
}
