class Market {
  constructor() {
    this.x = 315;
    this.y = 500;
    this.icon = new Image();
    this.width = 125;
    this.height = 75;
    this.active = false;
    this.icon.onload = this.draw;
    this.icon.src = "./img/MarketIcon.png";
    this.closeBtn = new Image();
    this.closeBtn.src = "./img/closeBtn.png";
    this.DealWithOtherPlayerBtn = new Image();
    this.DealWithOtherPlayerBtn.src = "./img/DealWithOtherPlayer.png";
    this.DealWithBankBtn = new Image();
    this.DealWithBankBtn.src = "./img/DealWithBank.png";
    this.dealWith = "otherPlayer";
    this.acceptBtn = new Image();
    this.acceptBtn.src = "./img/accept.png";
    this.offer = [0, 0, 0, 0, 0];
    this.demands = [0, 0, 0, 0, 0];
    this.isOfferSet = false;
    this.activePlayerIndex = 0;
    this.deal = false;
  }
  draw = () => {
    ctx.drawImage(this.icon, this.x, this.y);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  };
  drawPopup = () => {
    ctx.fillStyle = "burlywood";
    ctx.fillRect(0, 100, 600, 400);
    ctx.strokeRect(0, 100, 600, 400);
    if (!this.isOfferSet) {
      ctx.drawImage(this.closeBtn, 550, 100);
    }
    ctx.drawImage(this.DealWithOtherPlayerBtn, 125, 100);
    ctx.drawImage(this.DealWithBankBtn, 275, 100);
    ctx.strokeStyle = "green";
    switch (this.dealWith) {
      case "otherPlayer":
        ctx.strokeRect(125, 100, 125, 75);
        break;
      case "bank":
        ctx.strokeRect(275, 100, 125, 75);
        break;
    }
    ctx.strokeStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("offer", 50, 200);
    const colours = ["green", "lime", "brown", "gray", "yellow"];
    colours.forEach((colour, i) => {
      ctx.fillStyle = colour;
      ctx.fillRect(i * 60 + 115, 225, 50, 75);
      ctx.strokeRect(i * 60 + 115, 225, 50, 75);
      ctx.fillStyle = "black";
      ctx.fillText(this.offer[i], i * 60 + 135, 275);
      if (!this.isOfferSet) {
        this.drawTriangle(-1, 140 + i * 60, 220);
        this.drawTriangle(1, 140 + i * 60, 305);
      }
    });
    ctx.fillStyle = "black";
    ctx.fillText("demands", 50, 350);
    colours.forEach((colour, i) => {
      ctx.fillStyle = colour;
      ctx.fillRect(i * 60 + 115, 375, 50, 75);
      ctx.fillStyle = "black";
      ctx.strokeRect(i * 60 + 115, 375, 50, 75);
      ctx.fillText(this.demands[i], i * 60 + 135, 425);
      if (!this.isOfferSet) {
        this.drawTriangle(-1, 140 + i * 60, 370);
        this.drawTriangle(1, 140 + i * 60, 455);
      }
    });
    ctx.drawImage(this.acceptBtn, 550, 450);
    if (this.isOfferSet) {
      ctx.drawImage(this.closeBtn, 500, 450);
    }
  };
  handlePopup = e => {
    this.handlePopupClose(e);
    this.chooseMerchant(e);
    this.handleOffer(e);
    this.handleDenial(e);

    if (
      e.offsetX < 600 &&
      e.offsetX > 550 &&
      e.offsetY < 500 &&
      e.offsetY > 450
    )
      this.handleTrade();
  };
  checkCanTrade = () => {
    for (let i = 0; i < 5; i++) {
      if (currentPlayer.resources[i] < this.demands[i]) {
        return false;
      }
    }
    return true;
  };
  drawTriangle(orientation, x, y) {
    ctx.beginPath();
    ctx.fillStyle = "gray";
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x, y + 20 * orientation);
    ctx.lineTo(x + 20, y);
    ctx.closePath();
    ctx.fill();
  }
  handlePopupClose = e => {
    if (
      e.offsetX > 550 &&
      e.offsetX < 600 &&
      e.offsetY > 100 &&
      e.offsetY < 150 &&
      !this.isOfferSet
    ) {
      this.closePopup();
    }
  };
  chooseMerchant = e => {
    if (
      e.offsetX > 275 &&
      e.offsetX < 400 &&
      e.offsetY > 100 &&
      e.offsetY < 175
    ) {
      this.dealWith = "bank";
    }
    if (
      e.offsetX > 125 &&
      e.offsetX < 250 &&
      e.offsetY > 100 &&
      e.offsetY < 175
    ) {
      this.dealWith = "otherPlayer";
    }
  };
  handleOffer = e => {
    this.demands.forEach((demand, i) => {
      if (
        e.offsetX > i * 60 + 115 &&
        e.offsetX < i * 60 + 155 &&
        e.offsetY > 350 &&
        e.offsetY < 370
      ) {
        this.demands[i]++;
      }
      if (
        e.offsetX > i * 60 + 115 &&
        e.offsetX < i * 60 + 155 &&
        e.offsetY > 455 &&
        e.offsetY < 475 &&
        this.demands[i] > 0
      ) {
        this.demands[i]--;
      }
    });
    this.offer.forEach((demand, i) => {
      if (
        e.offsetX > i * 60 + 115 &&
        e.offsetX < i * 60 + 155 &&
        e.offsetY > 200 &&
        e.offsetY < 220 &&
        this.offer[i] < currentPlayer.resources[i]
      ) {
        this.offer[i]++;
      }
      if (
        e.offsetX > i * 60 + 115 &&
        e.offsetX < i * 60 + 155 &&
        e.offsetY > 305 &&
        e.offsetY < 320 &&
        this.offer[i] > 0
      ) {
        this.offer[i]--;
      }
    });
  };
  handleDenial = e => {
    if (
      e.offsetX > 500 &&
      e.offsetX < 550 &&
      e.offsetY > 450 &&
      e.offsetY < 500 &&
      this.isOfferSet
    ) {
      this.activePlayerIndex++;
      if (this.activePlayerIndex == players.length) {
        this.activePlayerIndex = 0;
      }
      currentPlayer = players[this.activePlayerIndex];
      if (currentPlayer === players[this.tradingPlayerIndex]) {
        this.closePopup();
      }
    }
  };
  closePopup = () => {
    this.active = false;
    this.isOfferSet = false;
    this.offer = [0, 0, 0, 0, 0];
    this.demands = [0, 0, 0, 0, 0];
    this.dealWith = "otherPlayer";
  };
  handleTrade = () => {
    if (this.dealWith === "otherPlayer") {
      if (!this.isOfferSet) {
        this.isOfferSet = true;
        this.tradingPlayerIndex = this.activePlayerIndex;
        this.activePlayerIndex++;
      } else {
        if (this.checkCanTrade()) {
          this.deal = true;
          currentPlayer.resources.forEach((resource, index) => {
            currentPlayer.resources[index] -= this.demands[index];
            currentPlayer.resources[index] += this.offer[index];
            players[this.tradingPlayerIndex].resources[index] += this.demands[
              index
            ];
            players[this.tradingPlayerIndex].resources[index] -= this.offer[
              index
            ];
          });
          this.activePlayerIndex = this.tradingPlayerIndex;
          this.closePopup();
        }
      }
      if (this.activePlayerIndex === players.length) {
        this.activePlayerIndex = 0;
      }
      currentPlayer = players[this.activePlayerIndex];
      if (
        players[this.tradingPlayerIndex] === currentPlayer &&
        this.isOfferSet
      ) {
      }
      if (this.activePlayerIndex === this.tradingPlayerIndex && this.deal) {
        currentPlayer.resources.forEach((resource, index) => {
          currentPlayer.resources[index] += this.demands[index];
          currentPlayer.resources[index] -= this.offer[index];
        });
      } else if (
        this.currentPlayerIndex === this.tradingPlayerIndex &&
        !this.deal
      ) {
        this.closePopup();
      }
    } else {
      const suppliesIndexes = [];
      let offeredSuplies = 0,
        demandedSupplies = 0;
      this.offer.forEach((supply, index) => {
        offeredSuplies += supply;
        if (supply !== 0) {
          suppliesIndexes.push(index);
          console.log(suppliesIndexes);
        }
      });
      this.demands.forEach(demand => {
        demandedSupplies += demand;
      });
      if (
        offeredSuplies === 4 * demandedSupplies &&
        suppliesIndexes.length === 1
      ) {
        currentPlayer.resources.forEach((resource, index) => {
          currentPlayer.resources[index] += this.demands[index];
          currentPlayer.resources[index] -= this.offer[index];
        });
      } else if (
        offeredSuplies === 3 * demandedSupplies &&
        suppliesIndexes.length === 1 &&
        currentPlayer.ports.findIndex(port => port.type === "3/1") !== -1
      ) {
        currentPlayer.resources.forEach((resource, index) => {
          currentPlayer.resources[index] += this.demands[index];
          currentPlayer.resources[index] -= this.offer[index];
        });
      } else if (
        offeredSuplies === 2 * demandedSupplies &&
        suppliesIndexes.length === 1
      ) {
        switch (suppliesIndexes[0]) {
          case 0:
            if (
              currentPlayer.ports.findIndex(port => port.type === "green") !==
              -1
            ) {
              currentPlayer.resources.forEach((resource, index) => {
                currentPlayer.resources[index] += this.demands[index];
                currentPlayer.resources[index] -= this.offer[index];
              });
            }
            break;
          case 1:
            if (
              currentPlayer.ports.findIndex(port => port.type === "lime") !== -1
            ) {
              currentPlayer.resources.forEach((resource, index) => {
                currentPlayer.resources[index] += this.demands[index];
                currentPlayer.resources[index] -= this.offer[index];
              });
            }
            break;
          case 2:
            if (
              currentPlayer.ports.findIndex(port => port.type === "brown") !==
              -1
            ) {
              currentPlayer.resources.forEach((resource, index) => {
                currentPlayer.resources[index] += this.demands[index];
                currentPlayer.resources[index] -= this.offer[index];
              });
            }
            break;
          case 3:
            if (
              currentPlayer.ports.findIndex(port => port.type === "gray") !== -1
            ) {
              currentPlayer.resources.forEach((resource, index) => {
                currentPlayer.resources[index] += this.demands[index];
                currentPlayer.resources[index] -= this.offer[index];
              });
            }
            break;
          case 4:
            if (
              currentPlayer.ports.findIndex(port => port.type === "yellow") !==
              -1
            ) {
              currentPlayer.resources.forEach((resource, index) => {
                currentPlayer.resources[index] += this.demands[index];
                currentPlayer.resources[index] -= this.offer[index];
              });
            }
            break;
        }
      }
      this.closePopup();
    }
  };
}
