class Marker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.active = false;
    this.taken = false;
    this.type = "building";
    this.ocupation = null;
    this.canBuild = [];
    this.city = false;
  }
  draw = () => {
    if (currentRound <= 2) {
      if (
        !this.taken &&
        (currentPlayer.freeSettlement || currentPlayer.canAffordSettlement())
      ) {
        ctx.fillStyle = "blue";
        ctx.fillRect(
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
      }
    } else if (
      this.canBuild.includes(currentPlayer) &&
      !this.taken &&
      currentPlayer.canAffordSettlement()
    ) {
      ctx.fillStyle = "blue";
      ctx.fillRect(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    }
  };
}

class BuildingMarker extends Marker {
  pay(resource) {
    let payoff = this.ocupation ? 1 : 0
    if (!payoff) return;
    if (marker.city) payoff++
    this.ocupation.resources[resource] += payoff
  }
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
      (currentPlayer.freeRoads > 0 || currentPlayer.canAffordRoad())
    ) {
      ctx.fillStyle = "blue";
      ctx.fillRect(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    }
  };
}
