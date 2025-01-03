import Gameboard from '../modules/gameboard';
// Page navigation
export const addNavigationEventListeners = () => {
  const rules = document.querySelector('.rules');
  const rulesBtn = document.getElementById('rules');
  const backBtn = document.getElementById('back');

  const singleplayer = document.getElementById('computer');

  rulesBtn.addEventListener('click', () => {
    rules.classList.add('visible');
  });

  backBtn.addEventListener('click', () => {
    rules.classList.remove('visible');
  });

  singleplayer.addEventListener('click', () => {
    // Make a Game with one player, one computer

    // Change header color
    const headerOptions = document.getElementsByClassName('header-option');
    Array.from(headerOptions).forEach((option) => {
      console.log(option.id);
      option.style.color = 'var(--dark)';
    });

    // Move to ship selection
    const titlescreen = document.querySelector('.titlescreen');
    const selection = document.querySelector('.ship-selection');
    titlescreen.classList.remove('visible');
    selection.classList.add('visible');
  });
};

// Title screen DOM

// Adjust arrow visibility
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
      console.log('call');
      resetShips(playerBoard, grid);
      randomiseShips(playerBoard);
    });
  }
};

// Helper functions

const resetShips = (playerBoard, grid) => {
  playerBoard.ships = [];
  renderGameboard(playerBoard, grid, true);
};

const randomiseShips = (playerBoard) => {
  const minCeiled = 0;
  const maxFloored = Math.floor(playerBoard.size);
  while (playerBoard.ships.length < 6) {
    const x = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    const y = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    renderPlacement(playerBoard, x, y, 'click', true);
    console.log(playerBoard.ships.length);
  }
};

const getShipLength = (gameboard) => {
  if (gameboard.ships.length === 0) return 4;
  if (gameboard.ships.length <= 2) return 3;
  if (gameboard.ships.length <= 5) return 2;
  return 0;
};

const renderPlacement = (gameboard, x, y, method, randDirection = false) => {
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
      renderShips(coordinates, method);
    }
  } else if (method === 'click') {
    if (gameboard.placeShip(x, gameboard.size - 1 - y, shipLength, direction)) {
      console.log('Placed ship');
      renderShips(coordinates, method);
    }
  } else if (method === 'mouseout') {
    renderShips(coordinates, method);
  }
};

const renderShips = (coordinates, method) => {
  coordinates.forEach(([x, y]) => {
    const squareElement = document.getElementById(`${x}${y}`);

    if (squareElement) {
      if (method === 'click') {
        squareElement.classList.remove('position');
        squareElement.classList.add('ship');
        console.log('here', squareElement);
      } else if (method === 'mouseover') {
        squareElement.classList.add('position');
      } else if (method === 'mouseout') {
        squareElement.classList.remove('position');
      }
    }
  });
};

export const renderGameboard = (gameboard, grid, setup = false) => {
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
      square.id = `${j}${gameboard.size - 1 - i}`;
      square.style.gridRow = `${i + 2}`;
      square.style.gridColumn = `${j + 2}`;

      if (setup) {
        square.addEventListener('click', () => {
          renderPlacement(gameboard, j, i, 'click');
        });

        square.addEventListener('mouseover', () => {
          renderPlacement(gameboard, j, i, 'mouseover');
        });

        square.addEventListener('mouseout', () => {
          renderPlacement(gameboard, j, i, 'mouseout');
        });
      }

      grid.append(square);
    }
  }
};
