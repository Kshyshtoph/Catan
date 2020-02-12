class Player {
  constructor(colour) {
    this.colour = colour;
    this.meeples = [];
    this.pushMeeples();
    this.pushRoads();
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
}
