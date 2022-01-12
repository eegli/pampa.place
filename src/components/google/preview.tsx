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

type MapPreviewProps = {
  isOpen: boolean;
  mapName: string;
  close: () => void;
  children: React.ReactNode;
};

export const MapPreview = (props: MapPreviewProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {isOpen, mapName, children, close} = props;
  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      fullScreen={fullScreen}
      PaperProps={{elevation: 1}}
      sx={{
        borderRadius: 10,
      }}
    >
      <DialogTitle>{mapName}</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          id="map-preview"
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
        <DialogContentText p={2}>
          Rough bounds of the map &quot;{mapName}&quot;.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
