import {ConfirmationDialog} from '@/components/feedback/dialog-confirm';
import {PreviewDialog} from '@/components/feedback/dialog-preview';
import {GoogleMap} from '@/components/google/map';
import {Header} from '@/components/nav/header/header';
import {Constants} from '@/config/constants';
import {validateAndComputeGeoJSON} from '@/config/helpers/validator';
import {MAPS} from '@/config/maps';
import {LocalStorageMaps, MapData} from '@/config/types';
import {PageContentWrapper, SlimContainer} from '@/styles/containers';
import {em} from '@/styles/utils';
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
  const [localMaps, setLocalMaps] = useLocalStorage<LocalStorageMaps>(
    Constants.LOCALSTORAGE_MAPS_KEY,
    {}
  );

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

  function editMap(m: MapData) {
    setGeoJSON(JSON.stringify(m, null, 2));
    setName(m.properties.name);
  }

  function handleSubmit() {
    try {
      let feature = JSON.parse(geoJSON);
      // The parser is made for Features, not FeatureCollections. The
      // default output from hand-drawn maps on geojson.io is a
      // FeatureCollection. Only the first feature is used. Might be
      // changed later
      if (feature.type === 'FeatureCollection') {
        feature = feature.features[0];
      }
      feature.properties.name = name;
      const newMap = validateAndComputeGeoJSON(feature, 'local');
      addMap(newMap);
    } catch (e) {
      setJSONErrMessage("That doesn't look like a valid map");
    }
  }

  // This function is only called with parsed and validated geoJSON
  function addMap(m: MapData) {
    const id = m.properties.id;
    MAPS.set(id, m);
    setLocalMaps({...localMaps, [id]: m});
    // Clear input
    setGeoJSON('');
    setName('');
  }
  // Maps are deleted (and added) from (to) both local storage and the
  // global MAPS object
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

  // Debounce validation of JSON input
  useEffect(() => {
    if (geoJSON) {
      const timeOutId = setTimeout(() => {
        try {
          JSON.parse(geoJSON);
          setJSONErrMessage('');
          setIsValidJSON(true);
        } catch (e) {
          const message = 'Error parsing GeoJSON: ';
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
            Add custom maps to your collection. These maps are only saved in
            your browser. You can either paste valid GeoJSON or go to{' '}
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
            These maps are saved locally in your browser. Click on a map to
            preview the bounds.
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
                    aria-label="delete-map"
                    name="delete-map"
                    onClick={() => triggerMapDeletion(m)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <IconButton
                    edge="start"
                    aria-label="edit-map"
                    name="edit-map"
                    onClick={() => editMap(m)}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemIcon>

                <ListItemButton>
                  <ListItemText
                    onClick={() => triggerMapPreview(m)}
                    primary={m.properties.name}
                    aria-label="preview-map"
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
