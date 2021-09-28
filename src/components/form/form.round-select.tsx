import { config } from '@/config/game';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setRounds } from '@/redux/slices/game';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { ChangeEvent } from 'react';

const FormRoundSelect = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(({ game }) => game.rounds.total);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value);
    dispatch(setRounds(val));
  }
  return (
    <FormControl component="fieldset" sx={{ mb: 3 }}>
      <FormLabel component="legend">Rounds</FormLabel>
      <RadioGroup row onChange={handleChange} name="row-radio-buttons-group">
        {config.rounds.map(val => {
          const label = val === 1 ? `1 Round` : `${val} Rounds`;
          return (
            <FormControlLabel
              checked={val === selected}
              key={val}
              value={val}
              control={<Radio checked={val === selected} />}
              label={label}
            />
          );
        })}
      </RadioGroup>
    </FormControl>

    /*     <ButtonGroup fullWidth>
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
    </ButtonGroup> */
  );
};

export default FormRoundSelect;
