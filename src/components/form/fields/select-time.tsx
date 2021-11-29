import {config} from '@/config/game';
import {setTimeLimit} from '@/redux/game';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {formatDur} from '@/utils/misc';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import {ChangeEvent} from 'react';

export const FormTimeLimitSelect = () => {
  const selected = useAppSelector(({game}) => game.timeLimit);
  const dispatch = useAppDispatch();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const num = parseInt(e.target.value);
    dispatch(setTimeLimit(num));
  }
  return (
    <FormControl component="fieldset" sx={{mb: 3}} id="form-timelimit">
      <FormLabel component="legend">Time limit</FormLabel>
      <RadioGroup row onChange={handleChange} name="form-time-select">
        {config.timeLimits.map(val => {
          const label = formatDur(val);
          return (
            <FormControlLabel
              key={val}
              value={val}
              checked={val === selected}
              control={<Radio checked={val === selected} />}
              label={label}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};
