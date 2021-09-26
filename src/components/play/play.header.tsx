import config from '@/config/game';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';

type PlayHeaderProps = {
  player: string;
  timerCallback: () => void;
};

export default function PlayHeader({ player, timerCallback }: PlayHeaderProps) {
  const router = useRouter();

  const [timeRemaining] = useTimer(config.timeLimit);

  useEffect(() => {
    if (!timeRemaining) {
      timerCallback();
    }
  }, [timeRemaining]);

  function handleClick() {
    router.push('/');
  }

  return (
    <Box px={2} my={2} width="100%" display="flex">
      <Stack
        flexGrow={1}
        display="flex"
        justifyContent="center"
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <Box textAlign="right">
          <Typography
            variant="caption"
            color={'text.secondary'}
            sx={{
              textTransform: 'uppercase',
            }}
          >
            Your turn
          </Typography>
          <Typography variant="h5">{player}</Typography>
        </Box>
        <Box>
          <Typography
            variant="caption"
            color={'text.secondary'}
            sx={{
              textTransform: 'uppercase',
            }}
          >
            Time remaining
          </Typography>
          <Typography variant="h5" color={'secondary.main'}>
            {timeRemaining}s
          </Typography>
        </Box>
      </Stack>

      <IconButton sx={{ mx: 2 }} size="large" edge="end" onClick={handleClick}>
        <HomeIcon />
      </IconButton>
    </Box>
  );
}
