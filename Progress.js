class Progress {
  constructor() {
    this.x = 365;
    this.y = 400;
    this.height = 75;
    this.width = 50;
    this.deck = new Image();
    this.deck.src = "./img/deck.png";
    this.knight = new Image();
    this.knight.src = "./img/knight.png";
    this.deck.onload = this.draw;
    this.closeBtn = new Image();
    this.closeBtn.src = "./img/closeBtn.png";
    this.monopoly = new Image();
    this.monopoly.src = "./img/monopoly.png";
    this.victoryPoint = new Image();
    this.victoryPoint.src = "./img/victoryPoint.png";
    this.invention = new Image();
    this.invention.src = "./img/invention.png";
    this.roadBuild = new Image();
    this.roadBuild.src = "./img/roadBuild.png";
    this.active = false;
    this.popupHeight = 0;
    this.popupWidth = 0;
    this.monopolyPopupActive = false;
    this.inventionPopupActive = false;
  }
  draw = () => {
    ctx.strokeStyle = "black";
    ctx.drawImage(this.deck, this.x, this.y);
    ctx.strokeRect(this.x, this.y, 50, 75);
  };
  drawPopup = () => {
    this.popupWidth =
      (currentPlayer.progressCards.length < 4
        ? currentPlayer.progressCards.length * 100
        : 400) + 200;
    this.popupHeight =
      Math.floor(currentPlayer.progressCards.length / 4) * 125 + 150;
    ctx.fillStyle = "burlywood";
    ctx.fillRect(
      300 - this.popupWidth / 2,
      300 - this.popupHeight / 2,
      this.popupWidth,
      this.popupHeight
    );
    ctx.drawImage(
      this.closeBtn,
      300 + this.popupWidth / 2 - 50,
      300 - this.popupHeight / 2
    );
    ctx.drawImage(this.deck, 300 + this.popupWidth / 2 - 125, 266.5);
    this.handleCardDraw();
  };
  handlePopup = e => {
    for (let i = 0; i < currentPlayer.progressCards.length; i++) {
      const x = 300 - this.popupWidth / 2 + (i % 4) * 100 + 25;
      const y = 300 - this.popupHeight / 2 + (i <= 3 ? 25 : 150);
      this.handleCardPlay(e, x, y, currentPlayer.progressCards[i], i);
    }
    const { offsetX: x, offsetY: y } = e
    if (
      checkCollission(x, 175 + this.popupWidth / 2, 225 + this.popupWidth / 2, y, 266.5, 341.5) &&
      currentPlayer.canAffordProgressCard()
    ) {
      currentPlayer.progressCards.push({
        type: this.generateCard(),
        age: currentRound
      });
      currentPlayer.resources[1] -= 1;
      currentPlayer.resources[3] -= 1;
      currentPlayer.resources[4] -= 1;
    }
    this.handlePopupClose(e);
  };
  handlePopupClose = e => {
    if (
      e.offsetX > 300 + this.popupWidth / 2 - 50 &&
      e.offsetX < this.popupWidth / 2 + 300 &&
      e.offsetY > 300 - this.popupHeight / 2 &&
      e.offsetY < 350 - this.popupHeight / 2
    ) {
      this.active = false;
    }
  };
  handleCardPlay = (e, x, y, card, i) => {
    const cardWidth = 50;
    const cardHeight = 75;
    if (
      e.offsetX > x &&
      e.offsetX < x + cardWidth &&
      e.offsetY > y &&
      e.offsetY < y + cardHeight
    ) {
      switch (card.type) {
        case 1:
          if (card.age < currentRound) {
            board.thief.isSet = false;
            currentPlayer.knightsPlayed++;
          }
          break;
        case 2:
          currentPlayer.victoryPoints++;
          break;
        case 3:
          if (card.age < currentRound) {
            this.monopolyPopupActive = true;
          }
          break;
        case 4:
          if (card.age < currentRound) {
            currentPlayer.freeRoads = 2;
          }
          break;
        case 5:
          if (card.age < currentRound) {
            currentPlayer.freeResources = 2;
            this.inventionPopupActive = true;
          }
          break;
      }
      currentPlayer.progressCards.splice(i, 1);
      this.active = false;
    }
  };
  drawCard = (image) => {
    ctx.drawImage(
      image,
      325 - this.popupWidth / 2 + (i % 4) * 100,
      300 - this.popupHeight / 2 + (i > 3 ? 150 : 25)
    );
  }
  handleCardDraw = () => {
    for (let i = 0; i < currentPlayer.progressCards.length; i++) {
      const cardType = currentPlayer.progressCards[i].type - 1
      const cards = [this.knight, this.victoryPoint, this.monopoly, this.roadBuild, this.invention]
      this.drawCard(cards[cardType])
    }
  }

  generateCard = () => {
    const card = Math.random();
    if (card < 0.5) return 1;
    else if (card < 0.75) return 2;
    else if (card < 0.85) return 3;
    else if (card < 0.9) return 4;
    else return 5;
  };
  drawMonopolyPopup = () => {
    ctx.fillStyle = "burlywood";
    ctx.strokeStyle = "black";
    ctx.fillRect(100, 200, 400, 125);
    const colours = ["green", "lime", "brown", "gray", "yellow"];
    colours.forEach((colour, index) => {
      ctx.fillStyle = colour;
      ctx.fillRect(125 + index * 75, 225, 50, 75);
    });
  };
  handleMonopolyPopup = e => {
    const { offsetX: x, offsetY: y } = e
    for (let i = 0; i < 5; i++) {
      let numberOfResources = 0;
      if (checkCollission(x, 125 + i * 75, 175 + i * 75, y, 225, 300)) {
        players.forEach(player => {
          numberOfResources += player.resources[i];
          player.resources[i] = 0;
        });
        currentPlayer.resources[i] = numberOfResources;
      }
      this.monopolyPopupActive = false;
    }
  };
  handleInventionPopup = e => {
    const { offsetX: x, offsetY: y } = e

    if (currentPlayer.freeResources > 0) {
      for (let i = 0; i < 5; i++) {
        if (checkCollission(x, 125 + i * 75, 175 + i * 75, y, 225, 300)) {
          currentPlayer.resources[i] += 1;
          currentPlayer.freeResources--;
          if (currentPlayer.freeResources === 0) {
            this.inventionPopupActive = false;
          }
        }
      }
    }
  };
}