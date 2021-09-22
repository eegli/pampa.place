import { Box, Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTimer } from 'src/hooks/useTimer';
import { calculateDistance } from 'src/utils';
import {
  getActiveMap,
  getActivePlayer,
  setPlayerScore,
} from '../../redux/game';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getInitialPosition, getSelectedPosition } from '../../redux/position';
import Map, { MapMode } from '../google/google.map';
import StreetView from '../google/google.street-view';
import PlayHeader from './play.header';
import { StyledMapOverlay } from './play.styles';

export default function Play() {
  const dispatch = useAppDispatch();

  const [showMap, setShowMap] = useState<boolean>(false);
  const [time, activateTimer] = useTimer();

  const activeMap = useAppSelector(getActiveMap);
  const activePlayer = useAppSelector(getActivePlayer);
  const initialPosition = useAppSelector(getInitialPosition);
  const selectedPosition = useAppSelector(getSelectedPosition);

  const memoizedSubmit = useCallback(() => {
    // Player could not set a location
    if (!selectedPosition) {
      dispatch(
        setPlayerScore({
          dist: -1,
          selected: selectedPosition,
        })
      );
      console.log('loser');
    } else if (initialPosition) {
      // Player was able to set a location
      dispatch(
        setPlayerScore({
          dist: calculateDistance(initialPosition, selectedPosition),
          selected: selectedPosition,
        })
      );
    }
    setShowMap(false);
  }, [dispatch, initialPosition, selectedPosition]);

  useEffect(() => {
    activateTimer();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <PlayHeader player={activePlayer} time={time} />
      <Box position="relative" height="100%" width="100%">
        <StyledMapOverlay pos="right" onClick={() => setShowMap(!showMap)}>
          <img src="/map.svg" alt="map-icon" />
        </StyledMapOverlay>
        {selectedPosition && (
          <StyledMapOverlay pos="left" onClick={() => setShowMap(!showMap)}>
            <Button
              size={'large'}
              variant="contained"
              color="primary"
              onClick={memoizedSubmit}
            >
              Submit
            </Button>
          </StyledMapOverlay>
        )}
        <div
          style={{
            display: showMap ? 'none' : 'block',
            height: '100%',
          }}
        >
          {initialPosition && <StreetView position={initialPosition} />}
        </div>

        <Map mode={MapMode.PLAY} mapData={activeMap} />
      </Box>
    </Box>
  );
}
