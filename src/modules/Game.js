import Player from './player';
import { renderGameboard, addShipSetupListeners, addNavigationEventListeners } from '../utils/dom';

export default class Game {
  constructor(
    player1 = new Player('Player 1', 'player'),
    player2 = new Player('Computer', 'computer')
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.round = 1;
    this.turn = player1;
  }

  newGame() {
    const playerBoard = this.player1.board;
    const setupGrid = document.getElementById('setup-grid');
    // Ship setup
    addShipSetupListeners(playerBoard, setupGrid);
    renderGameboard(playerBoard, setupGrid, true);
  }
}
