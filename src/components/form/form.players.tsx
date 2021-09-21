import RoomIcon from '@mui/icons-material/Room';
import { Box, Fade, InputAdornment, TextField } from '@mui/material';
import config from '../../config';
import { max } from '../../utils';

type FormPlayerProps = {
  players: string[];
  inputError: boolean;
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
};

const MAX_PLAYERS = config.defaults.game.maxPlayers;

export default function FormPlayers({
  players,
  inputError,
  setPlayers,
}: FormPlayerProps) {
  const handlePlayerChange =
    (inputId: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const existing = players.filter(Boolean);
      existing[inputId] = e.target.value;
      setPlayers(existing);
    };

  const handleFocusInput = (isLast: boolean) => {
    const existing = players.filter(Boolean);
    if (isLast) {
      existing.push('');
      setPlayers(existing);
    } else {
      setPlayers(existing);
    }
  };

  return (
    <Box display='flex' flexDirection='column'>
      {/* Always have an additional input field to write to */}
      {Array.from({ length: max(players.length + 1, MAX_PLAYERS) }).map(
        (_, idx) => {
          const isLast = players.length === idx;

          return (
            <Fade in timeout={500} key={idx}>
              <TextField
                sx={{
                  mb: 3,
                  '&:last-child': {
                    mb: 0,
                  },
                }}
                required={idx === 0}
                key={`p${idx}`}
                type='text'
                placeholder='Player name'
                value={players[idx] || ''}
                label={`Player ${idx + 1}`}
                /*  onMouseOver={() => console.log(players.length === idx)} */
                onFocus={() => handleFocusInput(isLast)}
                onInput={() => handleFocusInput(isLast)}
                onBlur={() => handleFocusInput(isLast)}
                onChange={handlePlayerChange(idx)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <RoomIcon style={{ color: config.markers[idx] }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Fade>
          );
        }
      )}
    </Box>
  );
}
