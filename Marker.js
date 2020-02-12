class Marker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.active = false;
    this.taken = false;
    this.type = "building";
    this.ocupation = null;
  }
  draw = () => {
    if (
      !this.taken &&
      (currentPlayer.freeSettlement || currentPlayer.canAffordSettlement)
    ) {
      ctx.fillStyle = "blue";
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }
  };
}
class RoadMarker extends Marker {
  constructor(x, y, direction) {
    super(x, y);
    this.direction = direction;
    this.type = "road";
    this.canBuild = [];
  }
  draw = () => {
    if (
      !this.taken &&
      this.canBuild.includes(currentPlayer) &&
      (currentPlayer.freeRoad || currentPlayer.canAffordRoad)
    ) {
      ctx.fillStyle = "blue";
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }
  };
}
