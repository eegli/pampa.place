import Box from '@mui/material/Box';

export const em = (txt: string, color: 'g' | 'v') => (
  <Box
    component="span"
    color={color === 'g' ? 'success.main' : 'secondary.main'}
  >
    <b>{txt}</b>
  </Box>
);
