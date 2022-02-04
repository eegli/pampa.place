import {GoogleStreetView} from '@/components/google/google-street-view';
import {config} from '@/config/google';
import {setPlayerScore} from '@/redux/game';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {Box, Button, ClickAwayListener, IconButton} from '@mui/material';
import {useState} from 'react';
import {MAPS} from 'src/maps';
import {GoogleMap} from '../google/google-map';
import {GoogleMapPlayMarkerLayer} from '../google/layers/play-marker';
import {PlayHeader} from './play-header';

export const Play = () => {
  const dispatch = useAppDispatch();
  const [showMap, setShowMap] = useState<boolean>(false);

  const initialPos = useAppSelector(({position}) => position.initialPosition);
  const selectedPos = useAppSelector(({position}) => position.selectedPosition);
  const activeMapId = useAppSelector(({game}) => game.mapId);
  const map = MAPS.get(activeMapId);

  if (!map || !initialPos) {
    return null;
  }

  const displaySubmitButton = selectedPos && showMap;

  function submitScore() {
    dispatch(
      setPlayerScore({
        initial: initialPos,
        selected: selectedPos,
      })
    );
  }

  function toggleMap() {
    setShowMap(!showMap);
  }

  function hideMap() {
    if (showMap) {
      setShowMap(false);
    }
  }

  return (
    <Box
      id="play-mode"
      sx={{
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
        width: '100%',
      }}
    >
      <PlayHeader timerCallback={submitScore} />
      <ClickAwayListener onClickAway={hideMap}>
        <Box
          id="mini-map"
          role="region"
          position="absolute"
          bottom={50}
          right={30}
          maxHeight="70%"
          maxWidth="85%"
          minHeight="20%"
          minWidth="30%"
          height={showMap ? 700 : 150}
          width={showMap ? 700 : 200}
          sx={{
            transition: '0.2s ease',
          }}
          // Display on top of speed dial
          zIndex={1000}
        >
          <IconButton
            aria-label="mini-map open button"
            onClick={toggleMap}
            size="large"
            sx={{
              position: 'absolute',
              zIndex: 1000,
              display: showMap ? 'none' : 'block',
              height: '100%',
              width: '100%',
              background:
                'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))',
              borderRadius: 0,
            }}
          >
            <OpenInNewIcon fontSize="large" />
          </IconButton>
          <GoogleMap
            id="google-map-play-mode"
            bounds={map.properties.bbLiteral}
            onMount={map => {
              map.setOptions(config.map.play);
            }}
          >
            <GoogleMapPlayMarkerLayer />
          </GoogleMap>

          {showMap ? (
            <>
              <IconButton
                aria-label="mini-map close button"
                onClick={toggleMap}
                size="large"
                sx={{
                  position: 'absolute',
                  top: '2%',
                  right: '2%',
                  background:
                    'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))',
                }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
              <Button
                aria-label="location submit button"
                variant="contained"
                color={selectedPos ? 'success' : 'secondary'}
                onClick={submitScore}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                }}
              >
                {displaySubmitButton ? "I'm here!" : 'Place the marker'}
              </Button>
            </>
          ) : null}
        </Box>
      </ClickAwayListener>
      <GoogleStreetView id="google-sv-play-mode" />
    </Box>
  );
};
