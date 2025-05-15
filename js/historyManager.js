import gameState from "./gameState.js";
import { domElements } from "./domElements.js";
import { updateScore } from "./scoreManagement.js";
import { updatePawn, updateGameLog } from "./uiUpdates.js";

// Updates the history displayed
function updateMoveHistoryDisplay() {
  if (!domElements.redMoveHistory || !domElements.blueMoveHistory) {
    console.error("Move history DOM elements not found!");
    return;
  }

  try {
    // Clear existing history
    domElements.redMoveHistory.innerHTML = "";
    domElements.blueMoveHistory.innerHTML = "";

    // Add header
    const redHeader = document.createElement("h3");
    redHeader.textContent = "Red Player Moves";
    domElements.redMoveHistory.appendChild(redHeader);

    const blueHeader = document.createElement("h3");
    blueHeader.textContent = "Blue Player Moves";
    domElements.blueMoveHistory.appendChild(blueHeader);

    // Add moves to the display
    gameState.redMoveHistory.forEach((move, index) => {
      const moveElement = document.createElement("div");
      moveElement.className = "move-item";
      moveElement.textContent = `${index + 1}. ${move}`;
      domElements.redMoveHistory.appendChild(moveElement);
    });

    gameState.blueMoveHistory.forEach((move, index) => {
      const moveElement = document.createElement("div");
      moveElement.className = "move-item";
      moveElement.textContent = `${index + 1}. ${move}`;
      domElements.blueMoveHistory.appendChild(moveElement);
    });
  } catch (error) {
    console.error("Error updating move history display:", error);
  }
}

// for buttons toggling
function updateUndoRedoButtons() {
  if (domElements.undoButton && domElements.redoButton) {
    domElements.undoButton.disabled = !canUndo();
    domElements.redoButton.disabled = !canRedo();
  }
}

//for history desc
function createMoveDescription(moveType, data) {
  if (moveType === "place") {
    return `placed pawn at position (${data.position.x.toFixed(
      0
    )}, ${data.position.y.toFixed(0)})`;
  } else if (moveType === "move") {
    return `moved from (${data.from.x.toFixed(0)}, ${data.from.y.toFixed(
      0
    )}) to (${data.to.x.toFixed(0)}, ${data.to.y.toFixed(0)})`;
  }
  return "unknown move";
}

//records every move played DYnamic
function recordMove(moveType, data) {
  if (gameState.currentMoveIndex < gameState.moveHistory.length - 1) {
    gameState.moveHistory = gameState.moveHistory.slice(
      0,
      gameState.currentMoveIndex + 1
    );

    const redMoveCount = gameState.redMoveHistory.length;
    const blueMoveCount = gameState.blueMoveHistory.length;
    const totalExpectedMoves = gameState.currentMoveIndex + 1; //total moves played

    if (redMoveCount + blueMoveCount > totalExpectedMoves) {
      const redKeepCount =
        Math.floor(totalExpectedMoves / 2) + (totalExpectedMoves % 2); // + total moves % 2 is becuause red starts the game
      const blueKeepCount = Math.floor(totalExpectedMoves / 2);

      gameState.redMoveHistory = gameState.redMoveHistory.slice(
        0,
        redKeepCount
      );
      gameState.blueMoveHistory = gameState.blueMoveHistory.slice(
        0,
        blueKeepCount
      );
    }
  }

  //each move has a obj connected to it
  const move = {
    type: moveType,
    data: data,
    player: gameState.currentPlayer,
    timestamp: Date.now(),

    stateSnapshot: {
      nodes: JSON.parse(JSON.stringify(gameState.nodes)), //DEEP CLONING using paersing and stringfy
      edges: JSON.parse(JSON.stringify(gameState.edges)),
      redScore: gameState.redScore,
      blueScore: gameState.blueScore,
      redPawnsPlaced: gameState.redPawnsPlaced,
      bluePawnsPlaced: gameState.bluePawnsPlaced,
      unlockedHex: [...gameState.unlockedHex],
      currentPlayer: gameState.currentPlayer,
    },
  };

  //counting each move and updating history DYNAMICly*
  gameState.moveHistory.push(move);
  gameState.currentMoveIndex++;

  const moveDescription = createMoveDescription(moveType, data);
  if (gameState.currentPlayer === "red") {
    gameState.redMoveHistory.push(moveDescription);
  } else {
    gameState.blueMoveHistory.push(moveDescription);
  }

  updateMoveHistoryDisplay();

  updateUndoRedoButtons();
}

//writes the move desc
function updatePlayerMoveHistories() {
  gameState.redMoveHistory = [];
  gameState.blueMoveHistory = [];

  for (let i = 0; i <= gameState.currentMoveIndex; i++) {
    if (i >= gameState.moveHistory.length) {
      console.error(
        "Error: Trying to access move history beyond array bounds:",
        i,
        gameState.moveHistory.length
      );
      break;
    }

    const move = gameState.moveHistory[i];
    const moveDescription = createMoveDescription(move.type, move.data);

    if (move.player === "red") {
      gameState.redMoveHistory.push(moveDescription);
    } else {
      gameState.blueMoveHistory.push(moveDescription);
    }
  }
}

