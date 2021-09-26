import { config } from '@/config/game';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setRounds } from '@/redux/slices/game';
import { Button, ButtonGroup } from '@mui/material';

export default function FormRoundSelect() {
  const dispatch = useAppDispatch();
  const totalRoundCount = useAppSelector(({ game }) => game.rounds.total);
  return (
    <ButtonGroup fullWidth>
      {config.rounds.map(val => {
        const id = `round-${val}`;
        return (
          <Button
            sx={{
              px: 3,
              my: 1,
              whiteSpace: 'nowrap',
            }}
            id={id}
            key={id}
            size={'small'}
            color="primary"
            onClick={() => dispatch(setRounds(val))}
            variant={totalRoundCount === val ? 'contained' : 'outlined'}
          >
            {val} {val === 1 ? 'round' : 'rounds'}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}
