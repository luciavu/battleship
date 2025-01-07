import { squareSelection, getShipLength, gameMessage } from './helperFunctions';

// Game DOM
export const renderGameState = (game, result) => {
  const player = game.player1;
  const computer = game.player2;
  // Round
  document.querySelector('.round-counter').textContent = `ROUND ${game.round}`;
  // Game status
  document.querySelector('.game-status').textContent = `${gameMessage(result)}`;
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

  // Gameboards
  const computerGrid = document.getElementById('computer-board');
  const playerGrid = document.getElementById('player-board');

  if (game.round === 0) {
    document.querySelector('.round-counter').textContent = `ROUND 1`;
    renderGameboard(computer.board, computerGrid, computer.type);
    computer.board.ships.forEach((shipInfo) => {
      renderShips(shipInfo.coordinates, 'click', computer.type, shipInfo.ship.length);
    });
    renderGameboard(player.board, playerGrid, player.type);
    player.board.ships.forEach((shipInfo) => {
      renderShips(shipInfo.coordinates, 'click', player.type, shipInfo.ship.length);
    });

    document.querySelector('.game-status').textContent = 'PICK A SQUARE';
  }
};

export const renderPlacement = (gameboard, x, y, method, player, randDirection = false) => {
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
      renderShips(coordinates, method, player, shipLength);
    }
  } else if (method === 'click') {
    if (gameboard.placeShip(x, gameboard.size - 1 - y, shipLength, direction)) {
      renderShips(coordinates, method, player, shipLength);
      if (gameboard.ships.length === 6) {
        document.getElementById('start-game').disabled = false; // Allow start game
      }
    }
  } else if (method === 'mouseout') {
    renderShips(coordinates, method, player, shipLength);
  }
};

export const renderShips = (coordinates, method, player, length) => {
  coordinates.forEach(([x, y]) => {
    const squareElement = document.getElementById(`${player}${x}${y}`);

    if (squareElement) {
      if (method === 'click') {
        squareElement.classList.remove('position');
        if (player !== 'computer') {
          squareElement.classList.add('ship', `len${length}`);
        }
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
      square.classList.add('square', `${player}square`);
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
      } else {
        // Game
        square.addEventListener('click', squareSelection);
      }

      grid.append(square);
    }
  }
};

export const disableBoard = (player) => {
  Array.from(document.getElementsByClassName(`${player.type}square`)).forEach((square) => {
    square.classList.add('await-turn');
    square.style.pointerEvents = 'none';
  });
};

export const enableBoard = (player) => {
  Array.from(document.getElementsByClassName(`${player.type}square`)).forEach((square) => {
    square.classList.remove('await-turn');
    square.style.pointerEvents = 'auto';
  });
};

export const renderShot = (player, coordinate, hit) => {
  const square = document.getElementById(`${player}${coordinate[0]}${coordinate[1]}`);
  if (hit) {
    square.textContent = 'X';
  } else {
    square.textContent = 'o';
  }
  // Remove selected visual, make player unable to click on it again
  square.classList.remove('selected');
  square.removeEventListener('click', squareSelection);
  square.classList.add('shot');
};

export const renderEndGame = (game, winner) => {
  renderGameState(game, false);
  document.querySelector('.game-status').textContent = `${winner.toUpperCase()} WINS!`;
  document.querySelector('.invisible').classList.add('visible');
};

export const revealShip = (ship, player) => {
  ship.coordinates.forEach((coordinate) => {
    const square = document.getElementById(`${player}${coordinate[0]}${coordinate[1]}`);
    square.classList.add('len2');
  });
};
