import { config } from '@/config/game';
import { markers } from '@/config/markers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setPlayers } from '@/redux/slices/game';
import { min } from '@/utils/misc';
import RoomIcon from '@mui/icons-material/Room';
import { Box, Fade, InputAdornment, TextField } from '@mui/material';
import { ChangeEvent } from 'react';

const MAX_PLAYERS = config.maxPlayers;

const FormPlayers = () => {
  const players = useAppSelector(({ game }) => game.players.names);
  const dispatch = useAppDispatch();

  const handlePlayerChange =
    (inputId: number) => (e: ChangeEvent<HTMLTextAreaElement>) => {
      const existing = [...players];
      existing[inputId] = e.target.value;
      dispatch(setPlayers(existing));
    };

  return (
    <Box display="flex" flexDirection="column">
      {/* Always have an additional input field to write to */}
      {Array.from({ length: min(players.length + 1, MAX_PLAYERS) }).map(
        (_, idx) => {
          const id = `player-name-${idx + 1}`;
          return (
            <Fade in timeout={500} key={idx}>
              <TextField
                sx={{
                  mb: 3,
                  '&:last-child': {
                    mb: 0,
                  },
                }}
                inputProps={{
                  'data-testid': id,
                }}
                // This is required for the tests
                id={id}
                key={id}
                label={`Player ${idx + 1}`}
                type="text"
                placeholder="Player name"
                value={players[idx] || ''}
                onChange={handlePlayerChange(idx)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <RoomIcon style={{ color: markers.colors[idx] }} />
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
};
export default FormPlayers;
