class Interface {
  constructor(player) {
    this.player = player;
    this.skipper = new Skipper(players);
  }
  isIntersecting(x1, x2, y1, y2, box, modifyier = 0) {
    return (
      x1 > x2 - box - modifyier &&
      x1 < x2 + box + modifyier &&
      y1 > y2 - box + modifyier &&
      y1 < y2 + box - modifyier
    )
  }
  offset({ x, y, size }) {
    return ({ x2: x + size / 2, y2: y + size / 2, size: size / 2 })
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
    const index = this.player.meeples.findIndex(meeple => meeple.active === true && meeple.type === "settlement")
    if (index === -1) return;
    const activeMeeple = this.player.meeples[index];
    let settlementBuilt = false;
    board.hexes.forEach(hex => {
      hex.buildingMarkers.forEach(marker => {
        const { x, y, size } = marker;
        const boxSize = size / 2
        if (
          this.isIntersecting(e.offsetX, x, e.offsetY, y, boxSize) &&
          !marker.taken &&
          (this.player.freeSettlement || this.player.canAffordSettlement())
        ) {
          activeMeeple.moveToMarker(marker)
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
              if (this.isIntersecting(m.x, marker.x, m.y, marker.y, hexRadius, 5))
                m.taken = true;
              if (this.isIntersecting(m.x, marker.x, m.y, marker.y, 1))
                m.ocupation = this.player;
            });
            hex.roadMarkers.forEach(m => {
              if (this.isIntersecting(m.x, marker.x, m.y, marker.y, hexRadius))
                m.canBuild.push(this.player);
            });
          });
        }
      });
    });
    if (settlementBuilt) this.player.victoryPoints++;
    board.ports.forEach(port => {
      if (
        this.isIntersecting(
          activeMeeple.x + activeMeeple.size / 2,
          port.x, activeMeeple.y + activeMeeple.size / 2,
          port.y,
          port.radius)
      ) this.player.ports.push(port);
    });
  };
  handleRoadBuild = e => {
    let roadBuilt = false;
    const index = this.player.meeples.findIndex(meeple => meeple.active === true && meeple.type === "road")
    if (index === -1 || !(this.player.freeRoads || this.player.canAffordRoad())) return;
    const activeMeeple = this.player.meeples[index];

    board.hexes.forEach(hex => {
      hex.roadMarkers.forEach(marker => {
        const { x, y, size } = marker;
        if (
          this.isIntersecting(e.offsetX, x, e.offsetY, y, size / 2) &&
          !marker.taken &&
          marker.canBuild.includes(this.player)
        ) {
          activeMeeple.moveToMarker(marker)
          roadBuilt = true;
          marker.ocupation = this.player;
          marker.ocupation = currentPlayer;
          board.hexes.forEach(hex => {
            hex.roadMarkers.forEach(m => {
              if (
                this.isIntersecting(m.x, marker.x, hexRadius, 5)
              ) {
                m.active = true;
                m.canBuild.push(this.player);
                activeMeeple.neighbours.push(m);
              }
            });

            hex.buildingMarkers.forEach(m => {
              if (this.isIntersecting(m.x, marker.x, hexRadius))
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
  };
  handleCityBuild = e => {
    let cityBuilt = false;
    const index = this.player.meeples.findIndex(
      meeple => meeple.active === true && meeple.type === "city"
    )
    if (index === -1 || !this.player.canAffordCity()) return;
    console.log('building city')
    const activeMeeple = this.player.meeples[index];

    this.player.meeples.forEach(meeple => {
      if (meeple.type === "settlement" && meeple.inPlay) {
        const { offsetX: x1, offsetY: y1 } = e
        const { x2, y2, size: size } = this.offset(meeple)
        if (this.isIntersecting(x1, x2, y1, y2, size)) {
          activeMeeple.replaceSettlement(meeple);
          cityBuilt = true;
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
  };
  handleMeepleSelect = e => {
    this.player.meeples.forEach(meeple => {
      if (!meeple.inPlay) {
        const { offsetX: x1, offsetY: y1 } = e
        const { x2, y2, size } = this.offset(meeple)
        meeple.active = false;
        if (this.isIntersecting(x1, x2, y1, y2, size)) {
          meeple.active = true;
        }
      }
    });
  };
  handlePopupShow(e) {
    const { offsetX: x1, offsetY: y1 } = e
    const { x2, y2, size: marketSize } = this.offset(market)
    if (this.isIntersecting(x1, x2, y1, y2, marketSize)) {
      market.activePlayerIndex = players.findIndex(
        player => player === currentPlayer
      );
      market.active = true;
      market.isOfferSet = false;
    }
    const { x2: x3, y2: y3, size: progressSize } = this.offset(progress)
    if (this.isIntersecting(x1, x2, x3, y3, progressSize)
    ) {
      progress.active = true;
    }
  };
  handleSkipping = e => {
    const { offsetX: x1, offsetY: y1 } = e
    const { x2, y2, size } = this.offset(this.skipper)
    if (
      this.isIntersecting(x1, x2, y1, y2, size)
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
