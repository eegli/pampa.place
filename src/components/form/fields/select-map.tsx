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
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import {useEffect, useMemo, useState} from 'react';
import {Constants} from '../../../config/constants';
import {MapData} from '../../../config/types';
import {PreviewDialog} from '../../feedback/dialog-preview';
import {GoogleMap} from '../../google/map';

export const FormMapSelect = () => {
  const [previewMap, setPreviewMap] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const activeMapId = useAppSelector(({game}) => game.mapId);
  const activeMapName = useAppSelector(({game}) => game.mapName);
  const map = MAPS.get(activeMapId);

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setMap(event.target.value));
  };

  useEffect(() => {
    const local =
      window.localStorage.getItem(Constants.LOCALSTORAGE_MAPS_KEY) || '{}';
    const parsedMaps = JSON.parse(local);
    if (Array.isArray(parsedMaps) && parsedMaps.length) {
      for (const map of parsedMaps) {
        try {
          MAPS.set(map.properties.id, map);
        } catch (e) {
          console.error(`Failed to add local map ${map}, ${e}`);
        }
      }
    }
  }, []);

  const categoryMap = useMemo(() => {
    const obj = Array.from(MAPS.values());
    const categories = Array.from(
      new Set(obj.map(m => m.properties.category).sort())
    );
    const categoryMap: Record<string, MapData[]> = Object.fromEntries(
      categories.map(c => [c, []])
    );
    for (const m of obj) {
      categoryMap[m.properties.category].push(m);
    }
    Object.keys(categoryMap).forEach(c => {
      categoryMap[c].sort((a, b) => {
        const curr = a.properties.name;
        const prev = b.properties.name;
        return curr > prev ? 1 : prev > curr ? -1 : 0;
      });
    });
    return categoryMap;
  }, []);

  return (
    <Box id="form-map-select">
      <FormControl fullWidth component="fieldset">
        <InputLabel>Select map</InputLabel>

        <Select
          label="Select map"
          value={activeMapId}
          onChange={handleChange}
          defaultValue=""
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
          {/* Material UI Select direct children must be MenuItem */}
          {Object.keys(categoryMap).map(category => {
            const header = (
              <ListSubheader color="inherit" key={category}>
                {category[0].toUpperCase() + category.substring(1)}
              </ListSubheader>
            );
            const children = categoryMap[category].map(m => (
              <MenuItem
                sx={{maxWidth: 330}}
                key={m.properties.id}
                value={m.properties.id}
              >
                {m.properties.name}
              </MenuItem>
            ));
            return [header, ...children];
          })}
        </Select>
      </FormControl>

      {previewMap && map && (
        <PreviewDialog
          onClose={() => setPreviewMap(false)}
          title={activeMapName}
          bodyText={`Rough bounds of the map "${activeMapName}"`}
        >
          <GoogleMap map={map} mode="preview" />
        </PreviewDialog>
      )}
    </Box>
  );
};
