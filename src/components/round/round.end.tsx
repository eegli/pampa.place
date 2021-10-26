import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getRoundScores, isFinished } from '@/redux/selectors/game';
import { finishRound } from '@/redux/slices/game';
import { formatDist } from '@/utils/misc';
import {
  Box,
  Button,
  Divider,
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
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const RoundEnd = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Result" />
          <Tab label="Map" />
          <Tab label="Location" />
        </Tabs>
      </Box>{' '}
      <SlimContainer>
        <TabPanel value={value} index={0}>
          <Stack direction="column" alignItems="center" spacing={3}>
            <Typography variant="h3">Round {currentRound} is over!</Typography>
            <Divider orientation="horizontal" flexItem />
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
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box height="100%">
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
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </SlimContainer>
    </>
  );
};
export default RoundEnd;
