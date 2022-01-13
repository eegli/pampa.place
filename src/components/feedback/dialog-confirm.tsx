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
  onConfirm: () => void | (() => Promise<void>);
  onConfirmTitle: string;
  onCancel: () => void;
  onCancelTitle?: string;
  message?: string;
};

export const ConfirmationDialog = ({
  title,
  onConfirm,
  onCancel,
  onCancelTitle = 'Cancel',
  message,
  onConfirmTitle,
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open
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
        <Button onClick={onCancel}>{onCancelTitle}</Button>
        <Button onClick={onConfirm} autoFocus>
          {onConfirmTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
