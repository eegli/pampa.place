import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export type DialogProps = {
  open: boolean;
  title: string;
  callback: () => void | (() => Promise<void>);
  callbackTitle: string;
  cancel: () => void;
  message?: string;
};

const ConfirmationDialog = ({
  open,
  title,
  callback,
  cancel,
  message,
  callbackTitle,
}: DialogProps) => {
  // Needed for smooth unmount transitions
  if (!open) {
    return <div />;
  }
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ elevation: 2 }}
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
          <Button onClick={cancel}>Cancel</Button>
          <Button onClick={callback} autoFocus>
            {callbackTitle}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationDialog;
