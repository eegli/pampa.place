import DarkModeIcon from '@mui/icons-material/DarkMode';
import FlagIcon from '@mui/icons-material/Flag';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleTheme } from '../redux/slices/app';
import { RootState } from '../redux/store';
import Dialog, { DialogProps } from './dialog';

export default function SpeedDialTooltipOpen() {
  const [dialog, setDialog] = useState<DialogProps>({} as DialogProps);

  const router = useRouter();

  const homeDialog: DialogProps = {
    title: 'Abort the game and return home?',
    callbackTitle: 'Abort game',
    callback: function () {
      router.push('/');
    },
    open: true,
    cancel: function () {
      setDialog({ ...dialog, open: false });
    },
  };

  const restartDialog: DialogProps = {
    title: 'Restart the game?',
    callbackTitle: 'Restart',
    callback: function () {
      router.push('/');
    },
    open: true,
    cancel: function () {
      setDialog({ ...dialog, open: false });
    },
  };

  // TODO
  const giveUpDialog: DialogProps = {
    title: 'Give up and skip round?',
    callbackTitle: 'Give up',
    callback: function () {
      router.push('/');
    },
    open: true,
    cancel: function () {
      setDialog({ ...dialog, open: false });
    },
  };

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
          sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 100 }}
          icon={<ShortcutIcon />}
        >
          <SpeedDialAction
            key="Give up"
            icon={<FlagIcon />}
            tooltipTitle="Give up"
            tooltipPlacement="right"
            onClick={() => setDialog(giveUpDialog)}
          />
          <SpeedDialAction
            key="Restart"
            icon={<RestartAltIcon />}
            tooltipTitle="Restart"
            tooltipPlacement="right"
            onClick={() => setDialog(restartDialog)}
          />
          <SpeedDialAction
            key="Home"
            icon={<HomeIcon />}
            tooltipTitle="Home"
            tooltipPlacement="right"
            onClick={() => setDialog(homeDialog)}
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
