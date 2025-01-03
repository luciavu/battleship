import './css/styles.css';
import { addOptionFocus, addNavigationEventListeners } from './utils/dom.js';
import Game from './modules/Game.js';
document.addEventListener('DOMContentLoaded', () => {
  addOptionFocus();

  addNavigationEventListeners();
  const game = new Game();
  game.newGame();
});
