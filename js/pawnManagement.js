//LOCAL IMPORTS
//    fundemental imports
import gameState from "./gameState.js";
import { domElements } from "./domElements.js";

// others
import { updateEdgeControl } from "./scoreManagement.js";
import { updatePawn } from "./uiUpdates.js";

function checkSurroundedPawns() {
  //iterate through every nodes to if the nodes are surrounded
  for (const node of gameState.nodes) {
    if (!node.occupied) continue;

    const player = node.occupied;
    let surrounded = true;

    if (node.neighbors.length === 0) continue;

    for (const neighborId of node.neighbors) {
      const neighbor = gameState.nodes[neighborId];
      if (!neighbor.occupied || neighbor.occupied === player) {
        surrounded = false;
        break;
      }
    }

    //removing the node if surrounded
    if (surrounded) {
      const nodeElement = document.querySelector(`.node[data-id="${node.id}"]`);
      const PawnElement = nodeElement.querySelector(".Pawn");

      nodeElement.removeChild(PawnElement);

      node.occupied = null;

      updateEdgeControl();

      if (player === "red") {
        gameState.redPawnsPlaced--;
      } else {
        gameState.bluePawnsPlaced--;
      }

      updatePawn();

      domElements.gameMessage.textContent = `${player} pawn was surrounded and removed...`;
    }
  }
}

export { checkSurroundedPawns };
