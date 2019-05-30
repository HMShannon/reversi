
const board = document.querySelector('#board');
const squares = Array.from(document.querySelectorAll('.square'));
const humanPlayerScore = document.querySelector('#player-1-score');
const computerPlayerScore = document.querySelector('#player-2-score');
const newGame = document.querySelector('#game-button');
const noMoves = document.querySelector('#no-moves');
const gameResults = document.querySelector('.game-results');
const gameResultsText = gameResults.querySelector('#game-results-text');
const restartButton = gameResults.querySelector('#restart');

let emptySquares = 60;

const humanPlayer = {
  color: 'white',
  score: 2,
  validMoves: [],
  isPlayerTurn: false
};

const computerPlayer = {
  color: 'black',
  score: 2,
  validMoves: [],
  isPlayerTurn: false
};

let gameOver = false;

let currentBoard = [];

function startNewGame() {
  noMoves.style.display = 'none';
  gameResults.classList.remove('game-results-active');
  gameOver = false;
  emptySquares = 60;

  newBoard = [];
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      newBoard.push({id: `${i}, ${j}`, ownedBy: '', valid: false});
    }
  }
  currentBoard = newBoard;
  for (let k = 0; k < squares.length; k++) {
    squares[k].innerHTML = '';
  }
  currentBoard.find((node) => node.id == '4, 4').ownedBy = humanPlayer.color;
  currentBoard.find((node) => node.id == '5, 4').ownedBy = computerPlayer.color;
  currentBoard.find((node) => node.id == '4, 5').ownedBy = computerPlayer.color;
  currentBoard.find((node) => node.id == '5, 5').ownedBy = humanPlayer.color;
  squares.find((square) => square.id == '4, 4').innerHTML = `<div class="tile"><div class="tile-white"></div><div class="tile-black back"></div></div>`;
  squares.find((square) => square.id == '5, 4').innerHTML = `<div class="tile"><div class="tile-black"></div><div class="tile-white back"></div></div>`;
  squares.find((square) => square.id == '4, 5').innerHTML = `<div class="tile"><div class="tile-black"></div><div class="tile-white back"></div></div>`;
  squares.find((square) => square.id == '5, 5').innerHTML = `<div class="tile"><div class="tile-white"></div><div class="tile-black back"></div></div>`;

  humanPlayer.score = 2;
  humanPlayer.validMoves = [];
  humanPlayer.isPlayerTurn = false;

  computerPlayer.score = 2;
  computerPlayer.validMoves = [];
  computerPlayer.isPlayerTurn = false;

  updateScore();
  if (Math.random() >= 0.5) {
    humanPlayer.isPlayerTurn = true;
    checkValid(humanPlayer, computerPlayer, currentBoard);
  } else {
    computerPlayer.isPlayerTurn = true;
    setTimeout(() => {
      calculateMove();
    }, 500);
  }
}
startNewGame();


function checkValid(player, otherPlayer, board) {
  if (board == currentBoard) {
    if (player === humanPlayer) {
      setTimeout(() => {
        noMoves.style.display = 'none';
      }, 900);
    } else {
      noMoves.style.display = 'none';
    }
  }
  if (emptySquares === 0) {
    gameOver = true;
    endGame();
    return;
  }
  let valid = [];
  for (let i = 0; i < board.length; i++) {
    board[i].valid = false;
    squares.find((square) => square.id == board[i].id).classList.remove('valid');
    if (board[i].ownedBy == '') {
      let lines = getLines(board[i].id);
      for (let j = 0; j < lines.length; j++) {
        if (lines[j][0] && lines[j][0].ownedBy == otherPlayer.color) {
          if (lines[j].find((node) => node.ownedBy == player.color)) {
            board[i].valid = true;
            valid.push(board[i]);
            if (player == humanPlayer && board == currentBoard) {
              squares.find((square) => square.id == board[i].id).classList.add('valid');
            }
          }
        }
      }
    }
  }
  player.validMoves = valid;
  if (humanPlayer.validMoves.length === 0 && computerPlayer.validMoves.length === 0 && board == currentBoard) {
    gameOver = true;
    endGame();
    return;
  }
  if (player.validMoves.length > 0 && board == currentBoard) {
    return;
  }
  if (player == humanPlayer && humanPlayer.validMoves.length === 0 && board == currentBoard) {
    noMoves.firstElementChild.textContent = 'Player has no moves';
    noMoves.style.display = 'flex';
  } else if (player == computerPlayer && computerPlayer.validMoves.length === 0 && board == currentBoard) {
    noMoves.firstElementChild.textContent = 'Computer has no moves';
    noMoves.style.display = 'flex';
  }
  if (player == humanPlayer && humanPlayer.isPlayerTurn) {
    setTimeout(() => {
      calculateMove();
    }, 800);
  }
}


