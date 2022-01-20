import createCache from '@emotion/cache/';
import Box from '@mui/material/Box';
import {keyframes} from '@mui/material/styles';

export const createEmotionCache = () => {
  return createCache({key: 'css', prepend: true});
};

export const keyedColorFade =
  (prop: string) =>
  (...steps: [number, string][]) => {
    const gradient = steps
      .map(([perc, color]) => `${perc}% {${prop}: ${color}}`)
      .join(' ');
    return keyframes(gradient);
  };

export const colorize = (txt: string, color: 'g' | 'v') => (
  <Box
    component="span"
    color={color === 'g' ? 'success.main' : 'secondary.main'}
  >
    <b>{txt}</b>
  </Box>
);
