import {Alert, AlertTitle, Box, Button} from '@mui/material';
import Link from 'next/link';

type ErrorPros = {
  callback?: () => void;
  title?: string;
  info?: string;
  reason?: string;
};

export const Error = ({
  callback,
  title = 'Something went wrong',
  info,
  reason,
}: ErrorPros) => {
  return (
    <Box padding={4} margin="auto">
      <Alert variant="outlined" severity="error">
        <AlertTitle>{title}</AlertTitle>
        <p>{info}</p>
        <p>
          <strong>Message:</strong>
        </p>
        <pre style={{whiteSpace: 'pre-wrap', overflow: 'auto'}}>{reason}</pre>
      </Alert>
      {callback && (
        <Box
          textAlign="center"
          display="flex"
          justifyContent="space-between"
          sx={{mt: 2}}
        >
          <Link href="/" passHref>
            <Button>Choose different map</Button>
          </Link>
          <Button variant="contained" onClick={callback} sx={{mr: 3}}>
            Retry
          </Button>
        </Box>
      )}
    </Box>
  );
};
