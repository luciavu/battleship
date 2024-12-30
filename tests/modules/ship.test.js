import Ship from '../../src/modules/ship';

describe('Ship', () => {
  let ship;
  const length = 3;

  beforeEach(() => {
    ship = new Ship(length);
  });

  test('Ship object created with correct given length', () => {
    expect(ship.length).toBe(length);
  });

  test('Ship object hits updated correctly', () => {
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  test('Ship hits should not exceed length', () => {
    for (let i = 0; i <= length; i++) {
      ship.hit();
    }
    expect(ship.hits).toBe(length);
  });

  test('isSunk returns false when ship has not sunk', () => {
    for (let i = 0; i < length - 1; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBeFalsy();
  });

  test('isSunk returns true when ship has sunk', () => {
    for (let i = 0; i < length; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBeTruthy();
  });
});
