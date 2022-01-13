import Box from '@mui/material/Box';
import {keyframes} from '@mui/material/styles';

type KeyedColorFadeProps = [number, string][];

export const keyedColorFade =
  (prop: string) =>
  (...steps: KeyedColorFadeProps) => {
    const gradient = steps
      .map(([perc, color]) => `${perc}% {${prop}: ${color}}`)
      .join(' ');
    return keyframes(gradient);
  };

export const em = (txt: string, color: 'g' | 'v') => (
  <Box
    component="span"
    color={color === 'g' ? 'success.main' : 'secondary.main'}
  >
    <b>{txt}</b>
  </Box>
);
