// Page navigation
const addNavigationEventListeners = () => {
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

    // Move to ship selection
    const titlescreen = document.querySelector('.titlescreen');
    const selection = document.querySelector('.ship-selection');
    titlescreen.classList.remove('visible');
    selection.classList.add('visible');
  });
};

addNavigationEventListeners();
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

// Rules DOM
const addRulesPopup = () => {
  // Save previous page type, change to rules page.
  const active = document.querySelector('.active');
};
const addBackButtonEventListener = () => {
  // Go back to prev page from rules page.
  const backButton = document.getElementById('back');
  backButton.addEventListener();
};

// Boat Setup DOM
const boatSetUp = () => {
  const grid = document.getElementById('setup-grid');
  console.log(grid);
  renderGrid(grid, 0);
};
// Game DOM

// Helper functions
const renderGrid = (grid, gridInfo, setup = false) => {
  // Render ships onto 8x8 gameboard based on array of coordinates
  for (let i = 1; i <= 9; i++) {
    for (let j = -1; j <= 7; j++) {
      if (i == 9 && j != -1) {
        // Add x labels -> a - h
        const xLabel = document.createElement('div');
        xLabel.classList.add('xLabel');
        xLabel.textContent = `${String.fromCharCode(97 + j)}`;
        grid.append(xLabel);
      } else if (j == -1 && i != 9) {
        // Add y labels -> 0 - 7
        const yLabel = document.createElement('div');
        yLabel.classList.add('yLabel');
        yLabel.textContent = `${8 - i}`;
        grid.append(yLabel);
      } else {
        // Add chessboard squares
        const square = document.createElement('div');
        square.classList.add('square');
        square.id = `${String.fromCharCode(97 + j)}${9 - i}`;
        if (square.id === '`0') {
          square.classList.add('hidden');
        }
        grid.append(square);
      }
    }
  }
};

boatSetUp();
renderGrid(document.getElementById('player-board', 0));
renderGrid(document.getElementById('computer-board', 0));
