import {Alert, AlertColor, AlertTitle, Box, Button} from '@mui/material';
import Link from 'next/link';

type ErrorPros = {
  primaryAction?: () => void;
  primaryActionText?: string;
  secondaryAction?: () => void;
  secondaryActionText?: string;
  error: string;
  info?: string;
  title?: string;
  severity?: AlertColor;
};

export const Error = ({
  primaryAction,
  primaryActionText,
  secondaryAction,
  secondaryActionText,
  title = 'Something went wrong',
  info,
  error,
  severity = 'error',
}: ErrorPros) => {
  return (
    <Box padding={4} margin="auto">
      <Alert variant="outlined" severity={severity}>
        <AlertTitle>{title}</AlertTitle>
        {info && <p>{info}</p>}
        <p>
          <strong>Message:</strong>
        </p>
        <pre style={{whiteSpace: 'pre-wrap', overflow: 'auto'}}>{error}</pre>
      </Alert>

      <Box
        textAlign="center"
        display="flex"
        justifyContent="space-between"
        sx={{mt: 2}}
      >
        {secondaryAction ? (
          <Button onClick={secondaryAction}>{secondaryActionText}</Button>
        ) : (
          <Link href="/" passHref>
            <Button>Home</Button>
          </Link>
        )}

        {primaryAction && primaryActionText && (
          <Button variant="contained" onClick={primaryAction} sx={{mr: 3}}>
            {primaryActionText}
          </Button>
        )}
      </Box>
    </Box>
  );
};
