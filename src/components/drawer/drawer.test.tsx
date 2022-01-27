import {fireEvent, render, screen} from '@/tests/utils';
import router from 'next/router';
import {Constants} from '../../config/constants';
import {MenuDrawer} from './drawer';

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
    {name: 'my maps', route: '/my-maps'},
    {name: 'preview maps', route: '/preview'},
    {name: 'about', route: '/about'},
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
  it(`nav item, change local api key`, () => {
    window.sessionStorage.setItem(Constants.SESSION_API_KEY, 'old key');
    expect(window.sessionStorage.length).toBe(1);
    render(<MenuDrawer open toggleDrawer={mockToggleDrawer} />);
    const navButton = getListItem('api key');
    fireEvent.click(navButton);
    expect(window.sessionStorage.length).toBe(0);
    expect(mockRouter.reload).toHaveBeenCalledTimes(1);
  });
});
