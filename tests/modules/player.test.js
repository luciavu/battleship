import Player from '../../src/modules/player';
import Gameboard from '../../src/modules/gameboard';

describe('Player', () => {
  test('Player initialised correctly (name, type, empty gameboard)', () => {
    const name = 'Player 1';
    const type = 'player';
    const player = new Player(name, type);
    expect(player.name).toBe(name);
    expect(player.type).toBe(type);
    expect(player.board).toBeInstanceOf(Gameboard);
    expect(player.board.ships).toHaveLength(0);
  });
});
