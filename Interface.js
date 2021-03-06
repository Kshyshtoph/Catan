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
    } else if (
      this.player.meeples.findIndex(
        meeple => meeple.active === true && meeple.type === "road"
      ) !== -1
    ) {
      board.hexes.forEach(hex => hex.drawRoadMarkers());
    } else {
      board.drawHexes();
    }
    players.forEach(player => player.drawPlayingMeeples());
    currentPlayer.drawMeeples();
    currentPlayer.drawResources();
    this.skipper.draw();
    market.draw();
    progress.draw();
    this.player.drawVictoryPoints();
    this.player.drawLongestRoad();
    this.player.drawKnightsPlayed();
    board.thief.draw();
    if (market.active) {
      market.drawPopup();
    }
    if (board.thief.active) {
      board.thief.drawPlayersPopup();
    }
    if (progress.active) {
      progress.drawPopup();
    }
    if (progress.monopolyPopupActive) {
      progress.drawMonopolyPopup();
    }
    if (progress.inventionPopupActive) {
      progress.drawMonopolyPopup();
    }
  };
  handleClick = e => {
    if (
      !market.active &&
      !board.thief.active &&
      !progress.active &&
      !progress.monopolyPopupActive &&
      !progress.inventionPopupActive
    ) {
      this.handleSettlementBuild(e);
      this.handleRoadBuild(e);
      this.handleCityBuild(e);
      this.handlePopupShow(e);
      this.handleMeepleSelect(e);
      this.handleThiefSetting(e);
      this.handleSkipping(e);
    } else if (market.active) {
      market.handlePopup(e);
    } else if (board.thief.active) {
      board.thief.handlePlayersPopup(e);
    } else if (progress.active) {
      progress.handlePopup(e);
    } else if (progress.monopolyPopupActive) {
      progress.handleMonopolyPopup(e);
    } else {
      progress.handleInventionPopup(e);
    }

    this.draw();
  };
  handleSettlementBuild = e => {
    if (
      this.player.meeples.findIndex(
        meeple => meeple.active === true && meeple.type === "settlement"
      ) !== -1
    ) {
      const activeMeeple = this.player.meeples[
        this.player.meeples.findIndex(meeple => meeple.active === true)
      ];
      let settlementBuilt = false;
      board.hexes.forEach(hex => {
        hex.buildingMarkers.forEach(marker => {
          const { x, y, width, height } = marker;
          if (
            e.offsetX > x - width / 2 &&
            e.offsetX < x + width / 2 &&
            e.offsetY > y - height / 2 &&
            e.offsetY < y + height / 2 &&
            !marker.taken &&
            (this.player.freeSettlement || this.player.canAffordSettlement())
          ) {
            activeMeeple.x = x - activeMeeple.height / 2;
            activeMeeple.y = y - activeMeeple.width / 2;
            activeMeeple.inPlay = true;
            activeMeeple.active = false;
            marker.taken = true;
            settlementBuilt = true;
            marker.ocupation = this.player;
            if (!this.player.freeSettlement) {
              this.player.resources[0] -= 1;
              this.player.resources[2] -= 1;
              this.player.resources[4] -= 1;
              this.player.resources[1] -= 1;
            }
            this.player.freeSettlement = false;
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
                if (
                  m.x > marker.x - 1 &&
                  m.x < marker.x + 1 &&
                  m.y > marker.y - 1 &&
                  m.y < marker.y + 1
                ) {
                  m.ocupation = this.player;
                }
              });
              hex.roadMarkers.forEach(m => {
                if (
                  m.x > marker.x - hexRadius &&
                  m.x < marker.x + hexRadius &&
                  m.y > marker.y - hexRadius &&
                  m.y < marker.y + hexRadius
                ) {
                  m.canBuild.push(this.player);
                }
              });
            });
          }
        });
      });
      if (settlementBuilt) this.player.victoryPoints++;
      board.ports.forEach(port => {
        if (
          activeMeeple.x + activeMeeple.width / 2 <= port.x + port.radius &&
          activeMeeple.x + activeMeeple.width / 2 >= port.x - port.radius &&
          activeMeeple.y + activeMeeple.height / 2 >= port.y - port.radius &&
          activeMeeple.y + activeMeeple.height / 2 <= port.y + port.radius
        ) {
          this.player.ports.push(port);
        }
      });
    }
  };
  handleRoadBuild = e => {
    let roadBuilt = false;
    if (
      this.player.meeples.findIndex(
        meeple => meeple.active === true && meeple.type === "road"
      ) !== -1 &&
      (this.player.freeRoads || this.player.canAffordRoad())
    ) {
      const activeMeeple = this.player.meeples[
        this.player.meeples.findIndex(meeple => meeple.active === true)
      ];

      board.hexes.forEach(hex => {
        hex.roadMarkers.forEach(marker => {
          const { x, y, width, height } = marker;
          if (
            e.offsetX > x - width / 2 &&
            e.offsetX < x + width / 2 &&
            e.offsetY > y - height / 2 &&
            e.offsetY < y + height / 2 &&
            !marker.taken &&
            marker.canBuild.includes(this.player)
          ) {
            activeMeeple.x = x - activeMeeple.width / 2;
            activeMeeple.y = y - activeMeeple.height / 2;
            activeMeeple.inPlay = true;
            activeMeeple.active = false;
            activeMeeple.direction = marker.direction;
            marker.taken = true;
            marker.ocupation = this.player;
            roadBuilt = true;
            marker.ocupation = currentPlayer;
            board.hexes.forEach(hex => {
              hex.roadMarkers.forEach(m => {
                if (
                  m.x > marker.x - hexRadius - 5 &&
                  m.x < marker.x + hexRadius + 5 &&
                  m.y > marker.y - hexRadius - 5 &&
                  m.y < marker.y + hexRadius + 5
                ) {
                  m.active = true;
                  m.canBuild.push(this.player);
                  activeMeeple.neighbours.push(m);
                }
              });
              hex.buildingMarkers.forEach(m => {
                if (
                  m.x > marker.x - hexRadius &&
                  m.x < marker.x + hexRadius &&
                  m.y > marker.y - hexRadius &&
                  m.y < marker.y + hexRadius
                )
                  m.canBuild.push(this.player);
              });
            });
          }
        });
      });
      if (this.player.freeRoads === 0 && roadBuilt) {
        this.player.resources[0] -= 1;
        this.player.resources[2] -= 1;
        this.player.findLongestRoad();
      }
      if (roadBuilt && this.player.freeRoads !== 0) {
        this.player.freeRoads -= 1;
        this.player.findLongestRoad();
      }
    }
  };
  handleCityBuild = e => {
    let cityBuilt = false;
    if (
      this.player.meeples.findIndex(
        meeple => meeple.active === true && meeple.type === "city"
      ) !== -1 &&
      this.player.canAffordCity()
    ) {
      const activeMeeple = this.player.meeples[
        this.player.meeples.findIndex(
          meeple => meeple.active === true && meeple.type === "city"
        )
      ];

      this.player.meeples.forEach(meeple => {
        if (meeple.type === "settlement" && meeple.inPlay) {
          if (
            e.offsetX > meeple.x &&
            e.offsetX < meeple.x + meeple.width &&
            e.offsetY > meeple.y &&
            e.offsetY < meeple.y + meeple.height
          ) {
            activeMeeple.x = meeple.x;
            activeMeeple.y = meeple.y;
            meeple.x = meeple.initialX;
            cityBuilt = true;
            meeple.y = meeple.initialY;
            meeple.inPlay = false;
            activeMeeple.active = false;
            activeMeeple.inPlay = true;
          }
          board.hexes.forEach(hex => {
            hex.buildingMarkers.forEach(marker => {
              if (marker.x === activeMeeple.x && marker.y === activeMeeple.y) {
                marker.city = true;
              }
            });
          });
        }
      });
      if (cityBuilt) {
        this.player.resources[3] -= 3;
        this.player.resources[4] -= 2;
        this.player.victoryPoints += 1;
      }
    }
  };
  handleMeepleSelect = e => {
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
  };
  handlePopupShow = e => {
    if (
      e.offsetX > market.x &&
      e.offsetX < market.x + market.width &&
      e.offsetY > market.y &&
      e.offsetY < market.y + market.height
    ) {
      market.activePlayerIndex = players.findIndex(
        player => player === currentPlayer
      );
      market.active = true;
      market.isOfferSet = false;
    }
    if (
      e.offsetX > progress.x &&
      e.offsetX < progress.x + progress.width &&
      e.offsetY > progress.y &&
      e.offsetY < progress.y + progress.height
    ) {
      progress.active = true;
    }
  };
  handleSkipping = e => {
    if (
      e.offsetX > this.skipper.x &&
      e.offsetX < this.skipper.x + this.skipper.width &&
      e.offsetY > this.skipper.y &&
      e.offsetY < this.skipper.y + this.skipper.height
    ) {
      this.skipper.skip();
      this.player = players[this.skipper.activePlayerIndex];
    }
  };
  handleThiefSetting = e => {
    if (!board.thief.isSet) {
      let nearest = 300;
      let thiefHex;
      board.hexes.forEach(hex => {
        const distance = Math.sqrt(
          Math.pow(e.offsetX - hex.x, 2) + Math.pow(e.offsetY - hex.y, 2)
        );
        if (distance < nearest) {
          nearest = distance;
          board.thief.x = hex.x;
          board.thief.y = hex.y;
          board.thief.isSet = true;
          thiefHex = hex;
        }
      });
      thiefHex.buildingMarkers.forEach(marker => {
        if (
          marker.ocupation &&
          !board.thief.stealFrom.includes(marker.ocupation) &&
          marker.ocupation !== this.player
        ) {
          board.thief.stealFrom.push(marker.ocupation);
        }
      });
      if (board.thief.stealFrom !== []) board.thief.active = true;
    }
  };
}
