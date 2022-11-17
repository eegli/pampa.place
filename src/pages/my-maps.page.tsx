import {Dialog} from '@/components/feedback/dialog';
import {PreviewDialog} from '@/components/feedback/dialog-preview';
import {GoogleMap} from '@/components/google/google-map';
import {Header} from '@/components/header/header';
import {config} from '@/config/google';
import type {MapData} from '@/config/types';
import {parseUserGeoJSON} from '@/maps/helpers/parser';
import {PageContent, SlimContainer} from '@/styles/containers';
import {colorize} from '@/styles/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {NextPage} from 'next';
import {ChangeEvent, useEffect, useState} from 'react';
import {MAPS} from 'src/maps';
import {CustomHead} from '../components/head/custom-head';
import {useLocalStorageMaps} from '@/hooks/useLocalStorageMaps';

export const MyMapsPage: NextPage = () => {
  const [localMaps, addLocalMap, removeLocalMap] = useLocalStorageMaps();
  const [geoJSON, setGeoJSON] = useState('');
  const [name, setName] = useState('');
  const [JSONErrMessage, setJSONErrMessage] = useState('');
  const [isValidJSON, setIsValidJSON] = useState(false);
  const [mapToPreview, setMapToPreview] = useState<MapData | null>(null);
  const [mapToDelete, setMapToDelete] = useState<MapData | null>(null);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleJSONChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGeoJSON(event.target.value);
  };

  function editMap(mapData: MapData) {
    setGeoJSON(JSON.stringify(mapData, null, 2));
    setName(mapData.properties.name);
  }

  function handleSubmit() {
    try {
      const newMap = parseUserGeoJSON(geoJSON, name, 'local');
      addMap(newMap);
    } catch (e) {
      setJSONErrMessage("That doesn't look like a valid map");
    }
  }

  // This function is only called with parsed and validated geoJSON
  function addMap(mapData: MapData) {
    MAPS.set(mapData.properties.id, mapData);
    addLocalMap(mapData);
    // Clear input
    setGeoJSON('');
    setName('');
  }
  // Maps are deleted (and added) from (to) both local storage and the
  // global MAPS object
  function deleteMap(mapId: string) {
    removeLocalMap(mapId);
    MAPS.delete(mapId);
    setMapToDelete(null);
  }

  // Debounce validation of JSON input
  useEffect(() => {
    if (!geoJSON) return;
    const timeOutId = setTimeout(() => {
      try {
        JSON.parse(geoJSON);
        setJSONErrMessage('');
        setIsValidJSON(true);
      } catch (error) {
        const message = 'Parsing error: ';
        if (error instanceof SyntaxError) {
          setJSONErrMessage(message + error.message);
        } else {
          setJSONErrMessage(message + 'Invalid input');
        }
      }
    }, 800);
    return () => clearTimeout(timeOutId);
  }, [geoJSON]);

  return (
    <>
      <CustomHead title="my maps" />
      <Header />
      <PageContent headerGutter id="my-maps-page">
        <SlimContainer>
          <Typography component="h1" variant="h5" gutterBottom>
            My Maps
          </Typography>
          <Typography gutterBottom variant="body1" color="text.secondary">
            Add custom maps to your collection. These maps are only saved in
            your browser. You can either paste valid GeoJSON or go to{' '}
            <Link target={'_blank'} href="https://geojson.io/">
              geojson.io
            </Link>
            , draw a polygon and paste it below. <br />
            <br />
            Note that only GeoJSON objects of type {colorize(
              'Polygon',
              'g'
            )}{' '}
            and {colorize('Multipolygon', 'g')} are allowed. For GeoJSON objects
            of type {colorize('FeatureCollection', 'v')}, only the first feature
            will saved.
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            display="flex"
            flexDirection="column"
          >
            <TextField
              margin="normal"
              label="Map name"
              placeholder="Add a display name for the map"
              value={name}
              onChange={handleNameChange}
            />
            <TextField
              margin="normal"
              multiline
              label="GeoJSON"
              rows={8}
              value={geoJSON}
              onChange={handleJSONChange}
              error={!!JSONErrMessage}
              helperText={JSONErrMessage}
            />
          </Box>

          {name && isValidJSON && (
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                sx={{my: 2}}
                color="primary"
                onClick={handleSubmit}
              >
                Add map
              </Button>
            </Box>
          )}

          <Divider sx={{my: 2}} light />
          <Typography component="h1" variant="h5" gutterBottom>
            Local maps
          </Typography>
          <Typography gutterBottom variant="body1" color="text.secondary">
            Click on a map to get a preview.
          </Typography>
          <List dense id="local-maps-list">
            {Object.keys(localMaps).length === 0 && (
              <Typography color="text.secondary">
                <i>Beep bop no local maps 🤖</i>
              </Typography>
            )}
            {Object.values(localMaps).map(m => (
              <ListItem
                key={m.properties.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete-map-icon"
                    name="delete-map-icon"
                    onClick={() => setMapToDelete(m)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <IconButton
                    edge="start"
                    aria-label="edit-map-icon"
                    name="edit-map-icon"
                    onClick={() => editMap(m)}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemIcon>

                <ListItemButton
                  aria-label="preview-map-btn"
                  onClick={() => setMapToPreview(m)}
                >
                  <ListItemText
                    primary={m.properties.name}
                    secondary={`id: ${m.properties.id}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {mapToPreview && (
            <PreviewDialog
              onCloseCallback={() => setMapToPreview(null)}
              title={`Local map preview`}
              text={`Rough bounds of the map "${mapToPreview.properties.name}"`}
            >
              <GoogleMap
                id={`map-preview-${mapToPreview.properties.id}`}
                bounds={mapToPreview.properties.bbLiteral}
                onMount={googleMap => {
                  googleMap.setOptions(config.map.preview);
                  googleMap.data.addGeoJson(mapToPreview);
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

          {mapToDelete && (
            <Dialog
              onCancelCallback={() => setMapToDelete(null)}
              onConfirmCallback={() =>
                mapToDelete && deleteMap(mapToDelete.properties.id)
              }
              title="Delete map"
              infoMessage={`Are you sure you want to delete your local map "${mapToDelete.properties.name}"?`}
              confirmMessage="Delete map"
            />
          )}
        </SlimContainer>
      </PageContent>
    </>
  );
};

export default MyMapsPage;
