import Game from '../modules/Game';
import Gameboard from '../modules/gameboard';

export const startGame = () => {
  const singleplayer = document.getElementById('computer');
  singleplayer.addEventListener('click', () => {
    // Make a Game with one player, one computer
    const game = new Game();
    game.newGame();

    // Change header color
    const headerOptions = document.getElementsByClassName('header-option');
    Array.from(headerOptions).forEach((option) => {
      option.style.color = 'var(--dark)';
    });

    // Move to ship selection
    const titlescreen = document.querySelector('.titlescreen');
    const selection = document.querySelector('.ship-selection');
    titlescreen.classList.remove('visible');
    selection.classList.add('visible');

    const startBtn = document.getElementById('start-game');
    startBtn.addEventListener('click', () => {
      // Hide and clear setup page
      document.querySelector('.ship-selection').classList.remove('visible');
      document.getElementById('setup-grid').innerHTML = '';
      // Move to game page
      document.querySelector('.game').classList.add('visible');
      renderGameState(game);
    });
  });

  addNavigationEventListeners();
};
// Page navigation
export const addNavigationEventListeners = () => {
  const rules = document.querySelector('.rules');
  const rulesBtn = document.getElementById('rules');
  const backBtn = document.getElementById('back');

  rulesBtn.addEventListener('click', () => {
    rules.classList.add('visible');
  });

  backBtn.addEventListener('click', () => {
    rules.classList.remove('visible');
  });
};

// Title screen DOM
export const addOptionFocus = () => {
  const options = document.getElementsByClassName('option-text');
  Array.from(options).forEach((option) => {
    option.addEventListener('mouseover', () => {
      const arrow = document.getElementById(`${option.id}arrow`);
      if (arrow) arrow.style.visibility = 'visible';
    });

    option.addEventListener('mouseout', () => {
      const arrow = document.getElementById(`${option.id}arrow`);
      if (arrow) arrow.style.visibility = 'hidden';
    });
  });
};

// Setup DOM
export const addShipSetupListeners = (playerBoard, grid) => {
  const resetBtn = document.getElementById('reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetShips(playerBoard, grid);
    });
  }

  const rotateBtn = document.getElementById('rotate');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      rotateBtn.classList.toggle('horizontal');
      rotateBtn.classList.toggle('vertical');
    });
  }

  const randomBtn = document.getElementById('random');
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      resetShips(playerBoard, grid);
      randomiseShips(playerBoard, 'player');
    });
  }
};

// Game DOM
const renderGameState = (game) => {
  const player = game.player1;
  const computer = game.player2;
  const result = 'HIT! GO AGAIN.'; // Hit, ship sunk, win, loss, miss
  // Round
  document.querySelector('.round-counter').textContent = `ROUND ${game.round}`;
  // Game status
  document.querySelector('.game-status').textContent = `${result}`;
  // Names
  document.querySelector('.player-name').textContent = `${player.name}`;
  document.querySelector('.computer-name').textContent = computer.name;
  // Turn
  const turn = game.turn === player ? '.player-turn' : '.computer-turn';
  const prevTurn = turn === '.player-turn' ? '.computer-turn' : '.player-turn';
  document.querySelector(turn).style.visibility = 'visible';
  document.querySelector(prevTurn).style.visibility = 'hidden';
  // Ships remaining

  document.querySelector(
    '.player-remaining-ships'
  ).textContent = `Remaining Ships: ${player.board.remainingShips()}`;

  document.querySelector(
    '.computer-remaining-ships'
  ).textContent = `Remaining Ships: ${computer.board.remainingShips()}`;
  console.log(computer.board.ships);

  // Gameboards
  const playerGrid = document.getElementById('player-board');
  renderGameboard(player.board, playerGrid, player.type);
  player.board.ships.forEach((shipInfo) => {
    renderShips(shipInfo.coordinates, 'click', player.type);
  });

  const computerGrid = document.getElementById('computer-board');
  // Randomise computer board
  randomiseShips(computer.board, computer.type);
  renderGameboard(computer.board, computerGrid, computer.type);
  computer.board.ships.forEach((shipInfo) => {
    renderShips(shipInfo.coordinates, 'click', computer.type);
  });
};

