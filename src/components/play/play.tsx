import {setPlayerScore} from '@/redux/game';
import {getActivePlayer} from '@/redux/game/selectors';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {Box, Button} from '@mui/material';
import {useState} from 'react';
import {GoogleMap} from '../google/map';
import {GoogleStreetView} from '../google/street-view';
import {PlayHeader} from './header';
import {StyledMapOverlay} from './styles';

export const Play = () => {
  const dispatch = useAppDispatch();
  const [showMap, setShowMap] = useState<boolean>(false);

  const activePlayer = useAppSelector(getActivePlayer);
  const initialPos = useAppSelector(({position}) => position.initialPosition);
  const selectedPos = useAppSelector(({position}) => position.selectedPosition);
  const activeMapId = useAppSelector(({game}) => game.mapId);

  function submitScore() {
    dispatch(
      setPlayerScore({
        initial: initialPos,
        selected: selectedPos,
      })
    );
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
        <StyledMapOverlay pos="map" onClick={() => setShowMap(!showMap)}>
          {/* eslint-disable-next-line  @next/next/no-img-element */}
          <img src="/map.svg" alt="map-icon" />
        </StyledMapOverlay>

        <StyledMapOverlay pos="submit" onClick={() => setShowMap(!showMap)}>
          <Button
            size={'large'}
            variant="contained"
            color="secondary"
            onClick={submitScore}
            disabled={!selectedPos}
          >
            Submit
          </Button>
        </StyledMapOverlay>

        <div
          style={{
            display: showMap ? 'none' : 'block',
            height: '100%',
          }}
        >
          {initialPos && <GoogleStreetView />}
        </div>

        <GoogleMap mapId={activeMapId} mode="play" />
      </Box>
    </Box>
  );
};
