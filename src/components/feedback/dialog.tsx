import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export type DialogProps = {
  title: string;
  infoMessage: string;
  onCancelCallback: () => void;
  onConfirmCallback: () => void;
  confirmMessage?: string;
  cancelMessage?: string;
};

export const Dialog = ({
  title,
  infoMessage,
  onCancelCallback,
  onConfirmCallback,
  confirmMessage = 'Confirm',
  cancelMessage = 'Cancel',
}: DialogProps) => {
  return (
    <MuiDialog open onClose={onCancelCallback} PaperProps={{elevation: 1}}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{infoMessage}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{mb: 2, justifyContent: 'space-evenly'}}>
        <Button onClick={onCancelCallback}>{cancelMessage}</Button>
        <Button variant="contained" onClick={onConfirmCallback} autoFocus>
          {confirmMessage}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
};
