import { config as gameConfig, defaults as gameDefaults } from '../game';
import { markers } from '../markers';

describe('Config', () => {
  it('defines a marker color for each player', () => {
    expect(gameConfig.maxPlayers).toBeLessThanOrEqual(markers.colors.length);
  });
  it('includes unlimited time mode', () => {
    expect(gameConfig.timeLimits).toContain(-1);
  });
  it('defaults options are included by the config', () => {
    expect(gameConfig.rounds).toContain(gameDefaults.round);
    expect(gameConfig.timeLimits).toContain(gameDefaults.timeLimit);
  });
});