import HomeIcon from '@mui/icons-material/Home';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

type PlayHeaderProps = {
  player: string;
  time: number;
};

export default function PlayHeader({ player, time }: PlayHeaderProps) {
  const router = useRouter();
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
            {time}s
          </Typography>
        </Box>
      </Stack>

      <IconButton sx={{ mx: 2 }} size="large" edge="end" onClick={handleClick}>
        <HomeIcon />
      </IconButton>
    </Box>
  );
}