function getTopLeft(x, y, board) {
  let startX = x-1;
  let startY = y-1;
  let nodes = [];

  while (startX > 0 && startY > 0) {
    let currentNode = board.find((node) => node.id == `${startX}, ${startY}`);
    if (currentNode.ownedBy == '') {
      break;
    }
    nodes.push(board.find((node) => node.id == `${startX}, ${startY}`));
    startX--;
    startY--;
  }
  return nodes;
}
function getTop(x, y, board) {
  let startY = y-1;
  let nodes = [];

  while (startY > 0) {
    let currentNode = board.find((node) => node.id == `${x}, ${startY}`)
    if (currentNode.ownedBy == '') {
      break;
    }
    nodes.push(board.find((node) => node.id == `${x}, ${startY}`));
    startY--;
  }
  return nodes;
}
function getTopRight(x, y, board) {
  let startX = x+1
  let startY = y-1;
  let nodes = [];

  while (startX <= 8 && startY > 0) {
    let currentNode = board.find((node) => node.id == `${startX}, ${startY}`);
    if (currentNode.ownedBy == '') {
      break;
    }
    nodes.push(board.find((node) => node.id == `${startX}, ${startY}`));
    startX++;
    startY--;
  }
  return nodes;
}
function getRight(x, y, board) {
  let startX = x+1;
  let nodes = [];

  while (startX <= 8) {
    let currentNode = board.find((node) => node.id == `${startX}, ${y}`);
    if (currentNode.ownedBy == '') {
      break;
    }
    nodes.push(board.find((node) => node.id == `${startX}, ${y}`));
    startX++;
  }
  return nodes;
}
function getBottomRight(x, y, board) {
  let startX = x+1;
  let startY = y+1
  let nodes = [];

  while (startX <= 8 && startY <= 8 && board.find((node) => node.id == `${startX}, ${startY}`).ownedBy !== '') {
    let currentNode = board.find((node) => node.id == `${startX}, ${startY}`);
    nodes.push(board.find((node) => node.id == `${startX}, ${startY}`));
    startX++;
    startY++;
  }
  return nodes;
}
function getBottom(x, y, board) {
  let startY = y+1;
  let nodes = [];

  while (startY <= 8) {
    let currentNode = board.find((node) => node.id == `${x}, ${startY}`);
    if (currentNode.ownedBy == '') {
      break;
    }
    nodes.push(board.find((node) => node.id == `${x}, ${startY}`));
    startY++;
  }
  return nodes;
}
function getBottomLeft(x, y, board) {
  let startX = x-1;
  let startY = y+1;
  let nodes = [];

  while (startX > 0 && startY <= 8) {
    let currentNode = board.find((node) => node.id == `${startX}, ${startY}`);
    if (currentNode.ownedBy == '') {
      break;
    }
    nodes.push(board.find((node) => node.id == `${startX}, ${startY}`));
    startX--;
    startY++;
  }
  return nodes;
}
function getLeft(x, y, board) {
  let startX = x-1;
  let nodes = [];

  while (startX > 0) {
    let currentNode = board.find((node) => node.id == `${startX}, ${y}`);
    if (currentNode.ownedBy == '') {
      break;
    }
    nodes.push(board.find((node) => node.id == `${startX}, ${y}`));
    startX--;
  }
  return nodes;
}

function getLines(id, board = currentBoard) {
  let xCoord = parseInt(id.split(',')[0]);
  let yCoord = parseInt(id.split(',')[1]);

  let topLeft = getTopLeft(xCoord, yCoord, board);
  let top = getTop(xCoord, yCoord, board);
  let topRight = getTopRight(xCoord, yCoord, board);
  let right = getRight(xCoord, yCoord, board);
  let bottomRight = getBottomRight(xCoord, yCoord, board);
  let bottom = getBottom(xCoord, yCoord, board);
  let bottomLeft = getBottomLeft(xCoord, yCoord, board);
  let left = getLeft(xCoord, yCoord, board);

  return [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left];
}


function copyBoard() {
  let copy = [];
  for (let i = 0; i < currentBoard.length; i++) {
    copy.push(JSON.parse(JSON.stringify(currentBoard[i])));
  }
  return copy;
}


function getResultsOfMove(lines, player, otherPlayer) {

  let score = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i][0] && lines[i].find((node) => node.ownedBy == player.color)) {
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j].ownedBy == otherPlayer.color) {
          score++;
        }
      }
    }
  }
  return score;
}


