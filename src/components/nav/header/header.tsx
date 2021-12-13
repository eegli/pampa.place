import {setTheme} from '@/redux/app';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import GitHubIcon from '@mui/icons-material/GitHub';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Link,
  Paper,
  Toolbar,
} from '@mui/material';
import {useState} from 'react';
import {MenuDrawer} from '../drawer/drawer';

export const Header = () => {
  const dispatch = useAppDispatch();
  const activeTheme = useAppSelector(s => s.app.theme);
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);

  function handleToggleTheme() {
    dispatch(setTheme(activeTheme === 'light' ? 'dark' : 'light'));
  }

  function handleToggleDrawer() {
    setDrawerIsOpen(!drawerIsOpen);
  }

  return (
    <>
      <AppBar position="fixed" id="header">
        <Paper elevation={1}>
          <Toolbar sx={{py: 1}}>
            <Box sx={{flexGrow: 1}}>
              <IconButton
                onClick={handleToggleDrawer}
                size="large"
                edge="start"
                color="inherit"
                sx={{mr: 2}}
              >
                <MenuIcon />
              </IconButton>
              <MenuDrawer
                open={drawerIsOpen}
                toggleDrawer={handleToggleDrawer}
              />
            </Box>

            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{mx: 1}}
              onClick={handleToggleTheme}
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
                sx={{mx: 1}}
              >
                <GitHubIcon />
              </IconButton>
            </Link>
          </Toolbar>
        </Paper>
      </AppBar>
    </>
  );
};
