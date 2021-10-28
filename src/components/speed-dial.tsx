import FlagIcon from '@mui/icons-material/Flag';
import HomeIcon from '@mui/icons-material/Home';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ConfirmationDialog, {
  ConfirmationDialogProps,
} from './confirmation-dialog';

export default function SpeedDialTooltipOpen() {
  const [dialog, setDialog] = useState<ConfirmationDialogProps>(
    {} as ConfirmationDialogProps
  );

  const router = useRouter();

  const homeDialog: ConfirmationDialogProps = {
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

  const restartDialog: ConfirmationDialogProps = {
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
  const giveUpDialog: ConfirmationDialogProps = {
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
        </SpeedDial>
      </Box>
      <ConfirmationDialog {...dialog} />
    </>
  );
}
