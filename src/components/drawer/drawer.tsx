import {Box, Drawer, List, Paper} from '@mui/material';
import {useRouter} from 'next/router';
import React from 'react';
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
              primarText="Home"
              onClick={() => handleRouteChange('/')}
            />
            <CustomListItem
              primarText="My maps"
              secondaryText="Add, edit and preview local maps"
              onClick={() => handleRouteChange('/my-maps')}
            />
            <CustomListItem
              primarText="Map preview"
              secondaryText="View all maps at once and check their Street View coverage"
              onClick={() => handleRouteChange('/preview')}
            />
            <CustomListItem
              primarText="Docs &amp; privacy"
              secondaryText="All you need to know about pampa.place"
              onClick={() => handleRouteChange('/docs')}
            />
            <CustomListItem
              primarText="Change API key"
              secondaryText="Play with a different API key or change into development mode"
              onClick={handleChangeKey}
            />
          </List>
        </Box>
      </Paper>
    </Drawer>
  );
};
