export default class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.hasSunk = false;
    this.coordinates = [];
  }

  hit() {
    if (this.hits < this.length) {
      this.hits++;
    }
  }

  isSunk() {
    this.hasSunk = this.length === this.hits;
    return this.hasSunk;
  }
}
