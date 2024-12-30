import Ship from './ship';

export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.ships = [];
    this.missedShots = [];
  }

  placeShip(x, y, length, direction) {
    const ship = new Ship(length);
    const coordinates = this.getShipCoordinates(x, y, length, direction);

    // Check coordinates not out of bounds before placing
    if (this.isValidPlacement(coordinates)) {
      this.ships.push({ ship, coordinates });
      return true;
    }
    // Else return false
    return false;
  }

  getShipCoordinates(x, y, length, direction) {
    const coordinates = [];

    for (let i = 0; i < length; i++) {
      if (direction === 'horizontal') {
        coordinates.push([x + i, y]);
      } else if (direction === 'vertical') {
        coordinates.push([x, y + i]);
      }
    }
    return coordinates;
  }

  isValidPlacement(coordinates) {
    // Out of bounds
    for (const [x, y] of coordinates) {
      if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
        return false;
      }
    }
    // Already occupied
    for (const shipData of this.ships) {
      for (const [x1, y1] of coordinates) {
        if (shipData.coordinates.some(([x2, y2]) => x2 === x1 && y2 === y1)) {
          return false;
        }
      }
    }
    return true;
  }

  // If hit, sends hit to correct ship, else record coordinate of missed shot
  receiveAttack(coordinateInput) {
    const shipHit = this.ships.find((shipData) => {
      return shipData.coordinates.some(([x, y]) => {
        return x === coordinateInput[0] && y === coordinateInput[1];
      });
    });

    if (shipHit) {
      shipHit.ship.hit();
      return 'hit';
    } else {
      this.missedShots.push(coordinateInput);
      return 'miss';
    }
  }

  // True if all ships on board return true for isSunk()
  allShipsSunk() {
    return this.ships.every((shipData) => {
      return shipData.ship.isSunk();
    });
  }
}
