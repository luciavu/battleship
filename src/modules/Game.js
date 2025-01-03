import Player from './player';
import { renderGameboard, addShipSetupListeners } from '../utils/dom';
export default class Game {
  constructor(player1, player2) {
    this.player1 = new Player('Player 1', 'player');
    this.player2 = new Player('Computer', 'computer');
    this.round = 1;
  }

  newGame() {
    const playerBoard = this.player1.board;
    const grid = document.getElementById('setup-grid');
    addShipSetupListeners(playerBoard, grid);
    renderGameboard(playerBoard, grid, true);
  }
}
