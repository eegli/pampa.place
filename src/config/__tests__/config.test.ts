import gameConfig from '../game';
import markers from '../markers';

describe('Config', () => {
  it('defines a marker color for each player', () => {
    expect(gameConfig.maxPlayers).toBeLessThanOrEqual(markers.colors.length);
  });
});