import { getTotalScores } from '@/redux/game/game.selectors';
import { useAppSelector } from '@/redux/redux.hooks';
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { SlimContainer } from '../../styles';

const RoundResult = () => {
  const result = useAppSelector(getTotalScores);

  const router = useRouter();

  function handleClick() {
    router.push('/');
  }

  return (
    <SlimContainer height="100%" justifyContent="center" breakpoint="sm">
      <Stack direction="column" alignItems="center" spacing={3}>
        <Typography variant="h3">Game over!</Typography>
        <Typography variant="h5">{result[0].name} wins 🥳</Typography>

        <Table size="small" aria-label="result-table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Total Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.map(p => (
              <TableRow key={p.name}>
                <TableCell component="th" scope="row">
                  {p.name}
                </TableCell>
                <TableCell align="right">{p.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={handleClick} variant="contained" color="primary">
          Play again
        </Button>
      </Stack>
    </SlimContainer>
  );
};
export default RoundResult;
