import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Dispatch, ReactNode, SetStateAction } from 'react';

type MapPreviewProps = {
  title: string;
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
};

const MapPreview = ({ title, open, setIsOpen, children }: MapPreviewProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog
      open={open}
      onClose={() => setIsOpen(false)}
      fullScreen={fullScreen}
      PaperProps={{ elevation: 1 }}
      sx={{
        borderRadius: 10,
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
        <DialogContentText mt={2}>
          Rough bounds of the game location &quot;{title}&quot;.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapPreview;
