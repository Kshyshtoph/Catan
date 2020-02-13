class Player {
  constructor(colour) {
    this.colour = colour;
    this.meeples = [];
    this.freeSettlement = true;
    this.freeRoad = true;
    this.canAffordRoad = false;
    this.canAffordSettlement = false;
    this.canAffordCity = false;
    this.pushMeeples();
    this.pushRoads();
    this.resources = [0, 0, 0, 0, 0];
  }
  pushRoads = () => {
    for (let i = 0; i < 15; i++) {
      this.meeples.push(new Road(this, i));
    }
  };
  pushMeeples = () => {
    for (let i = 0; i < 5; i++) {
      this.meeples.push(new Settlement(this, i));
    }
    for (let i = 0; i < 4; i++) {
      this.meeples.push(new City(this, i));
    }
  };
  drawMeeples = () => {
    this.meeples.forEach(meeple => {
      meeple.draw();
    });
  };
  drawPlayingMeeples = () => {
    this.meeples.forEach(meeple => {
      if (meeple.inPlay) {
        meeple.draw();
      }
    });
  };
  drawResources() {
    ctx.font = "30px Arial";
    const colours = ["green", "lime", "brown", "gray", "yellow"];
    colours.forEach((colour, i) => {
      ctx.fillStyle = colour;
      ctx.fillRect(i * 60 + 10, 500, 50, 75);
      ctx.strokeRect(i * 60 + 10, 500, 50, 75);
      ctx.fillStyle = "black";
      ctx.fillText(this.resources[i], i * 60 + 30, 560);
    });
  }
}
