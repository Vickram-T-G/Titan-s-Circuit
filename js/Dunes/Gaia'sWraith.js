//idea: triggers an earthquake that randomizes edge weights in a circuit for 3 turns.

// only once per game.

// Chaos Factor: gambling in some edges sometimes

import gameState from "../gameState.js";
import { domElements } from "../domElements.js";

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// copying the original edge weights
function storeOriginalWeights() {
  if (!gameState.originalEdgeWeights) {
    gameState.originalEdgeWeights = [];
    gameState.edges.forEach((edge) => {
      gameState.originalEdgeWeights.push({
        id: edge.id,
        weight: edge.weight,
      });
    });
  }
}

// randomizing edge weights
function randomizeEdgeWeights() {
  if (gameState.isPaused) return;

  gameState.edges.forEach((edge) => {
    const newWeight = randomInt(1, 9);

    // Update the edge weight in the gameState
    edge.weight = newWeight;

    // Update the edge weight display in the DOM
    // const weightElement = document.querySelector(
    //   `.edge-weight[dataturnDisplay="${edge.id}"]`
    // );
    const weightElement = document.querySelector(`.edge-weight-"${edge.id}"`);
    if (weightElement) {
      weightElement.textContent = newWeight;

      // Add a visual effect to show the change
      weightElement.classList.add("weight-changed");
      setTimeout(() => {
        weightElement.classList.remove("weight-changed");
      }, 1000);
    }
  });

  domElements.gameMessage.textContent = `Earthquakeee! edge weights have been randomized. ${gameState.gaiaWrathTurnsLeft} turns remainingg!!`;
}

//restore back to original edge weight
function restoreEdgeWeights() {
  if (!gameState.originalEdgeWeights) return;

  gameState.originalEdgeWeights.forEach((originalEdge) => {
    const edge = gameState.edges.find((e) => e.id === originalEdge.id);
    if (edge) {
      edge.weight = originalEdge.weight;

      // Update the edge weight display in the DOM
      const weightElement = document.querySelector(`.edge-weight-${edge.id}"`);
      if (weightElement) {
        weightElement.textContent = originalEdge.weight;
      }
    }
  });

  //clearing the stored original wt
  gameState.originalEdgeWeights = null;

  domElements.gameMessage.textContent =
    "the earthquake has subsided...Edge weights have been restored...";
}

// Initialize Gaia's Wrath effect
function initGaiasWrath() {
  if (gameState.gaiaWrathActive) {
    domElements.gameMessage.textContent = "Gaia's Wrath is already active!!!";
    return;
  }

  if (gameState.gaiaWrathUsed) {
    domElements.gameMessage.textContent =
      "Gaia's Wrath can only be used once per game!!";
    return;
  }

  // copying original wt
  storeOriginalWeights();

  gameState.gaiaWrathActive = true;
  gameState.gaiaWrathUsed = true;
  gameState.gaiaWrathTurnsLeft = 3;

  // randomizing
  randomizeEdgeWeights();

  // Disable buttons
  if (domElements.gaiaWrathButton) {
    domElements.gaiaWrathButton.disabled = true;
    domElements.gaiaWrathButton.classList.add("disabled");
  }
}

// Progress Gaia's Wrath effect after each turn
function progressGaiasWrath() {
  if (!gameState.gaiaWrathActive) return;

  gameState.gaiaWrathTurnsLeft--;

  if (gameState.gaiaWrathTurnsLeft > 0) {
    //randomizing after each turn
    randomizeEdgeWeights();
  } else {
    //ending the WRAITH
    restoreEdgeWeights();
    gameState.gaiaWrathActive = false;
  }
}

export { initGaiasWrath, progressGaiasWrath };
