import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';

type PreviewDialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  bodyText?: string;
};

export const PreviewDialog = (props: PreviewDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {bodyText, title, children, open, onClose} = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      PaperProps={{elevation: 1}}
      sx={{
        borderRadius: 10,
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          id={`preview-dialog-${title}`}
          sx={{
            height: 600,
            maxHeight: '100%',
            width: 400,
            margin: 'auto',
            maxWidth: '90%',
          }}
        >
          {children}
        </Box>
        {bodyText && <DialogContentText p={2}>{bodyText}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
