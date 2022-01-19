import {Dialog, DialogProps} from '@/components/feedback/dialog';
import {setTheme} from '@/redux/app';
import {resetRound} from '@/redux/game';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import RestartIcon from '@mui/icons-material/RestartAlt';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import {useRouter} from 'next/router';
import {useState} from 'react';

type DialogStateProps = Omit<DialogProps, 'onCancelCallback' | 'open'>;

export const SpeedDialNav = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const activeTheme = useAppSelector(s => s.app.theme);
  const [dialog, setDialog] = useState<DialogProps | null>(null);

  function handleToggleTheme() {
    dispatch(setTheme(activeTheme === 'light' ? 'dark' : 'light'));
  }

  function createAndSetDialog(args: DialogStateProps) {
    setDialog({
      ...args,
      onCancelCallback: () => setDialog(null),
    });
  }

  return (
    <>
      <Box
        id="speed-dial-menu-overlay"
        zIndex={100}
        position="fixed"
        bottom={30}
        left={30}
        sx={{
          height: 330,
          transform: 'translateZ(0px)',
          flexGrow: 1,
        }}
      >
        <SpeedDial
          ariaLabel="speed-dial-menu"
          sx={{position: 'absolute', bottom: 16, left: 16, zIndex: 100}}
          icon={<ShortcutIcon />}
        >
          <SpeedDialAction
            key="restart"
            aria-label="restart"
            icon={<RestartIcon />}
            tooltipTitle="Restart round"
            tooltipPlacement="right"
            onClick={() => {
              createAndSetDialog({
                title: 'Restart round?',
                infoMessage:
                  'This will reset the current round progress for all players. The first player will start the current round again in a new location.',
                confirmMessage: 'Restart round',
                onConfirmCallback: function () {
                  setDialog(null);
                  dispatch(resetRound());
                },
              });
            }}
          />
          <SpeedDialAction
            key="home"
            aria-label="home"
            icon={<HomeIcon />}
            tooltipTitle="Home"
            tooltipPlacement="right"
            onClick={() => {
              createAndSetDialog({
                title: 'Abort the game and return home?',
                infoMessage: 'This will reset the current game',
                confirmMessage: 'Abort game',
                onConfirmCallback: async function () {
                  setDialog(null);
                  await router.push('/');
                },
              });
            }}
          />
          <SpeedDialAction
            key="theme"
            aria-label="toggle-theme"
            icon={
              activeTheme === 'light' ? <DarkModeIcon /> : <LightModeIcon />
            }
            tooltipTitle={activeTheme === 'light' ? 'Lights off' : 'Lights on'}
            tooltipPlacement="right"
            onClick={handleToggleTheme}
          />
        </SpeedDial>
      </Box>

      {dialog && <Dialog {...dialog} />}
    </>
  );
};
