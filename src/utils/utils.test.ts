import {formatDist, formatDur, min} from './misc';

describe('Utils, misc', () => {
  test('min utility', () => {
    expect(min(2, 1)).toEqual(1);
    expect(min(3, 3)).toEqual(3);
    expect(min(0, -1)).toEqual(-1);
  });
  test('duration formatting utility', () => {
    expect(formatDur(0)).toEqual('0s');
    expect(formatDur(-1)).toEqual('unlimited');
    expect(formatDur(-1000)).toEqual('unlimited');
    expect(formatDur(59)).toEqual('59s');
    expect(formatDur(60)).toEqual('1m');
    expect(formatDur(61)).toEqual('1m 1s');
    expect(formatDur(122)).toEqual('2m 2s');
  });
  test('distance formatting utility', () => {
    expect(formatDist(0)).toEqual('0.0 m');
    expect(formatDist(2.2)).toEqual('2.2 m');
    expect(formatDist(-1)).toEqual('-');
    expect(formatDist(1000)).toEqual('1.000 km');
    expect(formatDist(1001.1)).toEqual('1.001 km');
    expect(formatDist(1021.1)).toEqual('1.021 km');
  });
});
