import createCache from '@emotion/cache/';
import {keyframes} from '@mui/material/styles';

export const keyedColorFade =
  (prop: string) =>
  (...steps: [number, string][]) => {
    const gradient = steps
      .map(([perc, color]) => `${perc}% {${prop}: ${color}}`)
      .join(' ');
    return keyframes(gradient);
  };

export const createEmotionCache = () => {
  return createCache({key: 'css', prepend: true});
};
