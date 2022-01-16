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
  infoMessage?: string;
  onCancelCallback: () => void;
  onConfirmCallback: () => void | (() => Promise<void>);
  confirmMessage?: string;
  cancelMessage?: string;
};

export const ConfirmationDialog = ({
  title,
  infoMessage,
  onCancelCallback,
  onConfirmCallback,
  confirmMessage = 'Confirm',
  cancelMessage = 'Cancel',
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={true} onClose={onCancelCallback} PaperProps={{elevation: 2}}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {infoMessage && <DialogContentText>{infoMessage}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelCallback}>{cancelMessage}</Button>
        <Button onClick={onConfirmCallback} autoFocus>
          {confirmMessage}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
