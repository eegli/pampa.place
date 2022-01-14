import {ConfirmationDialog} from '@/components/feedback/dialog-confirm';
import {PreviewDialog} from '@/components/feedback/dialog-preview';
import {GoogleMap} from '@/components/google/map';
import {Header} from '@/components/nav/header/header';
import {Constants} from '@/config/constants';
import {validateAndComputeGeoJSON} from '@/config/helpers/validator';
import {MAPS} from '@/config/maps';
import {MapData} from '@/config/types';
import {PageContentWrapper, SlimContainer} from '@/styles/containers';
import {em} from '@/styles/utils';
import {toFeatureCollection} from '@/utils/geo';
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
import {useLocalStorage} from 'usehooks-ts';

/* EXPERIMENTAL */

export const MyMapsPage: NextPage = () => {
  const [localMaps, setLocalMaps] = useLocalStorage<Record<string, MapData>>(
    Constants.LOCALSTORAGE_MAPS_KEY,
    {}
  );

  const [geoJSON, setGeoJSON] = useState('');
  const [name, setName] = useState('');
  const [JSONErrMessage, setJSONErrMessage] = useState('');
  const [isValidJSON, setIsValidJSON] = useState(false);
  const [mapToPreview, setMapToPreview] = useState<MapData | null>(null);
  const [mapToDelete, setMapToDelete] = useState<MapData | null>(null);

  function handleSubmit() {
    try {
      const parsedMap = JSON.parse(geoJSON);
      parsedMap.features[0].properties.name = name;
      const newMap = validateAndComputeGeoJSON(parsedMap.features[0], 'local');
      addMap(newMap);
    } catch (e) {
      setJSONErrMessage("That doesn't look like a valid map");
    }
  }

  // Maps are added to both local storage and the global MAPS object
  function addMap(m: MapData) {
    const id = m.properties.id;
    setLocalMaps({...localMaps, [id]: m});
    MAPS.set(id, m);
    // CLear input
    setGeoJSON('');
    setName('');
  }
  // Maps are also deleted from both local storage and the global MAPS
  // object
  function clearMap() {
    if (mapToDelete) {
      const id = mapToDelete.properties.id;
      delete localMaps[id];
      setLocalMaps(localMaps);
      MAPS.delete(id);
      setMapToDelete(null);
    }
  }

  // Clicking "delete" sets the state so that the dialog is shown and
  // knows what map to delete upon confirmation
  function triggerMapDeletion(m: MapData) {
    setMapToDelete(m);
  }

  // Same thing
  function triggerMapPreview(m: MapData) {
    setMapToPreview(m);
  }

  // Dialog cancel callbacks
  function closePreview() {
    setMapToPreview(null);
  }
  function closeDeletionDialog() {
    setMapToDelete(null);
  }

  // Input maps are a FeatureCollection but stored as Feature. Restore
  // the FeatureCollection object
  function editMap(m: MapData) {
    const collection = toFeatureCollection(m);
    setGeoJSON(JSON.stringify(collection, null, 2));
    setName(m.properties.name);
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleJSONChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGeoJSON(event.target.value);
  };

  // Debounce validation of JSON input
  useEffect(() => {
    if (geoJSON) {
      const timeOutId = setTimeout(() => {
        try {
          JSON.parse(geoJSON);
          setJSONErrMessage('');
          setIsValidJSON(true);
        } catch (e) {
          let message = 'Error parsing GeoJSON: ';
          if (e instanceof SyntaxError) {
            setJSONErrMessage(message + e.message);
          } else {
            setJSONErrMessage(message + 'Invalid input');
          }
        }
      }, 800);
      return () => clearTimeout(timeOutId);
    }
  }, [geoJSON]);

  return (
    <>
      <Header />
      <PageContentWrapper headerGutter id="my-maps-page">
        <SlimContainer>
          <Typography component="h1" variant="h5" gutterBottom>
            My Maps
          </Typography>
          <Typography gutterBottom variant="body1" color="text.secondary">
            Add custom maps to your collection. These maps only live in your
            browser. You can either paste valid GeoJSON or go to{' '}
            <Link target={'_blank'} href="https://geojson.io/">
              geojson.io
            </Link>
            , draw a polygon and paste it below. <br />
            <br />
            Note that only GeoJSON objects of type {em('Polygon', 'g')} and{' '}
            {em('Multipolygon', 'g')} are allowed. For GeoJSON objects of type{' '}
            {em('FeatureCollection', 'v')}, only the first feature will saved.
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
              </Button>{' '}
            </Box>
          )}

          <Divider sx={{my: 2}} light />
          <Typography component="h1" variant="h5" gutterBottom>
            Local maps
          </Typography>
          <Typography gutterBottom variant="body1" color="text.secondary">
            These maps are saved locally in your browser. They&apos;re only
            yours. Click on a map to preview the bounds.
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
                    aria-label="delete"
                    onClick={() => triggerMapDeletion(m)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <IconButton
                    edge="start"
                    aria-label="edit"
                    onClick={() => editMap(m)}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemIcon>

                <ListItemButton>
                  <ListItemText
                    onClick={() => triggerMapPreview(m)}
                    primary={m.properties.name}
                    secondary={`id: ${m.properties.id}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {mapToPreview && (
            <PreviewDialog
              onClose={closePreview}
              title={`Local map preview`}
              bodyText={`Rough bounds of the map "${mapToPreview.properties.name}"`}
            >
              <GoogleMap map={mapToPreview} mode="preview" />
            </PreviewDialog>
          )}
          {mapToDelete && (
            <ConfirmationDialog
              title="Delete map"
              message={`Are you sure you want to delete your local map "${mapToDelete.properties.name}"?`}
              onCancel={closeDeletionDialog}
              onConfirm={clearMap}
              onConfirmTitle="Delete map"
            />
          )}
        </SlimContainer>
      </PageContentWrapper>
    </>
  );
};

export default MyMapsPage;
