import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMap } from '@/redux/slices/game';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import Map, { MapMode } from '../google/google.map';
import MapPreview from './form.map-preview';

type FormMapSelectProps = {
  countryMapIds: string[];
  customMapIds: string[];
};

const FormMapSelect = (props: FormMapSelectProps) => {
  const { countryMapIds, customMapIds } = props;
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
          <ListSubheader color="inherit">Custom</ListSubheader>
          {customMapIds.map(map => (
            <MenuItem sx={{ maxWidth: 330 }} key={map} value={map}>
              {map}
            </MenuItem>
          ))}

          <ListSubheader color="inherit">Countries</ListSubheader>
          {countryMapIds.map(map => (
            <MenuItem sx={{ maxWidth: 330 }} key={map} value={map}>
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
