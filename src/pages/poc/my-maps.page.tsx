import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import {ChangeEvent, useEffect, useState} from 'react';
import {useLocalStorage} from 'usehooks-ts';
import {GoogleMap} from '../../components/google/map';
import {MapPreview} from '../../components/google/preview';
import {Header} from '../../components/nav/header/header';
import {Constants} from '../../config/constants';
import {validateAndComputeGeoJSON} from '../../config/helpers/creator';
import {MapData} from '../../config/types';
import {PageContentWrapper, SlimContainer} from '../../styles/containers';

const MyMapsPage: NextPage = () => {
  const [localMaps, setLocalMaps] = useLocalStorage<MapData[]>(
    Constants.LOCALSTORAGE_MAPS_KEY,
    []
  );

  const router = useRouter();
  const [geoJSON, setGeoJSON] = useState('');
  const [name, setName] = useState('');
  const [JSONErrMessage, setJSONErrMessage] = useState('');
  const [isValidJSON, setIsValidJSON] = useState(false);
  const [previewMap, setPreviewMap] = useState<MapData | null>(null);

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
        router.reload();
      } catch (e) {
        if (e instanceof Error) {
          setJSONErrMessage(e.message);
        } else {
          setJSONErrMessage("That doesn't look like a valid map");
        }
      }
    }
  }

  function clearMap(id: string) {
    setLocalMaps(localMaps.filter(m => m.properties.id !== id));
    router.reload();
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
      <PageContentWrapper headerGutter id="docs-page">
        <SlimContainer>
          <Typography component="h1" variant="h5" gutterBottom>
            Add custom maps
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
              label="Name"
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
          <Box display="flex">
            {name && isValidJSON && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Add map
              </Button>
            )}
          </Box>
          <Divider sx={{my: 2}} light />
          <Typography component="h1" variant="h5" gutterBottom>
            Local maps
          </Typography>
          <List dense>
            {localMaps.map(m => (
              <ListItem
                key={m.properties.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => clearMap(m.properties.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={m.properties.name}
                  secondary="Preview"
                  onClick={() => setPreviewMap(m)}
                />
              </ListItem>
            ))}
          </List>
          {previewMap && (
            <MapPreview
              isOpen={!!previewMap}
              close={() => setPreviewMap(null)}
              mapName={previewMap.properties.name}
            >
              <GoogleMap map={previewMap} mode="preview" />
            </MapPreview>
          )}
        </SlimContainer>
      </PageContentWrapper>
    </>
  );
};

export default MyMapsPage;
