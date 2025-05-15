//LOCAL IMPORTS
//    fundemental imports
import gameState from "./gameState.js";
import { domElements } from "./domElements.js";
import config from "./config.js";

//others
import { endGame } from "./gameControl.js";
// import { switchPlayer } from "./gameLogic.js";
import { deselectNode } from "./nodeInteraction.js";

//Dunes

function updatePlayerTimer() {
  if (gameState.isPaused) return;

  gameState.playerTimer--;

  if (gameState.playerTimer <= 0) {
    if (gameState.selectedNode !== null) {
      deselectNode();
    }

    // domElements.gameMessage.textContent = `time's up!!! switching to the other player...`;
    domElements.gameMessage.textContent = `time's up!!! endinging the game...`;

    // TO HAVE FUNCTIONALITY OF SWITCHING WE CAN SIMPLY CALL switchPLayer() which is MORE FUNN
    switchPlayer();

    // TO HAVE FUNCTIONALITY OF ending the game WE CAN SIMPLY CALL endgame()
    // endGame()
    return;
  }

  const minutes = Math.floor(gameState.playerTimer / 60);
  const seconds = gameState.playerTimer % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  if (gameState.currentPlayer === "red") {
    domElements.redTimer.textContent = timeString;
    domElements.blueTimer.textContent = "00:00";
  } else {
    domElements.blueTimer.textContent = timeString;
    domElements.redTimer.textContent = "00:00";
  }
}

//clock for the entire game
function updateGameTimer() {
  if (gameState.isPaused) return;
  // setTimeout(realityWarp, config.realityWarpTime * 1000);
  gameState.gameTimer--;

  if (gameState.gameTimer <= 0) {
    endGame();
    return;
  }

  const minutes = Math.floor(gameState.gameTimer / 60);
  const seconds = gameState.gameTimer % 60;
  domElements.gameTimer.textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateGameLog() {
  const outerCircuitFilled = gameState.unlockedHex.includes(1);
  const canPlaceNewPawn =
    (gameState.currentPlayer === "red" &&
      gameState.redPawnsPlaced < config.maxPawnsPerPlayer) ||
    (gameState.currentPlayer === "blue" &&
      gameState.bluePawnsPlaced < config.maxPawnsPerPlayer);

  const currentPlayer = gameState.currentPlayer === "red" ? "Red" : "Blue";

  if (canPlaceNewPawn) {
    if (outerCircuitFilled)
      domElements.gameMessage.textContent = `${currentPlayer} player: Place a new pawn on any unlocked circuit or move an existing one.`;
    else
      domElements.gameMessage.textContent = `${currentPlayer} player: Place a new pawn or move an existing one on the outermost unlocked circuit.`;
  } else {
    if (outerCircuitFilled)
      domElements.gameMessage.textContent = `${currentPlayer} player: Move one of your pawns on any unlocked circuit.`;
    else
      domElements.gameMessage.textContent = `${currentPlayer} player: Move one of your pawns on the outermost unlocked circuit.`;
  }
}

function updateScore() {
  domElements.redScore.textContent = gameState.redScore;
  domElements.blueScore.textContent = gameState.blueScore;
}

function updatePawn() {
  domElements.redPawns.textContent = gameState.redPawnsPlaced;
  domElements.bluePawns.textContent = gameState.bluePawnsPlaced;
}

function updateTurnDisplay() {
  domElements.turnDisplay.textContent = `${
    gameState.currentPlayer === "red" ? "Red" : "Blue"
  }'s Turn`;
  domElements.turnDisplay.style.color =
    gameState.currentPlayer === "red" ? "#e74c3c" : "#3498db";
}

export {
  updateGameLog,
  updateScore,
  updatePawn,
  updateTurnDisplay,
  updateGameTimer,
  updatePlayerTimer,
};
