import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
type MapPreviewProps = {
  title: string;
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
};

const PaperComp = ({ children }: { children: React.ReactNode }) => {
  return <Paper elevation={1}>{children}</Paper>;
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
