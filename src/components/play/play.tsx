import {GoogleStreetView} from '@/components/google/google-street-view';
import {config} from '@/config/google';
import {setPlayerScore} from '@/redux/game';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {Box, ClickAwayListener} from '@mui/material';
import {useState} from 'react';
import {MAPS} from 'src/maps';
import {GoogleMap} from '../google/google-map';
import {GoogleMapPlayMarkerLayer} from '../google/layers/play-marker';
import {PlayHeader} from './play-header';
import {MiniMap} from './play-mini-map';

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
        <MiniMap
          enlarged={showMap}
          isPositionSelected={!!selectedPos}
          successCallback={submitScore}
          toggle={toggleMap}
        >
          <GoogleMap
            id="google-map-play-mode"
            bounds={map.properties.bbLiteral}
            onMount={map => {
              map.setOptions(config.map.play);
            }}
          >
            <GoogleMapPlayMarkerLayer />
          </GoogleMap>
        </MiniMap>
      </ClickAwayListener>
      <GoogleStreetView id="google-sv-play-mode" />
    </Box>
  );
};
