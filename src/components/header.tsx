import HomeIcon from '@mui/icons-material/Home';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';

type HeaderProps = {
  home?: boolean;
};

const Header = ({ home }: HeaderProps) => {
  function handleClick() {
    /*   history.push('/'); */
  }

  function handleReset() {
    /*   history.push('/'); */
  }
  return (
    <>
      {/* enableColorOnDark */}
      <AppBar position="fixed" color="secondary">
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <HomeIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={handleClick}
          >
            Maps
          </Typography>
          {!home && (
            <Button color="inherit" onClick={handleReset}>
              Home
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar variant="dense" />
    </>
  );
};
export default Header;
