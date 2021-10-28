import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getRoundScores, isFinished } from '@/redux/selectors/game';
import { finishRound } from '@/redux/slices/game';
import { formatDist } from '@/utils/misc';
import {
  Box,
  Button,
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
import { SyntheticEvent, useState } from 'react';
import { SlimContainer } from '../../styles';
import GoogleMap, { MapMode } from '../google/google.map';
import GoogleStreetView from '../google/google.street-view';
import TabPanel from '../tabs-panel';

const RoundEnd = () => {
  const [selectedPanel, setSelectedPanel] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setSelectedPanel(newValue);
  };
  const dispatch = useAppDispatch();

  const scores = useAppSelector(getRoundScores);
  const currentRound = useAppSelector(({ game }) => game.rounds.current);
  const initialPosition = useAppSelector(
    ({ position }) => position.initialPosition
  );
  const activeMapId = useAppSelector(({ game }) => game.mapId);
  const isGameFinished = useAppSelector(isFinished);

  function handleClick() {
    dispatch(finishRound());
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
        alignItems="center"
      >
        <SlimContainer id="round-end-table">
          <Stack
            direction="column"
            alignItems="center"
            spacing={3}
            width="100%"
            height="100%"
          >
            <Typography variant="h4" alignSelf="flex-start">
              Round {currentRound} is over!
            </Typography>

            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="right">Distance</TableCell>
                  <TableCell align="right">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scores.map((p, idx) => (
                  <TableRow key={p.name}>
                    <TableCell component="th" scope="row" align="left">
                      {idx + 1}
                    </TableCell>
                    <TableCell align="left">{p.name}</TableCell>
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
              mode={MapMode.RESULT}
              activeMapId={activeMapId}
              scores={scores}
              initialPos={initialPosition}
            />
          )}
        </Box>
      </TabPanel>

      <TabPanel selected={selectedPanel} index={2}>
        <Box height="100%" id="round-end-map">
          {initialPosition && (
            <GoogleStreetView
              opts={{ clickToGo: false, disableDoubleClickZoom: true }}
            />
          )}
        </Box>
      </TabPanel>

      <TabPanel selected={selectedPanel} index={3}>
        <SlimContainer id="round-end-sv">
          <Typography variant="h6" alignSelf="flex-start">
            Map details
          </Typography>
        </SlimContainer>
      </TabPanel>
    </>
  );
};
export default RoundEnd;
