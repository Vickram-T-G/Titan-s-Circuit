//LOCAL IMPORTS
//    fundemental imports
import gameState from "./gameState.js";
import { domElements } from "./domElements.js";

function updateScore() {
  domElements.redScore.textContent = gameState.redScore;
  domElements.blueScore.textContent = gameState.blueScore;
}

//for styling the edge which is controlled by a player
function updateEdgeControl() {
  for (const edge of gameState.edges) {
    const node1 = gameState.nodes[edge.node1];
    const node2 = gameState.nodes[edge.node2];

    const previousControl = edge.controlled;

    if (node1.occupied && node1.occupied === node2.occupied) {
      edge.controlled = node1.occupied;
    } else {
      edge.controlled = null;
    }

    const edgeElement = document.querySelector(`.edge[data-id="${edge.id}"]`);

    edgeElement.classList.remove("red-controlled", "blue-controlled");

    if (edge.controlled) {
      edgeElement.classList.add(`${edge.controlled}-controlled`);
    }

    if (previousControl !== edge.controlled) {
      if (previousControl) {
        if (previousControl === "red") {
          gameState.redScore -= edge.weight;
        } else {
          gameState.blueScore -= edge.weight;
        }
      }

      if (edge.controlled) {
        if (edge.controlled === "red") {
          gameState.redScore += edge.weight;
        } else {
          gameState.blueScore += edge.weight;
        }
      }
    }
  }

  updateScore();
}

export { updateScore, updateEdgeControl };