function undoMove() {
  if (!canUndo()) return false;

  const previousIndex = gameState.currentMoveIndex - 1;
  const previousState =
    previousIndex >= 0
      ? gameState.moveHistory[previousIndex].stateSnapshot
      : {
          nodes: [],
          edges: [],
          unlockedHex: [2],
          currentPlayer: "red",

          redScore: 0,
          blueScore: 0,
          redPawnsPlaced: 0,
          bluePawnsPlaced: 0,
        };

  // recounting history etc after undo

  restoreGameState(previousState);

  gameState.currentMoveIndex = previousIndex;

  updatePlayerMoveHistories();

  updateUI();

  updateMoveHistoryDisplay();

  updateUndoRedoButtons();

  return true;
}

function redoMove() {
  if (!canRedo()) return false;

  const nextIndex = gameState.currentMoveIndex + 1;
  const nextState = gameState.moveHistory[nextIndex].stateSnapshot;

  // recounting history etc after redo

  restoreGameState(nextState);

  gameState.currentMoveIndex = nextIndex;

  updatePlayerMoveHistories();

  updateUI();

  updateMoveHistoryDisplay();

  updateUndoRedoButtons();

  return true;
}

function canUndo() {
  return gameState.currentMoveIndex >= 0 && !gameState.isPaused;
}

function canRedo() {
  return (
    gameState.currentMoveIndex < gameState.moveHistory.length - 1 &&
    !gameState.isPaused
  );
}

//copies the history for undoing and redoing in future
function restoreGameState(stateSnapshot) {
  gameState.nodes = JSON.parse(JSON.stringify(stateSnapshot.nodes));
  gameState.edges = JSON.parse(JSON.stringify(stateSnapshot.edges));

  gameState.unlockedHex = [...stateSnapshot.unlockedHex];
  gameState.currentPlayer = stateSnapshot.currentPlayer;

  gameState.selectedNode = null;
  gameState.highlightedNodes = [];

  gameState.redScore = stateSnapshot.redScore;
  gameState.blueScore = stateSnapshot.blueScore;
  gameState.redPawnsPlaced = stateSnapshot.redPawnsPlaced;
  gameState.bluePawnsPlaced = stateSnapshot.bluePawnsPlaced;
}

//for updating the history desc UI
function updateUI() {
  domElements.gameBoard.innerHTML = "";
  // If there are no nodes (initial state), rebuild the board
  if (gameState.nodes.length === 0) {
    //LAZY LOADING BOARD imports
    // Import required functions to rebuild the board
    //this is done for avoiding null errors(due to circular dependency btw funcs) and also for efficiency purpose
    import("./boardSetup.js").then((module) => {
      module.createHexBoard();
      module.makeEdges();
      updateScore();
      updatePawn();
      updateGameLog();
      updateMoveHistoryDisplay();
    });
    return;
  }
  // ELSe redraw nodes and pawns
  gameState.nodes.forEach((node) => {
    // Create node element
    const nodeElement = document.createElement("div");
    nodeElement.className = "node";
    nodeElement.dataset.id = node.id;
    nodeElement.style.left = `${node.x}px`;
    nodeElement.style.top = `${node.y}px`;

    // Adding event listener (we'll need to re-implement this from boardSetup.js)
    nodeElement.addEventListener("click", () => {
      //LAZY LOADING BOARD imports
      //Importing dynamically to avoid circular dependencies and for eff
      import("./gameLogic.js").then((module) => {
        module.onNodeClick(node);
      });
    });

    domElements.gameBoard.appendChild(nodeElement);

    // Add pawn if the node is occupied
    if (node.occupied) {
      const pawnElement = document.createElement("div");
      pawnElement.className = `Pawn ${node.occupied}`;
      nodeElement.appendChild(pawnElement);
    }
  });

  // Redrawing edges after undo/redo
  gameState.edges.forEach((edge) => {
    const node1 = gameState.nodes[edge.node1];
    const node2 = gameState.nodes[edge.node2];

    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const length = Math.sqrt(dx ** 2 + dy ** 2);
    const theta = Math.atan2(dy, dx);

    const edgeElement = document.createElement("div");
    edgeElement.className = "edge";
    if (edge.controlled) {
      edgeElement.classList.add(`${edge.controlled}-controlled`);
    }
    edgeElement.dataset.id = edge.id;
    edgeElement.style.left = `${node1.x}px`;
    edgeElement.style.top = `${node1.y}px`;
    edgeElement.style.width = `${length}px`;
    edgeElement.style.transform = `rotate(${theta}rad)`;

    const weightElement = document.createElement("div");
    weightElement.className = "edge-weight";
    weightElement.textContent = edge.weight;
    weightElement.style.left = `${node1.x + dx / 2}px`;
    weightElement.style.top = `${node1.y + dy / 2}px`;

    domElements.gameBoard.appendChild(edgeElement);
    domElements.gameBoard.appendChild(weightElement);
  });

  // Update scores and pawn counts after undo/redo
  updateScore();
  updatePawn();

  // Update gamelogs
  updateGameLog();

  // Update history UI
  updateMoveHistoryDisplay();
}

//completly resets the history
function resetHistory() {
  gameState.moveHistory = [];
  gameState.currentMoveIndex = -1;
  gameState.redMoveHistory = [];
  gameState.blueMoveHistory = [];

  // Update the UI
  updateMoveHistoryDisplay();
  updateUndoRedoButtons();
}

export {
  recordMove,
  undoMove,
  redoMove,
  canUndo,
  canRedo,
  updateMoveHistoryDisplay,
  updateUndoRedoButtons,
  resetHistory,
  updateUI,
};
