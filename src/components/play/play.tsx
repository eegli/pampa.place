import { Box, Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { getActivePlayer, setPlayerScore } from '../../redux/game';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Map, { MapMode } from '../google/google.map';
import StreetView from '../google/google.street-view';
import PlayHeader from './play.header';
import { StyledMapOverlay } from './play.styles';

export default function Play() {
  const dispatch = useAppDispatch();

  const [showMap, setShowMap] = useState<boolean>(false);
  const [time, activateTimer] = useTimer();

  const activeMap = useAppSelector(({ game }) => game.map);
  const activePlayer = useAppSelector(getActivePlayer);
  const initialPos = useAppSelector(({ position }) => position.initialPosition);
  const selectedPos = useAppSelector(
    ({ position }) => position.selectedPosition
  );

  const memoizedSubmit = useCallback(() => {
    dispatch(
      setPlayerScore({
        initial: initialPos,
        selected: selectedPos,
      })
    );
    console.log('loser');

    setShowMap(false);
  }, [dispatch, selectedPos, initialPos]);

  useEffect(() => {
    activateTimer();
  }, [activateTimer]);

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
        {selectedPos && (
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
          {initialPos && <StreetView />}
        </div>

        <Map mode={MapMode.PLAY} mapData={activeMap} />
      </Box>
    </Box>
  );
}
