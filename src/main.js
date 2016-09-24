var style = require('./main.scss');
var html = require('./index.html');
var $ = require('jquery');

var player;
var computer;
var game;
var board;

//gets the original classes of game-squares for reset
var lines = {
  "topRow": [0, 1, 2],
  "midRow": [3, 4, 5],
  "botRow": [6, 7, 8],
  "leftCol": [0, 3, 6],
  "midCol": [1, 4, 7],
  "rightCol": [2, 5, 8],
  "rightDiag": [0, 4, 8],
  "leftDiag": [2, 4, 6]
};
function emptyBoard() {
  return [1, 1, 1, 1, 1, 1, 1, 1, 1];
}
var Player = function (piece) {
  // create player object constructor
  this.piece = piece;
}
Player.prototype.move = function (elementID) {
  var openSquares = $('.open');
  board.update(elementID);
  openSquares.off('click');
  game.turnCount++;
  game.toggleTurn();
  continueGame();
}

function Computer(piece) {
  //create a child of the player class called computer
  Player.call(this, piece);
}
//set computer.prototype equal to the player.prototype
Computer.prototype = Object.create(Player.prototype);
Computer.prototype.constructor = Computer;

Computer.prototype.makeMove = function () {
  //TODO: expand this function to more turns
  if(game.turnCount === 0) {
    this.move(0);
  }
  else if(game.turnCount > 1) {
    var moveLoc = findOpenSquare();
    this.move(moveLoc);
  }
}
Computer.prototype.move = function (elemID) {
  board.update(elemID);
  game.turnCount++;
  game.toggleTurn();
  continueGame();
}

var Game = function () {
  //create game object
  this.turn = 'computer';
  this.win = false;
  this.winner = '';
  this.winningLine = '';
  this.boardState = [];
  this.turnCount = 0;
};
Game.prototype.toggleTurn = function () {
  //toggles turn between computer and player
  if(this.turn == 'computer') {
    this.turn = 'player';
  }
  else {
    this.turn = 'computer';
  }
}
Game.prototype.isOver = function () {
  return this.hasWinner() || board.isFull();
}

Game.prototype.checkForWin = function () {
  var temp;
  var xCount;
  var oCount;
  for(var key in lines) {
    temp = getLine(key);
    xCount = 0;
    oCount = 0;
    for(var i = 0; i < temp.length; i++) {
      if (temp[i] === 'X') {
        xCount++;
      }else if (temp[i] === 'O') {
        oCount++;
      }
    }
    if (xCount > 2) {
      if (player.piece === 'X') {
        this.winner = 'player';
      }else {
        this.winner = 'computer';
      }
      this.win = true;
      this.winningLine = key;
      break;
    } else if (oCount > 2) {
      if (player.piece === 'O') {
        this.winner = 'player';
      }else {
        this.winner = 'computer';
      }
      this.win = true;
      this.winningLine = key;
      break;
    }
  }
}

Game.prototype.hasWinner = function () {
  return this.win;
}

Game.prototype.getWinner = function () {
  if (board.isFull()) {
    this.winner = 'cat';
  }
  return this.winner;
}

Game.prototype.reset = function () {
  this.turn = 'computer';
  this.win = false;
  this.winner = '';
  this.winningLine = '';
  this.boardState = [];
  this.turnCount = 0;
}
var Board = function () {
  this.boardState = emptyBoard();
  this.playerMoves = [];
  this.computerMoves = [];
}

Board.prototype.update = function (elementID) {
  var query = '#' + elementID;
  var piece;
  if (game.turn == 'player') {
    piece = player.piece;
    this.playerMoves.push(elementID);
  }else {
    piece = computer.piece;
    this.computerMoves.push(elementID);
  }
  $(query)
  .addClass(piece)
  .addClass('closed')
  .removeClass('open');
  this.boardState[elementID] = piece;
}
Board.prototype.isFull = function () {
  //returns true if the boardState doesn't have a 1
  return this.boardState.indexOf(1) === -1;
}
Board.prototype.reset = function() {
  this.boardState = emptyBoard();
  this.playerMoves = [];
  this.computerMoves = [];
}


function startGame() {
  //show popup for piece selection then call playGame with the choice
  var pieceSelect = $('#piece-select');
  pieceSelect.show();
  $('.piece-select-button')
    .click(function () {
      var playerChoice = $(this)
        .html();
      pieceSelect.hide();
      makePlayers(playerChoice);
    })
}

function makePlayers(playerChoice) {
  player = new Player(playerChoice);
  if(playerChoice == 'X') {
    computer = new Computer('O');
  }
  else {
    computer = new Computer('X');
  }
  game = new Game();
  board = new Board();
  continueGame();
}

function continueGame() {
  game.checkForWin();
  if(game.isOver()) {
    console.log('gameOver');
    setTimeout(function() {
      showWinner();
    }, 400);
    return false;
  }else {
  playTurn();
  }
}

function playTurn() {
  var piece;
  if(game.turn == 'player') {
    var openSquares = $('.open');
    openSquares.click(function(){
      var elemID = $(this).attr('id');
      player.move(elemID);
    });
  }
  if(game.turn == 'computer') {
    computer.makeMove();
  }
}

function getLine(lineKey) {
  var indexes = lines[lineKey];
  return [getSquare(indexes[0]), getSquare(indexes[1]), getSquare(indexes[2])];
}
function getSquare(squareIndex) {
  return board.boardState[squareIndex];
}


function findOpenSquare() {
  if(board.boardState[8] === 1) {
    return 8;
  }
  else if(board.boardState[4] === 1) {
    return 4;
  }
  else if(board.boardState[6] === 1) {
    return 6;
  }
  else if(board.boardState[3] === 1) {
    return 3;
  }
  else if(board.boardState[7] === 1) {
    return 7;
  }
  else if(board.boardState[5] === 1) {
    return 5;
  }
  else if(board.boardState[2] === 1) {
    return 2;
  }
  else if(board.boardState[1] === 1) {
    return 1;
  }
}
function showWinner() {
  var winner = game.getWinner();
  var winElem = $('#winner');
  var endScreen = $('#end-screen');
  if (winner === 'cat') {
    winElem.html('Tie game');
  }else {
    winElem.html(winner + ' wins!');
  }
  endScreen.show();
  setTimeout(function() {
    resetGame();
    endScreen.hide();
    continueGame();
}, 3000);
}

function resetGame() {
  game.reset();
  board.reset();
  var gs = $('.game-square');
  gs
    .removeClass('closed')
  .removeClass('X')
  .removeClass('O')
  .addClass('open');
}


startGame();
