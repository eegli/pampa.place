import {Box, Drawer, List, Paper} from '@mui/material';
import {useRouter} from 'next/router';
import React from 'react';
import {CustomListItem} from './drawer-item';

type HeaderDrawerProps = {
  open: boolean;
  toggleDrawer: () => void;
};

export const HeaderDrawer = ({open, toggleDrawer}: HeaderDrawerProps) => {
  const router = useRouter();

  function handleChangeKey() {
    window.sessionStorage.clear();
    // In order to load a new API key, the page must be reloaded so
    // that Google maps can properly set the new key
    window.location.reload();
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
          {/* TODO, this is more of a temp thing now */}
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
            <CustomListItem primarText="How to play" />
            <CustomListItem primarText="Customization guide" />
            <CustomListItem primarText="About &amp; Privacy" />
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
