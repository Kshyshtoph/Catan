const canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 600;
const hexRadius = 50;
const boardRadius = 3;
const ctx = canvas.getContext("2d");
const players = [new Player("red"), new Player("beige")];
let currentPlayer = players[0];
let currentRound = 1;
let diceResult = 0;
const board = new Board(boardRadius, hexRadius);
const interface = new Interface(players[0]);
board.pushNubers();
board.createHexes();
board.drawHexes();
interface.draw();

canvas.addEventListener("click", interface.handleClick);
