import {useAppSelector} from '@/redux/hooks';
import {formatDur} from '@/utils/misc';
import {Box, Divider, Stack, Typography} from '@mui/material';
import {red} from '@mui/material/colors';
import {useEffect} from 'react';
import {useTimer} from '../../../hooks/useTimer';
import {keyedColorFade} from '../../../styles/utils';

type PlayHeaderProps = {
  player: string;
  timerCallback: () => void;
};

export const PlayHeader = ({player, timerCallback}: PlayHeaderProps) => {
  const timeLimit = useAppSelector(s => s.game.timeLimit);
  const [timeRemaining] = useTimer(timeLimit);
  const isUnlimitedTimeMode = timeLimit < 0;

  const label = isUnlimitedTimeMode ? (
    <span>&#8734;</span>
  ) : (
    <span>{formatDur(timeRemaining)}</span>
  );

  useEffect(() => {
    if (!timeRemaining && !isUnlimitedTimeMode) {
      timerCallback();
    }
  }, [timeRemaining, isUnlimitedTimeMode, timerCallback]);

  return (
    <Box my={2} width="100%" display="flex">
      <Stack
        flexGrow={1}
        display="flex"
        justifyContent="center"
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        sx={{
          animationDuration: `${timeLimit + 1}s`,
          animationName: ({palette}) =>
            `${keyedColorFade('background-color')(
              [50, palette.background.default],
              [100, red[600]]
            )}`,
        }}
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
          <Typography
            variant="h5"
            sx={{
              color: ({palette}) => palette.secondary.main,
              animationDuration: `${timeLimit + 1}s`,
              animationName: ({palette}) =>
                `${keyedColorFade('color')(
                  [50, palette.secondary.main],
                  [100, palette.text.primary]
                )}`,
            }}
          >
            {label}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
