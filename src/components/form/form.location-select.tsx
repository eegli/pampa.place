import config, { MapData } from '@config';
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

type FormLocationSelectProps = {
  setMap: React.Dispatch<React.SetStateAction<MapData | undefined>>;
  map: MapData | undefined;
};

export default function FormLocationSelect({
  setMap,
  map,
}: FormLocationSelectProps) {
  const [previewMap, setPreviewMap] = useState<boolean>(false);

  const handleMapSelect = (e: SelectChangeEvent<string>) => {
    const idx = config.maps.findIndex(l => l.name === e.target.value);
    setMap(config.maps[idx]);
  };

  if (map?.name) {
    return (
      <Box>
        <FormControl fullWidth>
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
            {config.maps.map(loc => (
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
              <Map mode={MapMode.PREVIEW} mapData={map || config.maps[0]} />
            </Box>
          </MapPreview>
        )}
      </Box>
    );
  }
  return <Spinner />;
}
