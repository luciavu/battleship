import Player from './player';

export default class Computer extends Player {
  constructor() {
    super('Computer', 'computer');
    this.previousShot = null;
    this.shotHistory = new Set();
    this.directionsToTry = [];
  }

  getRandomCoordinates() {
    let x, y;
    do {
      x = Math.floor(Math.random() * this.board.size);
      y = Math.floor(Math.random() * this.board.size);
    } while (this.shotHistory.has(`${x},${y}`));
    return [x, y];
  }

  getDirectionsAround(lastHit) {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    let validDirections = [];
    for (let [dx, dy] of directions) {
      const newX = lastHit[0] + dx;
      const newY = lastHit[1] + dy;

      if (
        newX >= 0 &&
        newX < this.board.size &&
        newY >= 0 &&
        newY < this.board.size &&
        !this.shotHistory.has(`${newX},${newY}`)
      ) {
        validDirections.push([newX, newY]);
      }
    }

    return validDirections;
  }

  getNearbyCoordinates(lastHit) {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (let [dx, dy] of directions) {
      const newX = lastHit[0] + dx;
      const newY = lastHit[1] + dy;
      if (
        newX >= 0 &&
        newX < this.board.size &&
        newY >= 0 &&
        newY < this.board.size &&
        !this.shotHistory.has(`${newX},${newY}`)
      ) {
        return [newX, newY];
      }
    }
    // Return random coordinate if no valid nearby shot
    return this.getRandomCoordinates();
  }

  attack(opponent) {
    let shot;
    // If previous shot hit, try shooting around, unless all directions used up.
    if (this.previousShot && this.previousShot.hit) {
      if (this.directionsToTry.length === 0) {
        shot = this.getRandomCoordinates();
      } else {
        shot = this.directionsToTry.pop();
      }
    } else {
      if (this.directionsToTry.length !== 0) {
        shot = this.directionsToTry.pop();
      } else {
        shot = this.getRandomCoordinates();
      }
    }

    this.shotHistory.add(`${shot[0]},${shot[1]}`);
    const result = opponent.board.willHit(shot);

    // If hit, keep track of coordinate + surrounding
    if (result !== false) {
      if (result.isSunk()) {
        // Reset list when ship is sunk
        this.directionsToTry = [];
      }
      this.previousShot = {
        coordinates: shot,
        hit: true,
      };

      this.directionsToTry = this.getDirectionsAround(shot);
    } else {
      // If miss, record shot
      this.previousShot = {
        coordinates: shot,
        hit: false,
      };
    }
    return shot;
  }
}
