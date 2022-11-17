import createCache from '@emotion/cache';
import Box from '@mui/material/Box';
import {keyframes} from '@mui/material/styles';

const isBrowser = typeof document !== 'undefined';

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({key: 'mui-style', insertionPoint});
}

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
