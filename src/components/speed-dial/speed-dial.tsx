import {toggleTheme} from '@/redux/app/app.slice';
import {resetRound} from '@/redux/game/game.slice';
import {useAppDispatch, useAppSelector} from '@/redux/redux.hooks';
import {RootState} from '@/redux/redux.store';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FlagIcon from '@mui/icons-material/Flag';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import {useRouter} from 'next/router';
import {useState} from 'react';
import Dialog, {DialogProps} from './dialog';

export default function SpeedDialTooltipOpen() {
  const [dialog, setDialog] = useState<DialogProps>({} as DialogProps);

  const router = useRouter();

  const activeTheme = useAppSelector((s: RootState) => s.app.theme);
  const dispatch = useAppDispatch();

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
          ariaLabel="SpeedDial tooltip example"
          sx={{position: 'absolute', bottom: 16, left: 16, zIndex: 100}}
          icon={<ShortcutIcon />}
        >
          <SpeedDialAction
            key="Give up"
            icon={<FlagIcon />}
            tooltipTitle="Give up"
            tooltipPlacement="right"
            onClick={() =>
              setDialog({
                title: 'Give up and skip round?',
                callbackTitle: 'Give up',
                callback: function () {
                  router.push('/');
                },
                open: true,
                cancel: function () {
                  setDialog({...dialog, open: false});
                },
              })
            }
          />
          <SpeedDialAction
            key="Restart"
            icon={<RestartAltIcon />}
            tooltipTitle="Restart round"
            tooltipPlacement="right"
            onClick={() =>
              setDialog({
                title: 'Restart round?',
                message:
                  'This will reset the current round progress for all players. The first player will start the current round again in a new location.',
                callbackTitle: 'Restart round',
                callback: function () {
                  dispatch(resetRound());
                  setDialog({...dialog, open: false});
                },
                open: true,
                cancel: function () {
                  setDialog({...dialog, open: false});
                },
              })
            }
          />
          <SpeedDialAction
            key="Home"
            icon={<HomeIcon />}
            tooltipTitle="Home"
            tooltipPlacement="right"
            onClick={() =>
              setDialog({
                title: 'Abort the game and return home?',
                callbackTitle: 'Abort game',
                callback: function () {
                  router.push('/');
                },
                open: true,
                cancel: function () {
                  setDialog({...dialog, open: false});
                },
              })
            }
          />
          <SpeedDialAction
            key="Mode"
            icon={
              activeTheme === 'light' ? <DarkModeIcon /> : <LightModeIcon />
            }
            tooltipTitle={activeTheme === 'light' ? 'Lights off' : 'Lights on'}
            tooltipPlacement="right"
            onClick={() => dispatch(toggleTheme())}
          />
        </SpeedDial>
      </Box>
      <Dialog {...dialog} />
    </>
  );
}
