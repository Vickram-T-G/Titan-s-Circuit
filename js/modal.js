//LOCAL IMPORTS
//    fundemental imports
import gameState from "./gameState.js";
import { domElements } from "./domElements.js";

//others
import { resetGame } from "./gameControl.js";

function initModal() {
  domElements.closeModalButton.addEventListener("click", closeModal);
  domElements.playAgainButton.addEventListener("click", () => {
    closeModal();
    resetGame();
  });
}

//opens modal
function showEndGameModal(winner) {
  domElements.winnerDisplay.textContent =
    winner === "It's a tie" ? "It's a tie!" : `${winner} Player Wins!`;

  domElements.winnerDisplay.style.color =
    winner === "Red" ? "#e74c3c" : winner === "Blue" ? "#3498db" : "white";

  domElements.modalRedScore.textContent = gameState.redScore;
  domElements.modalBlueScore.textContent = gameState.blueScore;

  domElements.modalRedTime.textContent = domElements.redTimer.textContent;
  domElements.modalBlueTime.textContent = domElements.blueTimer.textContent;
  domElements.modalGameTime.textContent = domElements.gameTimer.textContent;

  domElements.gameEndModal.classList.add("active");
}

function closeModal() {
  domElements.gameEndModal.classList.remove("active");
}

//to stop accumulating listners
function cleanupModalListeners() {
  if (domElements.closeModalButton) {
    domElements.closeModalButton.replaceWith(
      domElements.closeModalButton.cloneNode(true)
    );
    domElements.closeModalButton = document.querySelector(".close-button");
  }

  if (domElements.playAgainButton) {
    domElements.playAgainButton.replaceWith(
      domElements.playAgainButton.cloneNode(true)
    );
    domElements.playAgainButton = document.getElementById("play-again-btn");
  }
  closeModal();
}

export { initModal, showEndGameModal, closeModal, cleanupModalListeners };
