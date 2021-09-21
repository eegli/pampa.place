import { Button, ButtonGroup } from '@mui/material';

type FormRoundSelectProps = {
  setRounds: React.Dispatch<React.SetStateAction<number | undefined>>;
  rounds: number | undefined;
};

const roundOptions = [1, 3, 5];

export default function FormRoundSelect({
  setRounds,
  rounds,
}: FormRoundSelectProps) {
  return (
    <ButtonGroup fullWidth>
      {roundOptions.map((val, idx) => (
        <Button
          sx={{
            px: 3,
            my: 1,
            whiteSpace: 'nowrap',
          }}
          key={idx}
          size={'small'}
          color='primary'
          onClick={() => setRounds(val)}
          variant={rounds === val ? 'contained' : 'outlined'}>
          {val} {val === 1 ? 'round' : 'rounds'}
        </Button>
      ))}
    </ButtonGroup>
  );
}
