import { MAP_IDS } from '@/config/maps';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
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
import { setMap } from '../../redux/slices/game';
import Map, { MapMode } from '../google/google.map';
import MapPreview from './form.map-preview';

const FormMapSelect = () => {
  const [previewMap, setPreviewMap] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const activeMapId = useAppSelector(({ game }) => game.mapId);
  const activeMapName = useAppSelector(({ game }) => game.mapName);

  const handleMapSelect = (e: SelectChangeEvent<string>) => {
    dispatch(setMap(e.target.value));
  };

  return (
    <Box>
      <FormControl fullWidth component="fieldset">
        <InputLabel>Select map</InputLabel>
        <Select
          id="form-map-select"
          value={activeMapId}
          label="Select map"
          onChange={handleMapSelect}
          MenuProps={{
            style: { padding: 0 },
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
                sx={{ mr: 1 }}
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
            <MenuItem sx={{ maxWidth: 330 }} key={map.id} value={map.id}>
              {map.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {previewMap && (
        <MapPreview
          title={activeMapName}
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
