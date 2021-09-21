import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type MapPreviewProps = {
  title: string;
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
};

export default function MapPreview({
  title,
  open,
  setIsOpen,
  children,
}: MapPreviewProps) {
  return (
    <Dialog open={open} onClose={() => setIsOpen(false)}>
      <DialogTitle>{title} - Map preview</DialogTitle>
      <DialogContent>
        {children}
        <DialogContentText mt={2}>
          Rough bounds of the game location &quot{title}&quot.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
