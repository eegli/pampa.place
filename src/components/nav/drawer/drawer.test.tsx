import {fireEvent, render, screen} from '@/tests/utils';
import router from 'next/router';
import {MenuDrawer} from './drawer';

const mockRouter = router as jest.Mocked<typeof router>;
mockRouter.reload = jest.fn();
mockRouter.push = jest.fn();
mockRouter.pathname = '/';

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

Object.defineProperty(window, 'sessionStorage', {
  value: {
    clear: jest.fn(),
  },
});

const mockToggleDrawer = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

function getListItem(name: string) {
  return screen.getByRole('button', {name: new RegExp(name, 'ig')});
}

describe('Drawer', () => {
  [
    {name: 'home', route: '/'},
    {name: 'preview maps', route: '/preview'},
    {name: 'how to play', route: null},
    {name: 'customization guide', route: null},
    {name: 'privacy', route: null},
  ].forEach(({name, route}) => {
    it(`nav item, ${name}`, () => {
      render(<MenuDrawer open toggleDrawer={mockToggleDrawer} />);
      const navButton = getListItem(name);
      expect(navButton).toBeInTheDocument();
      if (route) {
        mockRouter.pathname = route;
        fireEvent.click(navButton);
        expect(mockRouter.push).not.toHaveBeenCalled();
        mockRouter.pathname = '/blabluu';
        fireEvent.click(navButton);
        expect(mockRouter.push).toHaveBeenCalledWith(route);
        expect(mockToggleDrawer).toHaveBeenCalledTimes(1);
      } else {
        fireEvent.click(navButton);
        expect(mockToggleDrawer).toHaveBeenCalledTimes(1);
      }
    });
  });
  it(`nav item, change api key`, () => {
    render(<MenuDrawer open toggleDrawer={mockToggleDrawer} />);
    const navButton = getListItem('api key');
    expect(navButton).toBeInTheDocument();
    fireEvent.click(navButton);
    expect(window.sessionStorage.clear).toHaveBeenCalledTimes(1);
    expect(mockRouter.reload).toHaveBeenCalledTimes(1);
  });
});
