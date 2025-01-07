import Game from '../modules/Game';
import { resetGame, changeHeaderColor, randomiseShips, resetShips } from './helperFunctions';
import { renderGameState, disableBoard, enableBoard } from './dom';

export const setupEventListeners = () => {
  addOptionFocus();
  resetGame();
  changeHeaderColor('var(--light)');
  addSinglePlayerListener();
  addNavigationEventListeners();
  addNewGameEventListener();
};

// Page navigation
const addNavigationEventListeners = () => {
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

// New Game
const addNewGameEventListener = () => {
  const newGameBtn = document.getElementById('new-game');
  newGameBtn.addEventListener('click', () => {
    document.querySelector('.invisible').classList.remove('visible');
    setupEventListeners();
  });
};

// Singleplayer
const addSinglePlayerListener = () => {
  const singleplayer = document.getElementById('computer');
  singleplayer.addEventListener('click', () => {
    changeHeaderColor('var(--dark)');
    const game = new Game();
    game.newGame();

    // Randomise computer board
    const computer = game.player2;
    randomiseShips(computer.board, computer.type);

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
      renderGameState(game, false);

      disableBoard(game.turn);
      enableBoard(game, game.player2);
    });
    addLaunchAttackListener(game);
  });
};

// Launch attack
const addLaunchAttackListener = (game) => {
  const launchAttackBtn = document.getElementById('attack');
  launchAttackBtn.addEventListener('click', () => {
    const square = document.querySelector('.selected');
    if (square) {
      const squareLen = square.id.length;
      const x = parseInt(square.id.slice(squareLen - 2, squareLen - 1));
      const y = parseInt(square.id.slice(squareLen - 1));
      game.playRound([x, y]);
    }
  });
};
