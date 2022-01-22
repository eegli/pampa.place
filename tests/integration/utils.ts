import {AuthRes} from '../pages/api/auth.page';
import {screen} from '../utils';

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

export function getLoginElement(
  elem: 'keyInput' | 'passwordInput' | 'devModeButton' | 'enterButton'
) {
  switch (elem) {
    case 'keyInput':
      return screen.getByLabelText(/api/gi);
    case 'passwordInput':
      return screen.getByLabelText(/password/gi);
    case 'devModeButton':
      return screen.getByRole('button', {name: /dev/gi});
    case 'enterButton':
      return screen.getByRole('button', {name: /enter/gi});
  }
}
