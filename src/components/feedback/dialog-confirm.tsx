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
  onCancelCallback: () => void;
  onConfirmCallback: () => void | (() => Promise<void>);
  onConfirmTitle: string;
  message?: string;
};

export const ConfirmationDialog = ({
  title,
  onCancelCallback,
  onConfirmCallback,
  message,
  onConfirmTitle,
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={true}
      onClose={onCancelCallback}
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
        <Button onClick={onCancelCallback}>Cancel</Button>
        <Button onClick={onConfirmCallback} autoFocus>
          {onConfirmTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
