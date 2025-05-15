//LOCAL IMPORTS
//    fundemental imports
import gameState from "./gameState.js";
import { domElements } from "./domElements.js";

//others
import { updateEdgeControl } from "./scoreManagement.js";
import { updateGameLog, updatePawn } from "./uiUpdates.js";
import { recordMove } from "./historyManager.js";

function selectNode(node) {
  gameState.selectedNode = node.id;

  const nodeElement = document.querySelector(`.node[data-id="${node.id}"]`);

  nodeElement.classList.add("selected"); // manipulating the node obj connected to the dom

  highlightValidMoves(node);
  domElements.gameMessage.textContent = `select where to move your pawn..`;
}

function deselectNode() {
  // used after moving the node or when reclicking the node AGAIn
  if (gameState.selectedNode === null) return;

  const nodeElement = document.querySelector(
    `.node[data-id="${gameState.selectedNode}"]`
  );
  nodeElement.classList.remove("selected");
  clearHighlightedNodes();
  gameState.selectedNode = null;
  updateGameLog();
}

function highlightValidMoves(node) {
  clearHighlightedNodes();

  const outerCircuitFilled = gameState.unlockedHex.includes(1);
  console.log("outerCircuitFilled", outerCircuitFilled);
  console.log("node", node);

  for (const neighborId of node.neighbors) {
    const neighbor = gameState.nodes[neighborId];

    //skip the place where pawn is occupied or circuit is locked
    if (neighbor.occupied) continue;
    if (!gameState.unlockedHex.includes(neighbor.circuitLevel)) continue;

    // if (!outerCircuitFilled) {
    //   const currentOutermost = Math.max(...gameState.unlockedHex);
    //   if (neighbor.circuitLevel !== currentOutermost) continue;
    // }

    const neighborElement = document.querySelector(
      `.node[data-id="${neighborId}"]`
    );
    neighborElement.classList.add("valid-move"); // for css style i m adding valid-move..
    gameState.highlightedNodes.push(neighborId);
  }
}

function clearHighlightedNodes() {
  for (const nodeId of gameState.highlightedNodes) {
    const nodeElement = document.querySelector(`.node[data-id="${nodeId}"]`);
    nodeElement.classList.remove("valid-move"); // for removing css style i m adding valid-move..
  }
  gameState.highlightedNodes = [];
}

function placePawn(node) {
  node.occupied = gameState.currentPlayer;

  const nodeElement = document.querySelector(`.node[data-id="${node.id}"]`);
  const pawnElement = document.createElement("div");
  pawnElement.className = `Pawn ${gameState.currentPlayer}`;

  // Add animation class for placement
  pawnElement.classList.add("placing");

  // Remove animation class after animation completes
  setTimeout(() => {
    if (pawnElement.parentNode) {
      pawnElement.classList.remove("placing");
    }
  }, 600);
  console.log("nodeEle", nodeElement);
  nodeElement.appendChild(pawnElement);

  if (gameState.currentPlayer === "red") gameState.redPawnsPlaced++;
  else gameState.bluePawnsPlaced++;

  updatePawn();
  updateEdgeControl();

  // Record the move in history
  recordMove("place", {
    nodeId: node.id,
    position: { x: node.x, y: node.y },
    circuitLevel: node.circuitLevel,
  });
}

function movePawn(fromNode, toNode) {
  toNode.occupied = fromNode.occupied;
  fromNode.occupied = null;

  const fromNodeElement = document.querySelector(
    `.node[data-id="${fromNode.id}"]`
  );
  const toNodeElement = document.querySelector(`.node[data-id="${toNode.id}"]`);

  const pawnElement = fromNodeElement.querySelector(".Pawn");

  // Add moving class for animation
  pawnElement.classList.add("moving");

  // Calculate movement for animation
  const fromRect = fromNodeElement.getBoundingClientRect();
  const toRect = toNodeElement.getBoundingClientRect();
  const deltaX = toRect.left - fromRect.left;
  const deltaY = toRect.top - fromRect.top;

  // Apply animation - accounting for the default transform
  pawnElement.style.transition = "transform 0.5s ease";
  pawnElement.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;

  // Wait for animation to complete before actually moving the DOM element
  setTimeout(() => {
    // Remove the animation class
    pawnElement.classList.remove("moving");

    // Reset transform for future animations
    pawnElement.style.transition = "";
    pawnElement.style.transform = "";

    // Move the pawn element to new parent
    fromNodeElement.removeChild(pawnElement);
    toNodeElement.appendChild(pawnElement);
  }, 500);

  deselectNode();
  updateEdgeControl();

  // Record the move in history
  recordMove("move", {
    fromNodeId: fromNode.id,
    toNodeId: toNode.id,
    from: { x: fromNode.x, y: fromNode.y },
    to: { x: toNode.x, y: toNode.y },
    player: toNode.occupied,
  });
}

export {
  selectNode,
  deselectNode,
  highlightValidMoves,
  clearHighlightedNodes,
  placePawn,
  movePawn,
};
