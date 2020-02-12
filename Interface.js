class Interface {
  constructor(player) {
    this.player = player;
    this.skipper = new Skipper(players);
  }
  draw = () => {
    ctx.fillStyle = "burlywood";
    ctx.fillRect(450, 0, 150, 600);
    if (
      this.player.meeples.findIndex(
        meeple => meeple.active === true && meeple.type === "settlement"
      ) !== -1
    ) {
      board.hexes.forEach(hex => {
        hex.drawBuildingMarkers();
      });
    } else {
      board.drawHexes();
    }
    players.forEach(player => player.drawPlayingMeeples());
    this.player.drawMeeples();
    this.skipper.draw();
  };
  handleClick = e => {
    if (
      this.player.meeples.findIndex(meeple => meeple.active === true) !== -1
    ) {
      const activeMeeple = this.player.meeples[
        this.player.meeples.findIndex(meeple => meeple.active === true)
      ];
      board.hexes.forEach(hex => {
        hex.buildingMarkers.forEach(marker => {
          const { x, y, width, height } = marker;
          if (
            e.offsetX > x - width / 2 &&
            e.offsetX < x + width / 2 &&
            e.offsetY > y - height / 2 &&
            e.offsetY < y + height / 2 &&
            !marker.taken
          ) {
            activeMeeple.x = x - activeMeeple.height / 2;
            activeMeeple.y = y - activeMeeple.width / 2;
            activeMeeple.inPlay = true;
            activeMeeple.active = false;
            marker.taken = true;
            board.hexes.forEach(hex => {
              hex.buildingMarkers.forEach(m => {
                if (
                  m.x > marker.x - hexRadius - 5 &&
                  m.x < marker.x + hexRadius + 5 &&
                  m.y > marker.y - hexRadius - 5 &&
                  m.y < marker.y + hexRadius + 5
                ) {
                  m.taken = true;
                }
              });
            });
          }
        });
      });
    }
    this.player.meeples.forEach(meeple => {
      if (!meeple.inPlay) {
        const { x, y, width, height } = meeple;
        meeple.active = false;
        if (
          e.offsetX > x &&
          e.offsetX < x + width &&
          e.offsetY > y &&
          e.offsetY < y + height
        ) {
          meeple.active = true;
        }
      }
    });
    if (
      e.offsetX > this.skipper.x &&
      e.offsetX < this.skipper.x + this.skipper.width &&
      e.offsetY > this.skipper.y &&
      e.offsetY < this.skipper.y + this.skipper.height
    ) {
      this.skipper.skip();
      this.player = players[this.skipper.activePlayerIndex];
    }
    this.draw();
  };
}
