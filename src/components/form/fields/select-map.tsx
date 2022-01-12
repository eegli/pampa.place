import {MAPS} from '@/config/maps';
import {setMap} from '@/redux/game';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
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
import {useMemo, useState} from 'react';
import {useLocalStorage} from 'usehooks-ts';
import {Constants} from '../../../config/constants';
import {MapData} from '../../../config/types';
import {GoogleMap} from '../../google/map';
import {MapPreview} from '../../google/preview';

export const FormMapSelect = () => {
  const [previewMap, setPreviewMap] = useState<boolean>(false);
  const [localMaps] = useLocalStorage<MapData[]>(
    Constants.LOCALSTORAGE_MAPS_KEY,
    []
  );
  const dispatch = useAppDispatch();

  const activeMapId = useAppSelector(({game}) => game.mapId);
  const activeMapName = useAppSelector(({game}) => game.mapName);

  const map = MAPS.get(activeMapId)!;

  const handleMapSelect = (e: SelectChangeEvent<string>) => {
    dispatch(setMap(e.target.value));
  };

  localMaps.forEach(map => {
    MAPS.set(map.properties.id, map);
  });

  const mapIds = useMemo(
    () =>
      Array.from(MAPS.values())
        .map(m => ({...m.properties}))
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
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
          {mapIds.map(m => (
            <MenuItem sx={{maxWidth: 330}} key={m.id} value={m.id}>
              {m.name || ''}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {previewMap && (
        <MapPreview
          isOpen={previewMap}
          close={() => setPreviewMap(false)}
          mapId={activeMapId}
          mapName={activeMapName}
        >
          <GoogleMap map={map} mode="preview" />
        </MapPreview>
      )}
    </Box>
  );
};
