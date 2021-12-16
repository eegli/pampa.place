import {createMockState, createMockStore, render} from '@/tests/utils';
import * as GoogleMapsReactWrapper from '@googlemaps/react-wrapper';
import {AuthWrapper} from './auth';

const wrapperSpy = jest
  .spyOn(GoogleMapsReactWrapper, 'Wrapper')
  .mockImplementation(({children}) => {
    return <div id="rendered">{children}</div>;
  });

beforeEach(() => {
  wrapperSpy.mockClear();
});

describe('Auth wrapper', () => {
  ['apikey', '', undefined].forEach(apiKey => {
    it(`inits Google Maps with api key value: ${apiKey}`, () => {
      const state = createMockState({
        app: {
          apiKey,
        },
      });
      const store = createMockStore(state);
      render(<AuthWrapper />, store);
      // Valid api keys
      if (typeof apiKey === 'string') {
        expect(wrapperSpy).toHaveBeenCalledTimes(1);
        expect(wrapperSpy.mock.calls[0][0]).toMatchSnapshot(apiKey);
        expect(wrapperSpy.mock.results[0].value).toMatchSnapshot(apiKey);
      } else {
        // undefined is not a valid key
        expect(wrapperSpy).not.toHaveBeenCalled();
      }
    });
  });
});
