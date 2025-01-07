import Player from './player';
import Computer from './Computer';
import {
  renderGameboard,
  disableBoard,
  enableBoard,
  renderShot,
  renderGameState,
  renderEndGame,
  revealShip,
} from '../utils/dom';

import { addShipSetupListeners } from '../utils/eventlisteners';

export default class Game {
  constructor(
    player1 = new Player('Player 1', 'player'),
    player2 = new Computer('Computer', 'computer')
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.round = 0;
    this.turn = player1;
  }

  newGame() {
    const playerBoard = this.player1.board;
    const setupGrid = document.getElementById('setup-grid');
    // Ship setup
    addShipSetupListeners(playerBoard, setupGrid);
    renderGameboard(playerBoard, setupGrid, this.player1.type, true);
  }

  playRound(coordinate) {
    if (this.turn === this.player1) {
      this.round++;
    }
    const opponent = this.turn === this.player1 ? this.player2 : this.player1;

    // Opponent receive attack
    const result = opponent.board.receiveAttack(coordinate);

    if (result) {
      renderShot(opponent.type, coordinate, true);
      if (result.isSunk()) {
        if (this.turn === this.player1) {
          revealShip(result, this.player2.type);
        }
      }
      if (opponent.board.allShipsSunk()) {
        // End game if all ships sunk
        this.end(this.turn);
        return;
      }
    } else {
      // If player shot misses --> switch player
      renderShot(opponent.type, coordinate, false);
      disableBoard(opponent);
      enableBoard(this.turn);
      this.turn = opponent;
    }

    // Update button status based on turn
    const launchAttackBtn = document.getElementById('attack');
    if (this.turn === this.player1) {
      launchAttackBtn.disabled = false;
    } else {
      launchAttackBtn.disabled = true;
    }

    // Update round, etc. and render gameboard
    renderGameState(this, result);
    // Computer's turn
    if (this.turn === this.player2) {
      setTimeout(() => {
        const computerAttack = this.player2.attack(this.player1);
        this.playRound(computerAttack);
      }, 1000);
    }
  }

  end(player) {
    console.log(`${player.name.toUpperCase()} WINS!`);
    renderEndGame(this, player.name);
  }
}
