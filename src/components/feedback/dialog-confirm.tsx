import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export type ConfirmationDialogProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | (() => Promise<void>);
  onConfirmTitle: string;
  onCancelTitle?: string;
  message?: string;
};

export const ConfirmationDialog = ({
  title,
  open,
  onClose,
  onConfirm,
  onCancelTitle = 'Cancel',
  message,
  onConfirmTitle,
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{elevation: 2}}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      {message && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose}>{onCancelTitle}</Button>
        <Button onClick={onConfirm} autoFocus>
          {onConfirmTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
