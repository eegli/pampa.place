import {GoogleStreetView} from '@/components/google/street-view';
import {setPlayerScore} from '@/redux/game';
import {getActivePlayer} from '@/redux/game/selectors';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {Box, Button, ClickAwayListener} from '@mui/material';
import {useCallback, useState} from 'react';
import {MAPS} from 'src/maps';
import {config} from '../../config/google';
import {GoogleMapContainer} from '../google/gmap-container';
import {GoogleMapMarkerLayer} from '../google/overlay/marker-layer';
import {PlayHeader} from './play-header';

export const Play = () => {
  const dispatch = useAppDispatch();
  const [showMap, setShowMap] = useState<boolean>(false);

  const activePlayer = useAppSelector(getActivePlayer);
  const initialPos = useAppSelector(({position}) => position.initialPosition);
  const selectedPos = useAppSelector(({position}) => position.selectedPosition);
  const activeMapId = useAppSelector(({game}) => game.mapId);
  const map = MAPS.get(activeMapId);

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

  const hideMap = useCallback(() => {
    setShowMap(false);
  }, [setShowMap]);

  function displayMap() {
    setShowMap(true);
  }

  if (!map || !initialPos) {
    return null;
  }

  return (
    <Box
      id="play-mode"
      sx={{
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <PlayHeader player={activePlayer} timerCallback={submitScore} />
      <ClickAwayListener onClickAway={hideMap}>
        <Box
          position="absolute"
          bottom={50}
          right={50}
          maxHeight="80%"
          maxWidth="50%"
          height={showMap ? 800 : 200}
          width={showMap ? 800 : 200}
          sx={{
            transition: '0.3s ease',
          }}
          zIndex={2}
        >
          <Box
            height="100%"
            width="100%"
            position="absolute"
            display={showMap ? 'none' : 'block'}
            zIndex={3}
            onClick={displayMap}
            sx={{
              backdropFilter: 'blur(2px)',
            }}
          />
          <GoogleMapContainer
            id="play-map"
            bounds={map.properties.bbLiteral}
            onMount={map => {
              map.setOptions(config.map.play);
            }}
          >
            <GoogleMapMarkerLayer />
          </GoogleMapContainer>

          <Button
            variant="contained"
            onClick={toggleMap}
            sx={{
              position: 'absolute',
              zIndex: 10,
              bottom: 0,
              right: 0,
              width: '100%',
            }}
          >
            {showMap ? 'Hide map' : 'Show map'}
          </Button>
        </Box>
      </ClickAwayListener>
      <GoogleStreetView />
    </Box>
  );
};
