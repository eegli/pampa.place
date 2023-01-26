import {PreviewDialog} from '@/components/feedback/dialog-preview';
import {MapData} from '@/config/types';
import {setMap} from '@/redux/game';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import {useMemo, useState} from 'react';
import {MAPS} from 'src/maps';
import {config} from '../../config/google';
import {GoogleMap} from '../google/google-map';

export const FormMapSelect = () => {
  const [previewMap, setPreviewMap] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const activeMapId = useAppSelector(({game}) => game.mapId);
  const map = MAPS.get(activeMapId);

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setMap(event.target.value));
  };

  const categoryMap = useMemo(() => {
    const categoryMap = Array.from(MAPS.values()).reduce((acc, curr) => {
      const existing = acc[curr.properties.category] || [];
      acc[curr.properties.category] = [...existing, curr];
      return acc;
    }, {} as Record<string, MapData[]>);

    return categoryMap;
  }, []);

  if (!map) {
    return null;
  }

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
                aria-label="preview-map-icon"
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
                {category.toUpperCase()}
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
      {previewMap && (
        <PreviewDialog
          onCloseCallback={() => setPreviewMap(false)}
          title={map.properties.name}
          text={`Rough bounds of the map "${map.properties.name}"`}
        >
          <GoogleMap
            id={`map-preview-${map.properties.id}`}
            bounds={{
              SW: map?.properties.bbLiteral.SW,
              NE: map?.properties.bbLiteral.NE,
            }}
            onMount={googleMap => {
              googleMap.setOptions(config.map.preview);
              googleMap.data.addGeoJson(map);
              googleMap.data.setStyle({
                fillColor: '#003d80',
                fillOpacity: 0.2,
                strokeWeight: 0.8,
              });
            }}
            onUnmount={map => {
              map.data.forEach(feature => {
                map.data.remove(feature);
              });
            }}
          />
        </PreviewDialog>
      )}
    </Box>
  );
};
