import { mapData } from '@/config/maps';
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
import Spinner from '../spinner';
import MapPreview from './form.map-preview';

export default function FormLocationSelect() {
  const [previewMap, setPreviewMap] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const map = useAppSelector(({ game }) => game.map);

  const handleMapSelect = (e: SelectChangeEvent<string>) => {
    const idx = mapData.findIndex(l => l.name === e.target.value);
    dispatch(setMap(mapData[idx]));
  };

  if (map?.name) {
    return (
      <Box>
        <FormControl fullWidth component="fieldset">
          <InputLabel>Select map</InputLabel>
          <Select
            value={map.name}
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
            {mapData.map(loc => (
              <MenuItem key={loc.name} value={loc.name}>
                {loc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {previewMap && (
          <MapPreview
            title={map?.name}
            open={previewMap}
            setIsOpen={setPreviewMap}
          >
            <Box height={500}>
              <Map mode={MapMode.PREVIEW} mapData={map} />
            </Box>
          </MapPreview>
        )}
      </Box>
    );
  }
  return <Spinner />;
}
