import Gameboard from '../../src/modules/gameboard';
describe('Gameboard', () => {
  let gameboard;
  let size = 10;

  beforeEach(() => {
    gameboard = new Gameboard(size);
  });

  test('Gameboard initialised with correct size and empty ships/shots', () => {
    expect(gameboard.size).toBe(size);
    expect(gameboard.ships).toHaveLength(0);
    expect(gameboard.missedShots).toHaveLength(0);
  });

  test('Ship placed correctly on board', () => {
    const result = gameboard.placeShip(0, 0, 2, 'horizontal');
    expect(result).toBe(true);
    expect(gameboard.ships).toHaveLength(1);
    expect(gameboard.ships[0].coordinates).toEqual([
      [0, 0],
      [1, 0],
    ]);
  });

  test('Ship not placed when out of bounds', () => {
    const result = gameboard.placeShip(9, 9, 2, 'horizontal');
    expect(result).toBe(false);
    expect(gameboard.ships).toHaveLength(0);
  });

  test('Ship not placed on occupied space', () => {
    gameboard.placeShip(0, 0, 2, 'horizontal'); // 0,0 1,0
    let result = gameboard.placeShip(0, 0, 2, 'vertical'); // 0,0 0,1
    expect(result).toBe(false);
    result = gameboard.placeShip(0, 0, 3, 'horizontal');
    expect(result).toBe(false);
  });

  test('receiveAttack records missed shots', () => {
    gameboard.placeShip(0, 0, 2, 'horizontal');
    let result = gameboard.receiveAttack([2, 0]);
    expect(result).toBe(false);
    result = gameboard.receiveAttack([0, 1]);
    expect(result).toBe(false);
  });

  describe('Gameboard: all ships sunk', () => {
    beforeEach(() => {
      gameboard.placeShip(0, 0, 1, 'horizontal');
      gameboard.placeShip(3, 3, 2, 'horizontal');
    });

    test('Gameboard correctly reports not all ships have sunk', () => {
      expect(gameboard.allShipsSunk()).toBe(false);
      // Hit one ship, other remaining should still be false
      gameboard.receiveAttack([0, 0]);
      expect(gameboard.allShipsSunk()).toBe(false);
    });

    test('Gameboard correctly reports when all ships have sunk', () => {
      gameboard.receiveAttack([0, 0]);
      expect(gameboard.ships[0].ship.isSunk()).toBe(true);
      gameboard.receiveAttack([3, 3]);
      gameboard.receiveAttack([4, 3]);
      expect(gameboard.ships[1].ship.isSunk()).toBe(true);
      expect(gameboard.allShipsSunk()).toBe(true);
    });
  });

  describe('Gameboard: remainingShips', () => {
    test('Correct number of remaining ships (no ships sunk)', () => {
      gameboard.placeShip(0, 0, 3, 'horizontal');
      gameboard.placeShip(4, 4, 2, 'vertical');
      expect(gameboard.remainingShips()).toBe(2);
    });

    test('Correct number of remaining ships (some ships sunk)', () => {
      gameboard.placeShip(0, 0, 3, 'horizontal');
      gameboard.placeShip(4, 4, 2, 'vertical');

      gameboard.receiveAttack([0, 0]);
      gameboard.receiveAttack([1, 0]);
      gameboard.receiveAttack([2, 0]);

      expect(gameboard.remainingShips()).toBe(1);
    });

    test('Return 0 when all ships sunk', () => {
      gameboard.placeShip(0, 0, 3, 'horizontal');
      gameboard.placeShip(4, 4, 2, 'vertical');
      gameboard.receiveAttack([0, 0]);
      gameboard.receiveAttack([1, 0]);
      gameboard.receiveAttack([2, 0]);
      gameboard.receiveAttack([4, 4]);
      gameboard.receiveAttack([4, 5]);
      expect(gameboard.remainingShips()).toBe(0);
    });

    test('0 when no ships exist', () => {
      expect(gameboard.remainingShips()).toBe(0);
    });
  });
});
