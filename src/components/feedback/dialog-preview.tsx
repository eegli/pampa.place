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
import {ReactNode} from 'react';

type PreviewDialogProps = {
  onCloseCallback: () => void;
  children: ReactNode;
  title: string;
  text?: string;
};

export const PreviewDialog = (props: PreviewDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {text, title, children, onCloseCallback} = props;
  return (
    <Dialog
      open={true}
      fullScreen={fullScreen}
      onClose={onCloseCallback}
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
          id={`preview-dialog`}
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
        {text && <DialogContentText p={2}>{text}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseCallback}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
