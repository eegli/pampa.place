import { config } from '@/config/game';
import { setRounds } from '@/redux/game/game.slice';
import { useAppDispatch, useAppSelector } from '@/redux/redux.hooks';
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
  );
};

export default FormRoundSelect;
