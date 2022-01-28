import {config as gameConfig} from '../game';
import {config as googleConfig} from '../google';

describe('Game config', () => {
  jest.unmock('../game');

  it('includes unlimited time mode', () => {
    expect(gameConfig.timeLimits).toContain(-1);
  });
  it('defaults options are included by the config', () => {
    expect(gameConfig.rounds).toContain(gameConfig.roundsDefault);
    expect(gameConfig.timeLimits).toContain(gameConfig.timeLimitsDefault);
  });
  it('defines a marker color for each player', () => {
    expect(googleConfig.marker.colors.length).toBeGreaterThanOrEqual(
      gameConfig.maxPlayers
    );
  });
});
