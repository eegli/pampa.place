import {MAP_IDS} from '@/config/maps';
import {setMap} from '@/redux/game/game.slice';
import {useAppDispatch, useAppSelector} from '@/redux/redux.hooks';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {useState} from 'react';
import GoogleMap from '../google/google.map';

const FormMapSelect = () => {
  const [previewMap, setPreviewMap] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const activeMapId = useAppSelector(({game}) => game.mapId);
  const activeMapName = useAppSelector(({game}) => game.mapName);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMapSelect = (e: SelectChangeEvent<string>) => {
    dispatch(setMap(e.target.value));
  };

  return (
    <Box id="form-map-select">
      <FormControl fullWidth component="fieldset">
        <InputLabel>Select map</InputLabel>
        <Select
          value={activeMapId}
          label="Select map"
          onChange={handleMapSelect}
          MenuProps={{
            style: {padding: 0},
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          }}
          endAdornment={
            <InputAdornment position="start">
              <IconButton
                onClick={() => setPreviewMap(!previewMap)}
                edge="end"
                sx={{mr: 1}}
                data-testid="map-preview-button"
              >
                <Tooltip title="Preview map">
                  <VisibilityIcon />
                </Tooltip>
              </IconButton>
            </InputAdornment>
          }
        >
          {/*  <ListSubheader color="inherit">Maps</ListSubheader> */}
          {MAP_IDS.map(map => (
            <MenuItem sx={{maxWidth: 330}} key={map.id} value={map.id}>
              {map.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {previewMap && (
        <Dialog
          open={previewMap}
          onClose={() => setPreviewMap(false)}
          fullScreen={fullScreen}
          PaperProps={{elevation: 1}}
          sx={{
            borderRadius: 10,
          }}
        >
          <DialogTitle>{activeMapName}</DialogTitle>
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
              }}
            >
              <GoogleMap mapId={activeMapId} mode="preview" />
            </Box>
            <DialogContentText py={2}>
              Rough bounds of the map &quot;{activeMapName}&quot;.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewMap(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default FormMapSelect;
