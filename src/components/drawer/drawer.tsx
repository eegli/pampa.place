import {Box, Drawer, List, Paper} from '@mui/material';
import {useRouter} from 'next/router';
import {CustomListItem} from './drawer-item';

type MenuDrawerProps = {
  open: boolean;
  toggleDrawer: () => void;
};

export const MenuDrawer = ({open, toggleDrawer}: MenuDrawerProps) => {
  const router = useRouter();

  function handleChangeKey() {
    window.sessionStorage.clear();
    // In order to load a new API key, the page must be reloaded so
    // that Google maps can properly attach a new map to the DOM
    router.reload();
  }

  function handleRouteChange(route: string) {
    if (router.pathname !== route) {
      (async () => {
        await router.push(route);
      })();
    }
    toggleDrawer();
  }

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer}>
      <Paper elevation={3} sx={{height: '100%'}}>
        <Box p={2} width="100%" maxWidth="18rem">
          <List>
            <CustomListItem
              primarText="Play!"
              onClick={() => handleRouteChange('/')}
            />
            <CustomListItem
              primarText="My maps"
              secondaryText="Add, edit and preview custom maps"
              onClick={() => handleRouteChange('/my-maps')}
            />
            <CustomListItem
              primarText="Preview maps"
              secondaryText="View all maps at once and check their Street View coverage"
              onClick={() => handleRouteChange('/preview')}
            />
            <CustomListItem
              primarText="About"
              secondaryText="All you need to know about pampa.place"
              onClick={() => handleRouteChange('/about')}
            />

            <CustomListItem
              primarText="Change API key"
              secondaryText="Play with a different API key or change into preview mode"
              onClick={handleChangeKey}
            />
          </List>
        </Box>
      </Paper>
    </Drawer>
  );
};
