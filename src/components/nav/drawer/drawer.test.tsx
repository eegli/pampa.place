import {fireEvent, render, screen} from '@/tests/utils';
import router from 'next/router';
import {MenuDrawer} from './drawer';

const clearStorageSpy = jest
  .spyOn(window.sessionStorage, 'clear')
  .mockImplementation(jest.fn());

const mockToggleDrawer = jest.fn();

const mockRouter = router as jest.Mocked<typeof router>;

mockRouter.reload = jest.fn();
mockRouter.push = jest.fn();
mockRouter.pathname = '/';

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

function getListItem(name: string) {
  return screen.getByRole('button', {name: new RegExp(name, 'ig')});
}

describe.only('Drawer', () => {
  [
    {name: 'home', route: '/'},
    {name: 'preview maps', route: '/preview'},
    {name: 'how to play', route: '/docs#how-to-play'},
    {name: 'customization guide', route: '/docs#customization-guide'},
    {name: 'privacy', route: '/docs#about-privacy'},
  ].forEach(({name, route}) => {
    it(`nav item, ${name}`, () => {
      render(<MenuDrawer open toggleDrawer={mockToggleDrawer} />);
      const navButton = getListItem(name);
      mockRouter.pathname = route;
      fireEvent.click(navButton);
      expect(mockRouter.push).not.toHaveBeenCalled();
      mockRouter.pathname = '/blabluu';
      fireEvent.click(navButton);
      expect(mockRouter.push).toHaveBeenCalledWith(route);
      expect(mockToggleDrawer).toHaveBeenCalledTimes(1);
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
