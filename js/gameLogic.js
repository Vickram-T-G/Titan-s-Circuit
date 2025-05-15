// NOT ABLE TO MOVE in outer hexagon when all 6 pawns are placed and when red goes in and when its blue turn there is no move that i can play moving around the outer hex..

// LOCAL IMPORTS
//    fundemental imports
import gameState from "./gameState.js";
import config from "./config.js";
import { domElements } from "./domElements.js";

//others
import {
  selectNode,
  deselectNode,
  placePawn,
  movePawn,
} from "./nodeInteraction.js";
import { updateGameLog } from "./uiUpdates.js";
// import { checkSurroundedPawns } from "./pawnManagement.js"; //i have no clue y tf this isnt working rn
// import { checkSurroundedPawns } from "./PawnManagement.js";
import { checkSurroundedPawns } from "./pawnManagement.js";
import { endGame } from "./gameControl.js";
import { progressGaiasWrath } from "./Dunes/Gaia'sWraith.js";

function checkGameEnd() {
  const innerCircuitNodes = gameState.nodes.filter(
    (node) => node.circuitLevel === 0
  );
  const innerCircuitFilled = innerCircuitNodes.every((node) => node.occupied);

  if (innerCircuitFilled) {
    endGame();
  }
}

function handleGameTurn(node) {
  if (gameState.selectedNode !== null) {
    const selectedNode = gameState.nodes[gameState.selectedNode];

    if (node.id === selectedNode.id) {
      deselectNode();
      return;
    }

    if (!selectedNode.neighbors.includes(node.id)) {
      domElements.gameMessage.textContent =
        "You can only move to adjacent nodes...";
      return;
    } else if (node.occupied) {
      domElements.gameMessage.textContent = "This node is already occupied...";
      return;
    } else if (!gameState.unlockedHex.includes(node.circuitLevel)) {
      domElements.gameMessage.textContent = "This circuit is still locked...";
      return;
    }

    // const outerCircuitFilled = gameState.unlockedHex.includes(1);
    if (!gameState.unlockedHex.includes(1)) {
      const currentOutermost = Math.max(...gameState.unlockedHex);
      if (node.circuitLevel !== currentOutermost) {
        domElements.gameMessage.textContent =
          "Until the outer circuit is filled, you can only move on the outermost unlocked circuit...";
        return;
      }
    }
    movePawn(selectedNode, node);

    checkSurroundedPawns();
    checkCircuitUnlock();
    checkGameEnd();

    switchPlayer();
    return;
  } else if (node.occupied === gameState.currentPlayer) {
    selectNode(node);
    domElements.gameMessage.textContent = "Select where to move your pawn...";
    return;
  } else if (!node.occupied) {
    if (!gameState.unlockedHex.includes(node.circuitLevel)) {
      domElements.gameMessage.textContent = "This circuit is still locked...";
      return;
    }

    // const outerCircuitFilled = gameState.unlockedHex.includes(1);
    if (!gameState.unlockedHex.includes(1)) {
      const currentOutermost = Math.max(...gameState.unlockedHex);
      if (node.circuitLevel !== currentOutermost) {
        domElements.gameMessage.textContent =
          "Place your pawn on the outermost unlocked circuit...";
        return;
      }
    }
    if (
      (gameState.currentPlayer === "red" &&
        gameState.redPawnsPlaced >= config.maxPawnsPerPlayer) ||
      (gameState.currentPlayer === "blue" &&
        gameState.bluePawnsPlaced >= config.maxPawnsPerPlayer)
    ) {
      domElements.gameMessage.textContent =
        "You have already placed all your pawns. Try moving one of your existing pawns instead...";
      return;
    }

    placePawn(node);
    checkCircuitUnlock();
    checkGameEnd();
    switchPlayer();
    return;
  } else {
    domElements.gameMessage.textContent =
      "This node is already occupied by your opponent...";
  }
}

function onNodeClick(node) {
  if (gameState.isPaused) return;

  if (!gameState.unlockedHex.includes(node.circuitLevel)) {
    domElements.gameMessage.textContent = "This circuit is still locked!";
    return;
  } else {
    handleGameTurn(node);
  }
}

function switchPlayer() {
  gameState.currentPlayer = gameState.currentPlayer === "red" ? "blue" : "red";
  gameState.playerTimer = config.playerTimer;

  domElements.turnDisplay.textContent = `${
    gameState.currentPlayer === "red" ? "Red" : "Blue"
  }'s Turn`;
  domElements.turnDisplay.style.color =
    gameState.currentPlayer === "red" ? "#e74c3c" : "#3498db";

  // Progress Gaia's Wrath effect if active
  if (gameState.gaiaWrathActive) {
    progressGaiasWrath();
  }

  updateGameLog();
}

function checkCircuitUnlock() {
  if (gameState.unlockedHex.includes(0)) {
    const innerCircuitNodes = gameState.nodes.filter(
      (node) => node.circuitLevel === 0
    );

    const innerCircuitFilled = innerCircuitNodes.every((node) => node.occupied);

    if (innerCircuitFilled) {
      console.log("Inner circuit is filled! Ending game...");
      endGame();
      return;
    }
  }

  if (gameState.unlockedHex.includes(1)) {
    const middleCircuitNodes = gameState.nodes.filter(
      (node) => node.circuitLevel === 1
    );

    const middleCircuitFilled = middleCircuitNodes.every(
      (node) => node.occupied
    );

    if (middleCircuitFilled && !gameState.unlockedHex.includes(0)) {
      gameState.unlockedHex.push(0);
      domElements.gameMessage.textContent = `middle circuit complete! Inner circuit unlocked! Now lets get into the FINAL ACTION...`;
      console.log(
        "Inner circuit (0) unlocked because middle circuit is filled"
      );
      // console.log("updated unlocked cirs:", gameState.unlockedHex);
      return;
    }
  }

  const currentOutermostIndex = gameState.unlockedHex.indexOf(
    Math.max(...gameState.unlockedHex)
  );
  const currentCircuit = gameState.unlockedHex[currentOutermostIndex];

  if (currentCircuit === 1 && gameState.unlockedHex.includes(0)) return;

  const circuitNodes = gameState.nodes.filter(
    (node) => node.circuitLevel === currentCircuit
  );

  const allOccupied = circuitNodes.every((node) => node.occupied);

  if (allOccupied) {
    if (currentCircuit === 0) {
      endGame();
      return;
    }

    const nextCircuit = currentCircuit - 1;

    if (!gameState.unlockedHex.includes(nextCircuit)) {
      gameState.unlockedHex.push(nextCircuit);
      // console.log(
      //   `Cir ${nextCircuit} unlocked by cir ${currentCircuit} filled`
      // );
      // console.log("updated unlocked cirs:", gameState.unlockedHex);

      if (currentCircuit === 1) {
        domElements.gameMessage.textContent = `middle circuit complete!! inner circuit unlocked! Now lets get into the FINAL ACTION...`;
      } else {
        domElements.gameMessage.textContent = `Circuit ${currentCircuit} complete! Circuit ${nextCircuit} unlocked!`;
      }
    }
  }
}

export { onNodeClick, switchPlayer, checkCircuitUnlock, checkGameEnd };
