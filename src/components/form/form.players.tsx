import gameConfig from '@config/game';
import markerConfig from '@config/markers';
import RoomIcon from '@mui/icons-material/Room';
import { Box, Fade, InputAdornment, TextField } from '@mui/material';
import { min } from '@utils';
import { Dispatch, SetStateAction } from 'react';

type FormPlayerProps = {
  players: string[];
  inputError: boolean;
  clearInputError: () => void;
  setPlayers: Dispatch<SetStateAction<string[]>>;
};

const MAX_PLAYERS = gameConfig.maxPlayers;

export default function FormPlayers({
  players,
  inputError,
  clearInputError,
  setPlayers,
}: FormPlayerProps) {
  const handlePlayerChange =
    (inputId: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const existing = players.filter(Boolean);
      existing[inputId] = e.target.value;
      setPlayers(existing);

      if (existing.length) {
        clearInputError();
      }
    };

  const handleInputBlur = (isLast: boolean) => {
    const existing = players.filter(Boolean);
    if (isLast) {
      existing.push('');
      setPlayers(existing);
    } else {
      setPlayers(existing);
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      {/* Always have an additional input field to write to */}
      {Array.from({ length: min(players.length + 1, MAX_PLAYERS) }).map(
        (_, idx) => {
          const isFirst = idx === 0;
          const isLast = players.length === idx;

          const id = `player-input-${idx + 1}`;

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
                required={idx === 0}
                error={isFirst && inputError}
                helperText={
                  isFirst && inputError && 'Needs at least one player'
                }
                type="text"
                placeholder="Player name"
                value={players[idx] || ''}
                onInput={() => handleInputBlur(isLast)}
                onBlur={() => handleInputBlur(isLast)}
                onChange={handlePlayerChange(idx)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <RoomIcon style={{ color: markerConfig.colors[idx] }} />
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
