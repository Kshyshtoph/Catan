class Market {
  constructor() {
    this.x = 315;
    this.y = 500;
    this.size = 75;
    this.active = false;
    this.icon = assignImage("./img/MarketIcon.png")
    this.closeBtn = assignImage("./img/closeBtn.png");
    this.DealWithOtherPlayerBtn = assignImage("./img/DealWithOtherPlayer.png");
    this.DealWithBankBtn = assignImage("./img/DealWithBank.png")
    this.acceptBtn = assignImage("./img/accept.png");
    this.dealWith = "otherPlayer";
    this.icon.onload = this.draw;
    this.offer = [0, 0, 0, 0, 0];
    this.demands = [0, 0, 0, 0, 0];
    this.isOfferSet = false;
    this.activePlayerIndex = 0;
    this.deal = false;
    this.colors = ["green", "lime", "brown", "gray", "yellow"];
  }
  draw = () => {
    ctx.drawImage(this.icon, this.x, this.y);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  };
  drawCard = (colour, i, counter = this.demands, top = 375) => {
    const spacing = 60
    const marginLeft = 115
    const width = 50
    const height = 75
    const left = i * spacing + marginLeft
    const centerX = left + width / 2
    const centerY = top + height / 2
    ctx.fillStyle = colour;
    ctx.fillRect(left, top, width, height);
    ctx.fillStyle = "black";
    ctx.strokeRect(i * spacing + marginLeft, top, width, height);
    ctx.fillText(counter[i], centerX, centerY);
    if (!this.isOfferSet) {
      let orientation = -1
      const offset = 5
      this.drawTriangle(orientation, centerX, top + (orientation * offset));
      orientation = 1
      this.drawTriangle(1, centerX, top + height + orientation * offset);
    }
  }
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
    colours.forEach((c, i) => this.drawCard(c, i, this.offer, 225));
    ctx.fillStyle = "black";
    ctx.fillText("demands", 50, 350);

    colours.forEach((c, i) => this.drawCard(c, i));
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
      checkCollission(e.offsetX, 500, 600, e.offsetY, 450, 500)
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
      checkCollission(e.offsetX, 275, 400, e.offsetY, 100, 175)
    ) {
      this.dealWith = "bank";
    }
    if (
      checkCollission(e.offsetX, 125, 250, e.offsetY, 100, 175)
    ) {
      this.dealWith = "otherPlayer";
    }
  };
  handleOffer = e => {
    const handleAmmount = (i, arr, y1, y2, additionalMoreCondition = true) => {
      const arrowLeft = i * 60 + 115
      const arrowRight = i * 60 + 155
      const vDistance = 105
      const moreCondition = checkCollission(e.offsetX, arrowLeft, arrowRight, e.offsetY, y1, y2)
      const lessCondition = checkCollission(e.offsetX, arrowLeft, arrowRight, e.offsetY, y1 + vDistance, y2 + vDistance) &&
        arr[i] > 0
      if (moreCondition && additionalMoreCondition)
        arr[i]++
      if (lessCondition)
        arr[i]--
    }
    this.demands.forEach((_, i, arr) => {
      handleAmmount(i, arr, 350, 370)
    });
    this.offer.forEach((supply, i, arr) => {
      handleAmmount(i, arr, 200, 220, supply < currentPlayer.resources[i])
    });
  };
  handleDenial = e => {
    if (
      checkCollission(e.offsetX, 200, 550, e.offsetY, 450, 500) &&
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
  handlePlayerTrade() {
    if (!this.isOfferSet) {
      this.isOfferSet = true;
      this.tradingPlayerIndex = this.activePlayerIndex;
      this.activePlayerIndex++;
    } else {
      if (this.checkCanTrade()) {
        this.deal = true;
        currentPlayer.trade(this.offer, this.demands)
        players[this.tradingPlayerIndex].trade(this.demands, this.offer)
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
      currentPlayer.trade(this.demands, this.offer)
    } else if (
      this.currentPlayerIndex === this.tradingPlayerIndex &&
      !this.deal
    ) {
      this.closePopup();
    }
  }
  handleTrade = () => {
    if (this.dealWith === "otherPlayer") {
      this.handlePlayerTrade()
    } else {
      const suppliesIndexes = [];
      let offeredSuplies = 0,
        demandedSupplies = 0;
      this.offer.forEach((supply, index) => {
        offeredSuplies += supply;
        if (supply !== 0) {
          suppliesIndexes.push(index);
          console.log("suppliesIndexes", suppliesIndexes);
        }
      });
      this.demands.forEach(demand => {
        demandedSupplies += demand;
      });

      const types = ["green", "lime", "brown", "gray", "yellow"]
      const normalTrade = (offeredSuplies === 4 * demandedSupplies &&
        suppliesIndexes.length === 1)
      const threePerOneTrade = (
        currentPlayer.ports.findIndex(port => port.type === "3/1") !== -1 &&
        offeredSuplies === 3 * demandedSupplies &&
        suppliesIndexes.length === 1
      )
      const twoPerOneTrade = (
        currentPlayer.ports.findIndex(port => port.type === types[suppliesIndexes[0]]) !== -1 &&
        offeredSuplies === 2 * demandedSupplies &&
        suppliesIndexes.length === 1
      )

      if (
        normalTrade ||
        threePerOneTrade ||
        twoPerOneTrade
      ) {
        currentPlayer.trade(this.demands, this.offer)
      }
      this.closePopup();
    }
  };
}
