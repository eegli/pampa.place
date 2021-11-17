import {getActivePlayer} from '@/redux/game/game.selectors';
import {setPlayerScore} from '@/redux/game/game.slice';
import {useAppDispatch, useAppSelector} from '@/redux/redux.hooks';
import {Box, Button} from '@mui/material';
import {useState} from 'react';
import Map, {MapMode} from '../google/google.map';
import StreetView from '../google/google.street-view';
import PlayHeader from './play.header';
import {StyledMapOverlay} from './play.styles';

const Play = () => {
  const dispatch = useAppDispatch();
  const [showMap, setShowMap] = useState<boolean>(false);

  const activePlayer = useAppSelector(getActivePlayer);
  const initialPos = useAppSelector(({position}) => position.initialPosition);
  const selectedPos = useAppSelector(({position}) => position.selectedPosition);

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
          {initialPos && <StreetView />}
        </div>

        <Map mode={MapMode.PLAY} />
      </Box>
    </Box>
  );
};

export default Play;
