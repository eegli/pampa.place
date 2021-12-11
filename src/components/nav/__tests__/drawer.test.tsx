import {fireEvent, render, screen} from '@/tests/utils';
import router from 'next/router';
import {MenuDrawer} from '../drawer/drawer';

const mockRouter = router as jest.Mocked<typeof router>;

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

mockRouter.push = jest.fn();
mockRouter.pathname = '/';
const mockToggleDrawer = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('Drawer', () => {
  function getListItem(name: string) {
    return screen.getByRole('button', {name: new RegExp(name, 'ig')});
  }
  [
    {name: 'home', route: '/'},
    {name: 'preview maps', route: '/preview'},
    {name: 'how to play', route: null},
    {name: 'customization guide', route: null},
    {name: 'Privacy', route: null},
  ].forEach(({name, route}) => {
    it(`nav item, ${name}`, () => {
      render(<MenuDrawer open toggleDrawer={mockToggleDrawer} />);
      const drawerButton = getListItem(name);
      expect(drawerButton).toBeInTheDocument();
      if (route) {
        mockRouter.pathname = route;
        fireEvent.click(drawerButton);
        expect(mockRouter.push).not.toHaveBeenCalled();
        mockRouter.pathname = '/blabluu';
        fireEvent.click(drawerButton);
        expect(mockRouter.push).toHaveBeenCalledWith(route);
        expect(mockToggleDrawer).toHaveBeenCalledTimes(1);
      } else {
        fireEvent.click(drawerButton);
        expect(mockToggleDrawer).toHaveBeenCalledTimes(1);
      }
    });
  });
});
