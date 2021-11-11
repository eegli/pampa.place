import { toggleTheme } from '@/redux/app/app.slice';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import GitHubIcon from '@mui/icons-material/GitHub';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Toolbar,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/redux.hooks';
import { RootState } from '../redux/redux.store';

const Header = () => {
  const activeTheme = useAppSelector((s: RootState) => s.app.theme);
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const router = useRouter();

  function handleClick() {
    dispatch(toggleTheme());
  }

  function handleChangeKey() {
    window.sessionStorage.removeItem('gapikey');
    // In order to load a new API key, the page must be reloaded so
    // that Google maps can properly set the new key
    window.location.reload();
  }

  return (
    <>
      <AppBar position="fixed">
        <Paper elevation={1}>
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <IconButton
                onClick={() => setDrawerIsOpen(true)}
                size="large"
                edge="start"
                color="inherit"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerIsOpen}
                onClose={() => setDrawerIsOpen(false)}
              >
                <Box p={2}>
                  {/* TODO */}
                  <List>
                    {[
                      'How to play',
                      'Customization guide',
                      'About',
                      'Privacy',
                    ].map(text => (
                      <ListItem
                        button
                        key={text}
                        onClick={() => setDrawerIsOpen(false)}
                      >
                        <ListItemText
                          primary={text}
                          secondary={'Coming soon!'}
                        />
                      </ListItem>
                    ))}
                    <ListItem
                      button
                      key={'Change API key'}
                      onClick={handleChangeKey}
                      id="item 4"
                      sx={{
                        width: '100%',
                        maxWidth: '15rem',
                      }}
                    >
                      <ListItemText
                        primary="Change API key"
                        secondary="Play with a different API key or change into development mode"
                      />
                    </ListItem>
                    <ListItem
                      button
                      key={'Markdown'}
                      onClick={() => router.push('/markdown')}
                      id="item 4"
                      sx={{
                        width: '100%',
                        maxWidth: '15rem',
                      }}
                    >
                      <ListItemText primary="Markdown test" />
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </Box>

            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mx: 1 }}
              onClick={handleClick}
            >
              {activeTheme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <Divider orientation="vertical" variant="middle" flexItem />
            <Link
              href="https://github.com/eegli/pampa.place"
              target="_blank"
              rel="noopener"
              color="text.primary"
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                sx={{ mx: 1 }}
              >
                <GitHubIcon />
              </IconButton>
            </Link>
          </Toolbar>
        </Paper>
      </AppBar>
      <Toolbar sx={{ py: 1 }} />
    </>
  );
};
export default Header;
