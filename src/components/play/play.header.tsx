import { useAppSelector } from '@/redux/hooks';
import { formatDuration } from '@/utils/misc';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';

type PlayHeaderProps = {
  player: string;
  timerCallback: () => void;
};

const getLabel = (unlimited: boolean, time: number) => {
  return unlimited ? <span>&#8734;</span> : <span>{formatDuration(time)}</span>;
};

const PlayHeader = ({ player, timerCallback }: PlayHeaderProps) => {
  const router = useRouter();
  const timeLimit = useAppSelector(s => s.game.timeLimit);
  const [timeRemaining] = useTimer(timeLimit);

  const isUnlimitedTimeMode = timeLimit < 0;

  const label = getLabel(isUnlimitedTimeMode, timeRemaining);

  useEffect(() => {
    if (!timeRemaining && !isUnlimitedTimeMode) {
      timerCallback();
    }
  }, [timeRemaining, isUnlimitedTimeMode, timerCallback]);

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
            {label}
          </Typography>
        </Box>
      </Stack>

      <IconButton sx={{ mx: 2 }} size="large" edge="end" onClick={handleClick}>
        <HomeIcon />
      </IconButton>
    </Box>
  );
};
export default PlayHeader;
