import {MapService} from '@/services/google';
import {alpha} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Box from '@mui/system/Box';
import {useEffect, useState} from 'react';

export const GoogleMapStreetViewCoverageLayer = () => {
  const [showCoverage, setShowCoverage] = useState<boolean>(false);

  function handleStreetViewCoverage() {
    setShowCoverage(!showCoverage);
  }

  useEffect(() => {
    if (showCoverage) {
      const coverageLayer = new google.maps.StreetViewCoverageLayer();
      coverageLayer.setMap(MapService.map);
      return () => {
        coverageLayer.setMap(null);
      };
    }
  }, [showCoverage]);

  return (
    <Box
      position="absolute"
      display="flex"
      bottom={30}
      width="100%"
      zIndex={1}
      justifyContent="center"
    >
      <FormGroup
        sx={{
          padding: '0 1rem',

          backgroundColor: ({palette}) =>
            alpha(palette.background.default, 0.6),
          borderRadius: 3,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={showCoverage}
              onChange={handleStreetViewCoverage}
            />
          }
          label="Show street view coverage"
        />
      </FormGroup>
    </Box>
  );
};
