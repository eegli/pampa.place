import {config as gameConfig} from '../game';
import {markers} from '../markers';

describe('Config', () => {
  it('defines a marker color for each player', () => {
    expect(gameConfig.maxPlayers).toBeLessThanOrEqual(markers.colors.length);
  });
  it('includes unlimited time mode', () => {
    expect(gameConfig.timeLimits).toContain(-1);
  });
  it('defaults options are included by the config', () => {
    expect(gameConfig.rounds).toContain(gameConfig.roundsDefault);
    expect(gameConfig.timeLimits).toContain(gameConfig.timeLimitsDefault);
  });
});
