const domElements = {
  // game elements
  gameBoard: null,
  gameTimer: null,
  gameMessage: null,

  pauseButton: null,
  resetButton: null,
  undoButton: null,
  redoButton: null,

  turnDisplay: null,

  //player elements
  redScore: null,
  redTimer: null,
  redPawns: null,
  redMoveHistory: null,

  blueScore: null,
  blueTimer: null,
  bluePawns: null,
  blueMoveHistory: null,

  // modal elements
  gameEndModal: null,

  modalRedScore: null,
  modalBlueScore: null,
  modalRedTime: null,
  modalBlueTime: null,
  modalGameTime: null,

  playAgainButton: null,
  winnerDisplay: null,
  closeModalButton: null,

  // dunes
  realityWarpButton: null,
  gaiaWrathButton: null,
};

// mapping dom elements to js
function initDomElements() {
  // fund game elements
  domElements.gameBoard = document.getElementById("game-board");
  domElements.gameTimer = document.querySelector("#game-timer span");
  domElements.gameMessage = document.getElementById("game-message");

  domElements.pauseButton = document.getElementById("pause-btn");
  domElements.resetButton = document.getElementById("reset-btn");
  domElements.undoButton = document.getElementById("undo-btn");
  domElements.redoButton = document.getElementById("redo-btn");

  domElements.turnDisplay = document.getElementById("turn-display");

  //player elements
  domElements.redScore = document.getElementById("red-score");
  domElements.redMoveHistory = document.getElementById("red-move-history");
  domElements.redTimer = document.getElementById("red-timer");
  domElements.redPawns = document.getElementById("red-Pawns");

  domElements.blueScore = document.getElementById("blue-score");
  domElements.blueTimer = document.getElementById("blue-timer");
  domElements.bluePawns = document.getElementById("blue-Pawns");
  domElements.blueMoveHistory = document.getElementById("blue-move-history");

  // modal elements
  domElements.gameEndModal = document.getElementById("game-end-modal");

  domElements.modalRedScore = document.getElementById("modal-red-score");
  domElements.modalRedTime = document.getElementById("modal-red-time");

  domElements.modalBlueScore = document.getElementById("modal-blue-score");
  domElements.modalBlueTime = document.getElementById("modal-blue-time");

  domElements.modalGameTime = document.getElementById("modal-game-time");

  domElements.closeModalButton = document.querySelector(".close-button");
  domElements.winnerDisplay = document.getElementById("winner-display");
  domElements.playAgainButton = document.getElementById("play-again-btn");

  // dunes
  domElements.realityWarpButton = document.getElementById("reality-warp-btn");
  domElements.gaiaWrathButton = document.getElementById("gaias-wrath-btn");
}

export { domElements, initDomElements };
