import {
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  finishRound,
  getActiveMap,
  getCurrRoundNum,
  getRoundScores,
  isFinished,
} from '../../redux/game';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getInitialPosition } from '../../redux/position';
import { SlimContainer } from '../../styles';
import { formatDist } from '../../utils';
import GoogleMap, { MapMode } from '../google/google.map';

export default function RoundEnd() {
  const dispatch = useAppDispatch();

  const scores = useAppSelector(getRoundScores);
  const currentRound = useAppSelector(getCurrRoundNum);
  const initialPosition = useAppSelector(getInitialPosition);
  const activeMap = useAppSelector(getActiveMap);
  const isGameFinished = useAppSelector(isFinished);

  function handleClick() {
    dispatch(finishRound());
  }

  const text = isGameFinished
    ? 'See results!'
    : `Continue with round ${currentRound + 1}`;

  return (
    <>
      <SlimContainer>
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
      </SlimContainer>
      {initialPosition && (
        <GoogleMap
          mode={MapMode.RESULT}
          mapData={activeMap}
          scores={scores}
          initialPos={initialPosition}
        />
      )}
    </>
  );
}
