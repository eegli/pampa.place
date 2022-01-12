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
      router.push(route);
    } else {
      toggleDrawer();
    }
  }

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer}>
      <Paper elevation={3} sx={{height: '100%'}}>
        <Box p={2} width="100%" maxWidth="17rem">
          <List>
            <CustomListItem
              primarText="Home"
              onClick={() => handleRouteChange('/')}
            />
            <CustomListItem
              primarText="Preview maps"
              secondaryText="Check the shape of your maps and their Street View coverage"
              onClick={() => handleRouteChange('/preview')}
            />
            <CustomListItem
              primarText="My maps"
              secondaryText="Quickly add and edit your maps"
              onClick={() => handleRouteChange('/poc/my-maps')}
            />
            <CustomListItem
              primarText="How to play"
              onClick={() => handleRouteChange('/docs#how-to-play')}
            />
            <CustomListItem
              primarText="Customization guide"
              onClick={() => handleRouteChange('/docs#customization-guide')}
            />
            <CustomListItem
              primarText="About &amp; Privacy"
              onClick={() => handleRouteChange('/docs#about-privacy')}
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
