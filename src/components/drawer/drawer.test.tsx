import {fireEvent, render, screen} from '@/tests/utils';
import router from 'next/router';
import {MenuDrawer} from './drawer';

const clearStorageSpy = jest
  .spyOn(window.sessionStorage, 'clear')
  .mockImplementation(jest.fn());

const mockToggleDrawer = jest.fn();

const mockRouter: Partial<typeof router> = {
  push: jest.fn(),
  reload: jest.fn(),
  pathname: '/',
};

jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockRouter);

afterEach(() => {
  jest.clearAllMocks();
});

function getListItem(name: string) {
  return screen.getByRole('button', {name: new RegExp(name, 'ig')});
}

describe('Drawer', () => {
  [
    {name: 'home', route: '/'},
    {name: 'map preview', route: '/preview'},
    {name: 'docs', route: '/docs'},
  ].forEach(({name, route}) => {
    it(`nav item, ${name}`, () => {
      render(<MenuDrawer open toggleDrawer={mockToggleDrawer} />);
      const navButton = getListItem(name);
      mockRouter.pathname = route;
      fireEvent.click(navButton);
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(mockToggleDrawer).toHaveBeenCalledTimes(1);
      mockRouter.pathname = '/blabluu';
      fireEvent.click(navButton);
      expect(mockRouter.push).toHaveBeenCalledWith(route);
      expect(mockToggleDrawer).toHaveBeenCalledTimes(2);
      console.info(mockRouter);
    });
  });
  it(`nav item, change api key`, () => {
    render(<MenuDrawer open toggleDrawer={mockToggleDrawer} />);
    const navButton = getListItem('api key');
    fireEvent.click(navButton);
    expect(clearStorageSpy).toHaveBeenCalledTimes(1);
    expect(mockRouter.reload).toHaveBeenCalledTimes(1);
  });
});