function calculateMove() {
  if (emptySquares === 0) {
    gameOver = true;
    endGame();
    return;
  }
  humanPlayer.isPlayerTurn = false;
  computerPlayer.isPlayerTurn = true;
  checkValid(computerPlayer, humanPlayer, currentBoard);
  if (computerPlayer.validMoves.length > 0) {
    if (computerPlayer.validMoves.length === 1) {
      placePiece(computerPlayer.validMoves[0].id, computerPlayer, humanPlayer, getLines(computerPlayer.validMoves[0].id));
    } else { // ---- computer has more than one possible move ----
      let possibleScores = [];
      for (let i = 0; i < computerPlayer.validMoves.length; i++) { // loop over computer's possible moves
        let currentValid = computerPlayer.validMoves[i];
        let testBoard = copyBoard();
        testBoard.find((node) => node.id == currentValid.id).ownedBy = computerPlayer.color;
        let validLines = getLines(currentValid.id, testBoard);
        let computerScore = getResultsOfMove(validLines, computerPlayer, humanPlayer);

        let highestPlayerScore = 0;
        checkValid(humanPlayer, computerPlayer, testBoard); // get human player's possible moves given each computer move
        if (humanPlayer.validMoves.length > 0) {
          for (let l = 0; l < humanPlayer.validMoves.length; l++) {
            let currentPlayerLines = getLines(humanPlayer.validMoves[l].id, testBoard);
            let currentPlayerScore = getResultsOfMove(currentPlayerLines, humanPlayer, computerPlayer);
            if (currentPlayerScore > highestPlayerScore) {
              highestPlayerScore = currentPlayerScore; // identify the best possible move for the human player on their next turn given each computer move
            }
          }
      }
        possibleScores.push({id: currentValid, score: (computerScore - highestPlayerScore)}); // calculate overall strength of each computer move
      }
    let highestPiece = possibleScores[0];
    for (let scoreI = 0; scoreI < possibleScores.length; scoreI++) {
      if (possibleScores[scoreI].score > highestPiece.score) {
        highestPiece = possibleScores[scoreI]; // identify the highest scoring move for the computer player
      }
    }
    let bestMoves = [];
    for (let o = 0; o < possibleScores.length; o++) {
      if (possibleScores[o].score == highestPiece.score) {
        bestMoves.push(possibleScores[o]); // in the event of several equally strong moves, add them all to bestMoves
      }
    }
    let chosenPiece = bestMoves[Math.floor(Math.random()*bestMoves.length)]; // select random move from bestMoves
    placePiece(chosenPiece.id.id, computerPlayer, humanPlayer, getLines(chosenPiece.id.id));
  }
  }
  humanPlayer.isPlayerTurn = true;
  computerPlayer.isPlayerTurn = false;
  checkValid(humanPlayer, computerPlayer, currentBoard);
}


function flipPiece(id, player, otherPlayer, board) {
  let nodeToFlip = board.find((node) => node.id == id);
  let square = squares.find((square) => square.id == id);
  nodeToFlip.ownedBy = player.color;
  if (board == currentBoard) {
    square.firstElementChild.classList.toggle('flip');
  }
}


function placePiece(id, player, otherPlayer, lines) {
  player.isPlayerTurn = false;
  otherPlayer.isPlayerTurn = true;
  let boardTarget = currentBoard.find((obj) => obj.id == id);
  let newTile = `
    <div class="tile">
      <div class="tile-${player.color}"></div>
      <div class="tile-${otherPlayer.color} back"></div>
    </div>
  `;

  let targetSquare = squares.find((obj) => obj.id == id);
  targetSquare.innerHTML = newTile;
  targetSquare.classList.remove('valid');

  boardTarget.ownedBy = player.color;
  player.score++;
  boardTarget.valid = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].find((node) => node.ownedBy == player.color)) {
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j].ownedBy == otherPlayer.color) {
          flipPiece(lines[i][j].id, player, otherPlayer, currentBoard);
          player.score++;
          otherPlayer.score--;
        } else if (lines[i][j].ownedBy == player.color) {
          break;
        }
      }
    }
  }
  emptySquares -= 1;
  updateScore();
}


function updateScore() {
  humanPlayerScore.textContent = humanPlayer.score;
  computerPlayerScore.textContent = computerPlayer.score;
}


function endGame() {
  gameResults.classList.add('game-results-active');
  if (humanPlayer.score > computerPlayer.score) {
    gameResultsText.textContent = 'You Win!';
  } else if (computerPlayer.score > humanPlayer.score) {
    gameResultsText.textContent = 'Computer Wins!';
  } else {
    gameResultsText.textContent = 'Draw!';
  }
}


board.addEventListener('click', (e) => {
  if (e.target.classList.contains('square') && currentBoard.find((node) => node.id == e.target.id).ownedBy == '' && currentBoard.find((node) => node.id == e.target.id).valid) {
    if (humanPlayer.isPlayerTurn) {
      placePiece(e.target.id, humanPlayer, computerPlayer, getLines(e.target.id));
      setTimeout(() => {
        calculateMove();
      }, 500);
    }
  }
});


newGame.addEventListener('click', startNewGame);

restartButton.addEventListener('click', startNewGame);