const renderPlacement = (gameboard, x, y, method, player, randDirection = false) => {
  const shipLength = getShipLength(gameboard);
  const rotateButton = document.getElementById('rotate');
  let direction;
  if (randDirection) {
    direction = Math.floor(Math.random() * 2) ? 'horizontal' : 'vertical';
  } else {
    direction = rotateButton ? rotateButton.classList[0] : 'horizontal';
  }

  const coordinates =
    direction === 'horizontal'
      ? gameboard.getShipCoordinates(x, gameboard.size - 1 - y, shipLength, 'horizontal')
      : gameboard.getShipCoordinates(x, gameboard.size - 1 - y, shipLength, 'vertical');

  if (method === 'mouseover') {
    if (gameboard.isValidPlacement(coordinates)) {
      renderShips(coordinates, method, player);
    }
  } else if (method === 'click') {
    if (gameboard.placeShip(x, gameboard.size - 1 - y, shipLength, direction)) {
      renderShips(coordinates, method, player);
      if (gameboard.ships.length === 6) {
        document.getElementById('start-game').disabled = false; // Allow start game
      }
    }
  } else if (method === 'mouseout') {
    renderShips(coordinates, method, player);
  }
};

export const renderShips = (coordinates, method, player) => {
  coordinates.forEach(([x, y]) => {
    const squareElement = document.getElementById(`${player}${x}${y}`);

    if (squareElement) {
      if (method === 'click') {
        squareElement.classList.remove('position');
        squareElement.classList.add('ship');
      } else if (method === 'mouseover') {
        squareElement.classList.add('position');
      } else if (method === 'mouseout') {
        squareElement.classList.remove('position');
      }
    }
  });
};

export const renderGameboard = (gameboard, grid, player, setup = false) => {
  grid.innerHTML = '';

  for (let i = 0; i < gameboard.size; i++) {
    const yLabel = document.createElement('div');
    yLabel.classList.add('yLabel');
    yLabel.textContent = `${gameboard.size - 1 - i}`;
    yLabel.style.gridRow = `${i + 2}`;
    yLabel.style.gridColumn = `1`;
    grid.append(yLabel);
  }

  for (let i = 0; i < gameboard.size; i++) {
    const xLabel = document.createElement('div');
    xLabel.classList.add('xLabel');
    xLabel.textContent = `${String.fromCharCode(97 + i)}`;
    xLabel.style.gridRow = `${gameboard.size + 2}`;
    xLabel.style.gridColumn = `${i + 2}`;
    grid.append(xLabel);
  }

  for (let i = 0; i < gameboard.size; i++) {
    for (let j = 0; j < gameboard.size; j++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.id = `${player}${j}${gameboard.size - 1 - i}`;
      square.style.gridRow = `${i + 2}`;
      square.style.gridColumn = `${j + 2}`;

      if (setup) {
        square.addEventListener('click', () => {
          renderPlacement(gameboard, j, i, 'click', player);
        });

        square.addEventListener('mouseover', () => {
          renderPlacement(gameboard, j, i, 'mouseover', player);
        });

        square.addEventListener('mouseout', () => {
          renderPlacement(gameboard, j, i, 'mouseout', player);
        });
      }

      grid.append(square);
    }
  }
};

// Helper functions
const resetShips = (playerBoard, grid) => {
  playerBoard.ships = [];
  document.getElementById('start-game').disabled = true; // Disable start button
  renderGameboard(playerBoard, grid, 'player', true);
};

const randomiseShips = (board, player) => {
  const minCeiled = 0;
  const maxFloored = Math.floor(board.size);
  while (board.ships.length < 6) {
    const x = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    const y = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    renderPlacement(board, x, y, 'click', player, true);
  }
  document.getElementById('start-game').disabled = false; // Allow start game
};

const getShipLength = (gameboard) => {
  if (gameboard.ships.length === 0) return 4;
  if (gameboard.ships.length <= 2) return 3;
  if (gameboard.ships.length <= 5) return 2;
  return 0;
};
