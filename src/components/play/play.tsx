import {GoogleMap} from '@/components/google/map';
import {GoogleStreetView} from '@/components/google/street-view';
import {MAPS} from '@/config/maps';
import {setPlayerScore} from '@/redux/game';
import {getActivePlayer} from '@/redux/game/selectors';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {Box, Button} from '@mui/material';
import {BoxProps} from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {useState} from 'react';
import {PlayHeader} from './play-header';

interface StyledMapOverlayProps extends BoxProps {
  pos: 'map' | 'submit';
}
const StyledMapOverlay = styled(Box)<StyledMapOverlayProps>(({pos}) => ({
  zIndex: 10,
  position: 'fixed',
  width: '4rem',
  bottom: pos === 'map' ? 40 : 130,
  right: pos === 'map' ? 70 : 90,
  '&:hover': {
    cursor: 'pointer',
  },
}));

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

  if (!map || !initialPos) {
    return null;
  }

  return (
    <Box
      id="play-mode"
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
          <img aria-label="map-toggle" src="/map.svg" alt="map-icon" />
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
        <GoogleStreetView display={showMap ? 'none' : 'block'} />
        <GoogleMap map={map} mode="play" />
      </Box>
    </Box>
  );
};
