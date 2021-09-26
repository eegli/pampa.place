import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getActivePlayer } from '@/redux/selectors/game';
import { setPlayerScore } from '@/redux/slices/game';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import Map, { MapMode } from '../google/google.map';
import StreetView from '../google/google.street-view';
import PlayHeader from './play.header';
import { StyledMapOverlay } from './play.styles';

export default function Play() {
  const dispatch = useAppDispatch();
  const [showMap, setShowMap] = useState<boolean>(false);

  const activeMap = useAppSelector(({ game }) => game.map);
  const activePlayer = useAppSelector(getActivePlayer);
  const initialPos = useAppSelector(({ position }) => position.initialPosition);
  const selectedPos = useAppSelector(
    ({ position }) => position.selectedPosition
  );

  function submitScore() {
    dispatch(
      setPlayerScore({
        initial: initialPos,
        selected: selectedPos,
      })
    );
    console.log('loser');
  }

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
      <PlayHeader player={activePlayer} timerCallback={submitScore} />
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
              onClick={submitScore}
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
