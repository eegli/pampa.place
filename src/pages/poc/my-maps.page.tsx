import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {NextPage} from 'next';
import {ChangeEvent, useEffect, useState} from 'react';
import {Header} from '../../components/nav/header/header';
import {computeMapData} from '../../config/helpers/creator';
import {PageContentWrapper, SlimContainer} from '../../styles/containers';

const MyMapsPage: NextPage = () => {
  const [geoJSON, setGeoJSON] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [JSONErrMessage, setJSONErrMessage] = useState('');
  const [isValidJSON, setIsValidJSON] = useState(false);

  function handleSubmit() {
    try {
      const map = JSON.parse(geoJSON);
      map.features[0].properties.name = name;
      const d = computeMapData({map, category});
      console.info(d);
    } catch (e) {
      if (e instanceof Error) {
        setJSONErrMessage(e.message);
      }
    }
  }

  const handleCatChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };
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
              label="Category"
              placeholder="Add a category for the map"
              value={category}
              onChange={handleCatChange}
            />
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
            {name && category && isValidJSON && (
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
          TODO
        </SlimContainer>
      </PageContentWrapper>
    </>
  );
};

export default MyMapsPage;
