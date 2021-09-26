import { config } from '@/config/game';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTimeLimit } from '@/redux/slices/game';
import { formatDuration } from '@/utils/misc';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { ChangeEvent } from 'react';

export default function FormDurationSelect() {
  const selected = useAppSelector(({ game }) => game.timeLimit);
  const dispatch = useAppDispatch();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const num = parseInt(e.target.value);
    dispatch(setTimeLimit(num));
  }
  return (
    <FormControl component="fieldset" sx={{ mb: 3 }}>
      <FormLabel component="legend">Time limit</FormLabel>
      <RadioGroup row onChange={handleChange} name="row-radio-buttons-group">
        {config.timeLimits.map(val => {
          const label = formatDuration(val);
          return (
            <FormControlLabel
              key={val}
              value={val}
              checked={val === selected}
              control={<Radio />}
              label={label}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
