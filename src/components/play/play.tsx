import {GoogleStreetView} from '@/components/google/google-street-view';
import {config} from '@/config/google';
import {setPlayerScore} from '@/redux/game';
import {getActivePlayer} from '@/redux/game/selectors';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {Box, Button, ClickAwayListener} from '@mui/material';
import {useState} from 'react';
import {MAPS} from 'src/maps';
import {GoogleMap} from '../google/google-map';
import {GoogleMapPlayMarkerLayer} from '../google/overlay/play-marker-layer';
import {PlayHeader} from './play-header';

export const Play = () => {
  const dispatch = useAppDispatch();
  const [showMap, setShowMap] = useState<boolean>(false);

  const activePlayer = useAppSelector(getActivePlayer);
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

  function openMap() {
    setShowMap(true);
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
      <PlayHeader player={activePlayer} timerCallback={submitScore} />
      <ClickAwayListener onClickAway={hideMap}>
        <Box
          position="absolute"
          bottom={30}
          right={30}
          maxHeight="70%"
          maxWidth="60%"
          height={showMap ? 800 : 100}
          width={showMap ? 800 : 200}
          sx={{
            transition: '0.2s ease',
          }}
          zIndex={2}
        >
          <Box
            height="100%"
            width="100%"
            position="absolute"
            display={showMap ? 'none' : 'block'}
            zIndex={2}
            onClick={openMap}
            sx={{
              border: '2px solid',
              backdropFilter: 'blur(2px)',
            }}
          />
          <GoogleMap
            id="goole-map-play-mode"
            bounds={map.properties.bbLiteral}
            onMount={map => {
              map.setOptions(config.map.play);
            }}
          >
            <GoogleMapPlayMarkerLayer />
          </GoogleMap>
          {displaySubmitButton ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={submitScore}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '50%',
              }}
            >
              Submit
            </Button>
          ) : null}
          {showMap ? (
            <Button
              variant="contained"
              onClick={hideMap}
              sx={{
                position: 'absolute',
                bottom: 0,
                zIndex: 2,
                right: 0,
                width: displaySubmitButton ? '50%' : '100%',
              }}
            >
              {showMap ? 'Hide map' : 'Show map'}
            </Button>
          ) : null}
        </Box>
      </ClickAwayListener>
      <GoogleStreetView />
    </Box>
  );
};
