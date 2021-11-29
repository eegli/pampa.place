import {endRound} from '@/redux/game';
import {getRoundScores, isFinished} from '@/redux/game/selectors';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {formatDist} from '@/utils/misc';
import {
  Box,
  Button,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import {SyntheticEvent, useState} from 'react';
import {SlimContainer} from '../../../styles/containers';
import {GoogleMap} from '../../google/map';
import {GoogleStreetView} from '../../google/street-view';
import {TabPanel} from './tabs-panel';

export const RoundOverSummary = () => {
  const [selectedPanel, setSelectedPanel] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setSelectedPanel(newValue);
  };
  const dispatch = useAppDispatch();
  const activeMapId = useAppSelector(({game}) => game.mapId);
  const scores = useAppSelector(getRoundScores);
  const currentRound = useAppSelector(({game}) => game.rounds.current);
  const initialPosition = useAppSelector(
    ({position}) => position.initialPosition
  );

  const isGameFinished = useAppSelector(isFinished);

  const panoDescription = useAppSelector(
    ({position}) => position.panoDescription
  );

  function handleClick() {
    dispatch(endRound());
  }

  const text = isGameFinished
    ? 'See results!'
    : `Continue with round ${currentRound + 1}`;

  return (
    <>
      <Box py={2}>
        <Tabs value={selectedPanel} onChange={handleChange} centered>
          <Tab label="Result" />
          <Tab label="Map" />
          <Tab label="Street View" />
          <Tab label="Info" />
        </Tabs>
      </Box>

      <TabPanel
        selected={selectedPanel}
        index={0}
        display="flex"
        justifyContent="center"
        /*   alignItems="center" */
      >
        <SlimContainer id="round-end-table">
          <Stack
            direction="column"
            alignItems="center"
            spacing={3}
            width="100%"
            height="100%"
          >
            <Typography variant="h5" alignSelf="flex-start">
              Round {currentRound} is over!
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Distance</TableCell>
                  <TableCell align="right">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scores.map((p, idx) => (
                  <TableRow key={p.name}>
                    <TableCell component="th" scope="row">
                      {p.name}
                    </TableCell>
                    <TableCell align="right">{formatDist(p.dist)}</TableCell>
                    <TableCell align="right">{p.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={handleClick} variant="contained" color="primary">
              {text}
            </Button>
          </Stack>
        </SlimContainer>
      </TabPanel>

      <TabPanel selected={selectedPanel} index={1}>
        <Box height="100%" id="round-end-map">
          {initialPosition && (
            <GoogleMap
              mode="result"
              mapId={activeMapId}
              results={scores}
              initialPosition={initialPosition}
            />
          )}
        </Box>
      </TabPanel>

      <TabPanel selected={selectedPanel} index={2}>
        <Box height="100%" id="round-end-sv">
          <GoogleStreetView staticPos />
        </Box>
      </TabPanel>

      <TabPanel selected={selectedPanel} index={3}>
        <SlimContainer id="round-end-loc-info">
          <Typography variant="h5" alignSelf="flex-start" mb={2}>
            Location info
          </Typography>

          <Paper sx={{p: 2, mb: 1}} elevation={1}>
            Panorama description: {panoDescription}
          </Paper>
          <Paper sx={{p: 2}}>
            Coordinates (lat/lng): {initialPosition?.lat},{' '}
            {initialPosition?.lng}
          </Paper>
        </SlimContainer>
      </TabPanel>
    </>
  );
};
