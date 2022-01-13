import {Constants} from '@/config/constants';
import {validateAndComputeGeoJSON} from '@/config/helpers/creator';
import {MAPS} from '@/config/maps';
import {MapData} from '@/config/types';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {NextPage} from 'next';
import {ChangeEvent, useEffect, useState} from 'react';
import {useLocalStorage} from 'usehooks-ts';
import {ConfirmationDialog} from '../../components/feedback/dialog-confirm';
import {PreviewDialog} from '../../components/feedback/dialog-preview';
import {GoogleMap} from '../../components/google/map';
import {Header} from '../../components/nav/header/header';
import {PageContentWrapper, SlimContainer} from '../../styles/containers';

const em = (txt: string, color: 'g' | 'v') => (
  <Box
    component="span"
    color={color === 'g' ? 'success.main' : 'secondary.main'}
  >
    <b>{txt}</b>
  </Box>
);

const MyMapsPage: NextPage = () => {
  const [localMaps, setLocalMaps] = useLocalStorage<MapData[]>(
    Constants.LOCALSTORAGE_MAPS_KEY,
    []
  );

  const [geoJSON, setGeoJSON] = useState('');
  const [name, setName] = useState('');
  const [JSONErrMessage, setJSONErrMessage] = useState('');
  const [isValidJSON, setIsValidJSON] = useState(false);
  const [mapToPreview, setMapToPreview] = useState<MapData | null>(null);
  const [mapToDelete, setMapToDelete] = useState<string | null>(null);

  function handleSubmit() {
    if (!localMaps.find(m => m.properties.name === name)) {
      try {
        const parsedMap = JSON.parse(geoJSON);
        parsedMap.features[0].properties.name = name;
        const newMap = validateAndComputeGeoJSON(
          parsedMap.features[0],
          'local'
        );
        setLocalMaps([...localMaps, newMap]);
        MAPS.set(newMap.properties.id, newMap);
      } catch (e) {
        if (e instanceof Error) {
          setJSONErrMessage(e.message);
        } else {
          setJSONErrMessage("That doesn't look like a valid map");
        }
      }
    }
  }

  function clearMap() {
    if (mapToDelete) {
      const idx = localMaps.findIndex(m => m.properties.id === mapToDelete);
      if (idx !== -1) {
        localMaps.splice(idx, 1);
      }
      setLocalMaps(localMaps);
      setMapToDelete(null);
      MAPS.delete(mapToDelete);
    }
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleJSONChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGeoJSON(event.target.value);
    // Validation is delayed
    setIsValidJSON(false);
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
          if (e instanceof SyntaxError) {
            setJSONErrMessage(e.message);
          } else {
            setJSONErrMessage('Invalid JSON input');
          }
        }
      }, 500);
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
            {localMaps.map(m => (
              <ListItem
                key={m.properties.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => setMapToDelete(m.properties.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemButton>
                  <ListItemText
                    onClick={() => setMapToPreview(m)}
                    primary={m.properties.name}
                    secondary={`id: ${m.properties.id}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {mapToPreview && (
            <PreviewDialog
              onClose={() => setMapToPreview(null)}
              title={`Local map preview`}
              bodyText={`Rough bounds of the map "${mapToPreview.properties.name}"`}
            >
              <GoogleMap map={mapToPreview} mode="preview" />
            </PreviewDialog>
          )}
          {mapToDelete && (
            <ConfirmationDialog
              title="Delete map"
              message={`Are you sure you want to delete your local map "${mapToDelete}"?`}
              onCancel={() => setMapToDelete(null)}
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
