const canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 600;
const hexRadius = 50;
const boardRadius = 3;
const ctx = canvas.getContext("2d");

const board = new Board(boardRadius, hexRadius);
board.pushNubers();
board.createHexes();
board.drawHexes();
const players = [new Player("red"), new Player("beige")];
const interface = new Interface(players[0]);
interface.draw();

canvas.addEventListener("click", interface.handleClick);
