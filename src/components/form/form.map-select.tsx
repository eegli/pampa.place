import { mapIds } from '@/config/maps';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMap } from '@/redux/slices/game';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import Map, { MapMode } from '../google/google.map';
import MapPreview from './form.map-preview';

const FormMapSelect = () => {
  const [previewMap, setPreviewMap] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const activeMapId = useAppSelector(({ game }) => game.mapId);

  const handleMapSelect = (e: SelectChangeEvent<string>) => {
    dispatch(setMap(e.target.value));
  };

  return (
    <Box>
      <FormControl fullWidth component="fieldset">
        <InputLabel>Select map</InputLabel>
        <Select
          value={activeMapId}
          label="Select map"
          onChange={handleMapSelect}
          endAdornment={
            <InputAdornment position="start">
              <IconButton
                onClick={() => setPreviewMap(!previewMap)}
                edge="end"
                sx={{ mr: 1 }}
              >
                <Tooltip title="Preview map">
                  <VisibilityIcon />
                </Tooltip>
              </IconButton>
            </InputAdornment>
          }
        >
          {mapIds.map(map => (
            <MenuItem key={map} value={map}>
              {map}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {previewMap && (
        <MapPreview
          title={activeMapId}
          open={previewMap}
          setIsOpen={setPreviewMap}
        >
          <Box height={500}>
            <Map mode={MapMode.PREVIEW} activeMapId={activeMapId} />
          </Box>
        </MapPreview>
      )}
    </Box>
  );
};

export default FormMapSelect;
