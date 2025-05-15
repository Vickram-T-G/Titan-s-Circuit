//GAME NOT ENDING IF INNER HEX IS COMPLETE

//LOCAL IMPORTS
//     fundemental imports
import gameState from "./gameState.js";
import config from "./config.js";
import { domElements } from "./domElements.js";

//others
import { createHexBoard, makeEdges } from "./boardSetup.js";
import { updateScore } from "./scoreManagement.js";
import {
  updatePawn,
  updateGameLog,
  updateGameTimer,
  updatePlayerTimer,
} from "./uiUpdates.js";
import { initModal, showEndGameModal, cleanupModalListeners } from "./modal.js";
import {
  undoMove,
  redoMove,
  resetHistory,
  updateUndoRedoButtons,
} from "./historyManager.js";

// dunes
import { initRealityWarp, stopRealityWarp } from "./Dunes/realityWarp.js";
import { initGaiasWrath } from "./Dunes/Gaia'sWraith.js";

//function to initialize the game when ever we want to refresh everything
function initGame() {
  createHexBoard();
  makeEdges();

  updateScore();
  updatePawn();
  updateGameLog();

  gameState.gameTimerInterval = setInterval(updateGameTimer, 1000);
  gameState.playerTimerInterval = setInterval(updatePlayerTimer, 1000);

  // reality warp
  if (config.enableRealityWarp) {
    initRealityWarp(config.realityWarpInterval || 10000);
    if (domElements.realityWarpButton) {
      domElements.realityWarpButton.textContent = "Reality Warping is ON";
    }
  }

  domElements.pauseButton.addEventListener("click", togglePause);
  domElements.resetButton.addEventListener("click", resetGame);

  //TOGGLING BUTTONs
  if (domElements.undoButton) {
    domElements.undoButton.addEventListener("click", handleUndo);
    domElements.undoButton.disabled = true;
  }

  if (domElements.redoButton) {
    domElements.redoButton.addEventListener("click", handleRedo);
    domElements.redoButton.disabled = true;
  }

  if (domElements.realityWarpButton) {
    domElements.realityWarpButton.addEventListener("click", toggleRealityWarp);
  }

  if (domElements.gaiaWrathButton) {
    domElements.gaiaWrathButton.addEventListener("click", triggerGaiasWrath);
  }

  initModal();
  resetHistory();
}

function resetGame() {
  // console.log("Resetting game...");

  clearInterval(gameState.gameTimerInterval);
  clearInterval(gameState.playerTimerInterval);

  stopRealityWarp();

  cleanupModalListeners();

  // resettign configs and gamestates and history
  domElements.gameBoard.innerHTML = "";

  gameState.currentPlayer = "red";
  gameState.gameTimer = config.totalGameTime;
  gameState.playerTimer = config.playerTimer;

  gameState.isPaused = false;
  gameState.highlightedNodes = [];

  gameState.redScore = 0;
  gameState.blueScore = 0;
  gameState.redPawnsPlaced = 0;
  gameState.bluePawnsPlaced = 0;

  gameState.selectedNode = null;
  gameState.unlockedHex = [2];
  gameState.nodes = [];
  gameState.edges = [];

  resetHistory();

  domElements.turnDisplay.textContent = `Red's Turn`;
  domElements.turnDisplay.style.color = "#e74c3c";

  //after resetting we r making the board again fresh
  initGame();

  domElements.pauseButton.textContent = "Pause";
  domElements.pauseButton.disabled = false;

  domElements.gameMessage.textContent =
    "Game Resetted...Red player starts 1st again :)";
}

function togglePause() {
  gameState.isPaused = !gameState.isPaused;

  if (gameState.isPaused) {
    domElements.pauseButton.textContent = "Resume";
    domElements.gameMessage.textContent = "Game Paused";

    // disabling undo and redo in case of a pause
    if (domElements.undoButton) domElements.undoButton.disabled = true;
    if (domElements.redoButton) domElements.redoButton.disabled = true;
  } else {
    domElements.pauseButton.textContent = "Pause";
    updateGameLog();

    updateUndoRedoButtons();
  }
}

function handleUndo() {
  if (undoMove()) {
    domElements.gameMessage.textContent = `undid last move. ${
      gameState.currentPlayer === "red" ? "Red" : "Blue"
    }'s turn`;
  } else {
    domElements.gameMessage.textContent =
      "cannot undo any further...game is at initial position..";
  }
}

function handleRedo() {
  if (redoMove()) {
    domElements.gameMessage.textContent = `redid move...${
      gameState.currentPlayer === "red" ? "Red" : "Blue"
    }'s turn`;
  } else {
    domElements.gameMessage.textContent = `no more moves to redo..`;
  }
}

function endGame() {
  clearInterval(gameState.gameTimerInterval);
  clearInterval(gameState.playerTimerInterval);

  // gameState.isPaused = true;
  // domElements.pauseButton.disabled = true;

  // disable undo/redo
  // if (domElements.undoButton) domElements.undoButton.disabled = true;
  // if (domElements.redoButton) domElements.redoButton.disabled = true;

  let winner;
  if (gameState.redScore > gameState.blueScore) {
    winner = "Red";
  } else if (gameState.blueScore > gameState.redScore) {
    winner = "Blue";
  } else {
    winner = "it's a tie :)";
  }

  // Update the standard game message
  domElements.gameMessage.textContent = `Game Over! ${
    winner === "it's a tie ;)" ? "it's a tie ;)" : winner + " wins!"
  }`;

  // Show modal with game results
  showEndGameModal(winner);
}

function toggleRealityWarp() {
  config.enableRealityWarp = !config.enableRealityWarp;

  if (config.enableRealityWarp) {
    // Turn on reality warp
    initRealityWarp(config.realityWarpInterval || 10000);
    domElements.realityWarpButton.textContent = "reality warp: ON!!";
    domElements.gameMessage.textContent =
      "reality warp activated!!! board tilts now randomly..";
  } else {
    // Turn off reality warp
    stopRealityWarp();
    domElements.realityWarpButton.textContent = "reality warp: OFF :(";
    domElements.gameMessage.textContent =
      "reality warp deactivated :( The board is stable now :(";
  }
}

function triggerGaiasWrath() {
  if (gameState.isPaused) {
    domElements.gameMessage.textContent =
      "Cannot use Gaia's Wrath while the game is paused!";
    return;
  }

  if (gameState.gaiaWrathUsed) {
    domElements.gameMessage.textContent =
      "Gaia's Wrath can only be used once per game!";
    return;
  }

  initGaiasWrath();
}

export {
  initGame,
  togglePause,
  resetGame,
  endGame,
  toggleRealityWarp,
  triggerGaiasWrath,
};
