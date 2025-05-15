import gameState from "../gameState.js";
import { domElements } from "../domElements.js";
import config from "../config.js";

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//takes back to initial form
function resetBoardTilt() {
  if (domElements.gameBoard) {
    domElements.gameBoard.style.transform = "none";
    config.tilt = {
      rotation: 0,
      shearX: 0,
      shearY: 0,
      scale: 1,
    };
  }
}

//shears the board
function applyRandomTilt() {
  if (gameState.isPaused) return;

  const newTilt = {
    rotation: randomInt(-3, 3),
    shearX: randomInt(-1, 1),
    shearY: randomInt(-1, 1),
    scale: randomInt(98, 104) / 100,
  };

  if (domElements.gameBoard) {
    config.tilt = newTilt;

    domElements.gameBoard.style.transform = `rotate(${newTilt.rotation}deg) 
       skew(${newTilt.shearX}deg, ${newTilt.shearY}deg) 
       scale(${newTilt.scale})`;

    domElements.gameBoard.style.transition = "transform 1s ease-in-out"; //animation to transform
  }
}

function initRealityWarp(interval) {
  resetBoardTilt();

  //timer for randomtilts
  const realityWarpInterval = setInterval(() => {
    applyRandomTilt();
  }, interval);

  // store the interval ID in gameState for cleanups
  gameState.realityWarpInterval = realityWarpInterval;

  return realityWarpInterval;
}

// stop reality warp
function stopRealityWarp() {
  if (gameState.realityWarpInterval) {
    clearInterval(gameState.realityWarpInterval);
    gameState.realityWarpInterval = null;
    resetBoardTilt();
  }
}

export { initRealityWarp, stopRealityWarp, applyRandomTilt, resetBoardTilt };
