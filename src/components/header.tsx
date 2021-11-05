import { toggleTheme } from '@/redux/app/app.slice';
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
import { useAppDispatch, useAppSelector } from '../redux/redux.hooks';
import { RootState } from '../redux/redux.store';

const Header = () => {
  const activeTheme = useAppSelector((s: RootState) => s.app.theme);
  const dispatch = useAppDispatch();

  function handleClick() {
    dispatch(toggleTheme());
  }

  return (
    <>
      <AppBar position="fixed">
        <Paper elevation={1}>
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
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
              href="https://www.github.com/eegli/geoguesser"
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
