import { renderPlacement, renderGameboard } from './dom';
// Helper functions
export const squareSelection = (event) => {
  const prevSelected = document.querySelector('.selected');
  if (prevSelected) {
    prevSelected.classList.remove('selected');
  }
  event.target.classList.add('selected');
};

export const resetGame = () => {
  // Set title screen visibility
  document.querySelector('.titlescreen').classList.add('visible');
  // Hide other pages
  document.querySelector('.ship-selection').classList.remove('visible');
  document.querySelector('.game').classList.remove('visible');
};

export const resetShips = (playerBoard, grid) => {
  playerBoard.ships = [];
  document.getElementById('start-game').disabled = true; // Disable start button
  renderGameboard(playerBoard, grid, 'player', true);
};

export const randomiseShips = (board, player) => {
  const minCeiled = 0;
  const maxFloored = Math.floor(board.size);
  while (board.ships.length < 6) {
    const x = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    const y = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    renderPlacement(board, x, y, 'click', player, true);
  }
  document.getElementById('start-game').disabled = false; // Allow start game
};

export const getShipLength = (gameboard) => {
  if (gameboard.ships.length === 0) return 4;
  if (gameboard.ships.length <= 2) return 3;
  if (gameboard.ships.length <= 5) return 2;
  return 0;
};

export const changeHeaderColor = (color) => {
  const headerOptions = document.getElementsByClassName('header-option');
  Array.from(headerOptions).forEach((option) => {
    option.style.color = color;
  });
};

export const gameMessage = (result) => {
  if (!result) {
    return 'MISS!';
  } else if (result.isSunk()) {
    return 'SHIP SUNK! GO AGAIN';
  } else if (result) {
    return 'HIT! GO AGAIN';
  } else {
    return 'MISS!';
  }
};
