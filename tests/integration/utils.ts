import {AuthRes} from '../pages/api/auth.page';

export const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;

export function setupGlobalFetch() {
  global.fetch = mockFetch.mockImplementation(url => {
    return new Promise((resolve, reject) => {
      if (url.toString().includes('password')) {
        const res: AuthRes = {
          apikey: 'server api key',
        };

        // @ts-expect-error - no need to fully mock the fetch API
        return resolve({
          json: () => Promise.resolve(res),
        });
      }
      return reject();
    });
  });
}
