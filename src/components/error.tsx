import { Alert, AlertTitle, Button, Box } from '@mui/material';

type ErrorPros = {
  callback?: () => void;
  title?: string;
  info?: string;
  reason?: string;
};

export default function Error({ callback, title, info, reason }: ErrorPros) {
  const errTitle = title || 'Something went wrong';

  return (
    <Box padding={4}>
      <Alert variant='outlined' severity='error'>
        <AlertTitle>{errTitle}</AlertTitle>
        <p>{info}</p>
        <p>
          <strong>Message:</strong>
        </p>
        <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{reason}</pre>
      </Alert>
      {callback && (
        <Box textAlign='center'>
          <Button variant='contained' sx={{ mt: 2 }} onClick={callback}>
            Retry
          </Button>
        </Box>
      )}
    </Box>
  );
}
